// 우리가족 캘린더 서버 (Cloudflare Worker, 무료 요금제)
//
// 구글 캘린더 연결을 한 번만 하면, 이 서버가 구글의 '갱신 토큰'을 보관해 두고 매번 새 접근 토큰을 받아
// 일정을 읽어 줌. 그래서 앱에서 한 시간마다 다시 로그인할 필요가 없고, 같은 가족 코드로 로그인한
// 가족(예: 남편 휴대폰)도 엄마 캘린더를 볼 수 있음.
//
//   POST /connect     { ret }                  → { url }  구글 동의 화면 주소
//   GET  /callback    ?code&state              → 토큰 저장 후 앱으로 돌아감
//   POST /events      { timeMin, timeMax }     → { accounts, calendars, events }
//   POST /disconnect  { email }                → { ok }
//   POST /photo                                → 가족사진 (그 가족만)
//   POST /photo/upload  (이미지 본문)           → { ok }
//
// POST 는 모두  Authorization: Bearer <Firebase ID 토큰>  필요. 가족 코드는 Firestore users/{uid}.house 에서
// 그 사람의 토큰으로 직접 읽으므로, 앱이 보낸 값을 믿지 않음.
//
// 비밀 값 (wrangler secret put): GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
// 저장소 (KV): STORE  — house:{코드} → 연결된 구글 계정들, nonce:{n} → 연결 중 상태(10분), at:{email} → 접근 토큰(50분)

const FIREBASE_PROJECT = "shopping-list-ae06d";
const ALLOWED_ORIGINS = ["https://trykyn.github.io", "http://localhost:8766"];
const APP_URL = "https://trykyn.github.io/our-family/";
const SCOPES = ["openid", "email", "https://www.googleapis.com/auth/calendar.readonly"];
const CAL = "https://www.googleapis.com/calendar/v3";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const cors = {
      "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin",
    };
    const json = (body, status = 200) =>
      new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json; charset=utf-8" } });

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method === "GET" && url.pathname === "/callback") return callback(url, env);
    if (request.method !== "POST") return json({ error: "not_found" }, 404);

    let me;
    try {
      me = await whoAmI((request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, ""));
    } catch (e) {
      return json({ error: e.message === "no_house" ? "no_house" : "unauthorized" }, e.message === "no_house" ? 409 : 401);
    }
    // 가족사진: 로그인한 같은 가족에게만 (공개 저장소에는 두지 않음)
    if (url.pathname === "/photo") {
      const { value, metadata } = await env.STORE.getWithMetadata(`photo:${me.house}`, "arrayBuffer");
      if (!value) return json({ error: "no_photo" }, 404);
      return new Response(value, { headers: { ...cors, "Content-Type": (metadata && metadata.type) || "image/webp", "Cache-Control": "private, no-store" } });
    }
    if (url.pathname === "/photo/upload") {
      const type = (request.headers.get("Content-Type") || "").split(";")[0].trim();
      if (!["image/jpeg", "image/png", "image/webp"].includes(type)) return json({ error: "bad_type" }, 400);
      const buf = await request.arrayBuffer();
      if (!buf.byteLength || buf.byteLength > 3 * 1024 * 1024) return json({ error: "too_big" }, 413);
      await env.STORE.put(`photo:${me.house}`, buf, { metadata: { type, by: me.uid, at: Date.now() } });
      return json({ ok: true });
    }

    let body = {};
    try { body = await request.json(); } catch {}

    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) return json({ error: "not_configured" }, 503);
    try {
      if (url.pathname === "/connect") return json(await connect(env, me, body));
      if (url.pathname === "/events") return json(await events(env, me, body));
      if (url.pathname === "/disconnect") return json(await disconnect(env, me, body));
    } catch (e) {
      console.warn(url.pathname, String(e));
      return json({ error: "failed" }, 502);
    }
    return json({ error: "not_found" }, 404);
  },
};

/* ---------- 누구인지, 어느 가족인지 ---------- */

let keyCache = { keys: null, until: 0 };
async function googleKeys() {
  if (keyCache.keys && Date.now() < keyCache.until) return keyCache.keys;
  const r = await fetch("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com");
  const { keys } = await r.json();
  const maxAge = Number(((r.headers.get("Cache-Control") || "").match(/max-age=(\d+)/) || [])[1] || 3600);
  keyCache = { keys, until: Date.now() + maxAge * 1000 };
  return keys;
}
const b64url = (s) => {
  const b = s.replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(b + "=".repeat((4 - (b.length % 4)) % 4)), (c) => c.charCodeAt(0));
};
const jwtPayload = (t) => JSON.parse(new TextDecoder().decode(b64url(String(t).split(".")[1])));

async function verifyFirebaseToken(token) {
  const [h, p, sig] = String(token).split(".");
  if (!h || !p || !sig) throw new Error("malformed");
  const dec = new TextDecoder();
  const header = JSON.parse(dec.decode(b64url(h)));
  const payload = JSON.parse(dec.decode(b64url(p)));
  if (header.alg !== "RS256") throw new Error("alg");
  const jwk = (await googleKeys()).find((k) => k.kid === header.kid);
  if (!jwk) throw new Error("kid");
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64url(sig), new TextEncoder().encode(`${h}.${p}`));
  if (!ok) throw new Error("signature");
  const now = Date.now() / 1000;
  if (payload.aud !== FIREBASE_PROJECT || payload.iss !== `https://securetoken.google.com/${FIREBASE_PROJECT}`) throw new Error("audience");
  if (!payload.sub || payload.exp < now - 60 || payload.iat > now + 300) throw new Error("expired");
  return payload;
}

async function whoAmI(idToken) {
  const user = await verifyFirebaseToken(idToken);
  // Firestore 규칙상 자기 users 문서만 읽을 수 있음 → 그 사람이 속한 가족 코드.
  const r = await fetch(
    `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents/users/${encodeURIComponent(user.sub)}`,
    { headers: { Authorization: `Bearer ${idToken}` } });
  const doc = r.ok ? await r.json() : null;
  const house = doc && doc.fields && doc.fields.house && doc.fields.house.stringValue;
  if (!house) throw new Error("no_house");
  return { uid: user.sub, email: user.email || "", house };
}

/* ---------- 구글 계정 연결 ---------- */

const redirectUri = (env) => env.REDIRECT_URI;
const loadHouse = async (env, house) => (await env.STORE.get(`house:${house}`, "json")) || { accounts: [] };
const saveHouse = (env, house, data) => env.STORE.put(`house:${house}`, JSON.stringify(data));

async function connect(env, me, body) {
  let ret = APP_URL;
  try {
    const u = new URL(String(body.ret || ""));
    if (ALLOWED_ORIGINS.includes(u.origin)) ret = u.href;
  } catch {}
  const nonce = [...crypto.getRandomValues(new Uint8Array(24))].map((b) => b.toString(16).padStart(2, "0")).join("");
  await env.STORE.put(`nonce:${nonce}`, JSON.stringify({ uid: me.uid, house: me.house, ret }), { expirationTtl: 600 });
  const q = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri(env),
    response_type: "code",
    scope: SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent select_account",
    include_granted_scopes: "true",
    state: nonce,
  });
  return { url: `https://accounts.google.com/o/oauth2/v2/auth?${q}` };
}

function page(title, text, ret, ok) {
  const safe = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const target = new URL(ret);
  const back = ret.split("#")[0] + "#calendar";
  return new Response(`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${safe(title)}</title><style>body{font-family:system-ui,sans-serif;background:#EEF8FD;color:#12324A;display:grid;place-items:center;min-height:100vh;margin:0;padding:16px;text-align:center}
a{display:inline-block;margin-top:16px;padding:12px 20px;border-radius:14px;background:#6AAFE6;color:#0E2A40;font-weight:600;text-decoration:none}</style></head>
<body><div><h1 style="font-size:22px">${safe(title)}</h1><p>${safe(text)}</p><a href="${safe(back)}">우리가족으로 / Zurück</a></div>
<script>try{if(window.opener){window.opener.postMessage({gcal:${ok ? "'connected'" : "'failed'"}},${JSON.stringify(target.origin)});setTimeout(()=>window.close(),${ok ? 300 : 4000});}else if(${ok}){location.replace(${JSON.stringify(back)});}}catch(e){}</script>
</body></html>`, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}

async function callback(url, env) {
  const state = url.searchParams.get("state") || "";
  const pending = state && (await env.STORE.get(`nonce:${state}`, "json"));
  if (!pending) return page("연결 시간이 지났어요", "앱에서 다시 연결해 주세요. / Bitte in der App erneut verbinden.", APP_URL, false);
  await env.STORE.delete(`nonce:${state}`);
  if (url.searchParams.get("error")) return page("연결을 취소했어요", "Verbindung abgebrochen.", pending.ret, false);

  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: url.searchParams.get("code") || "",
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri(env),
      grant_type: "authorization_code",
    }),
  });
  const tok = await r.json().catch(() => ({}));
  if (!r.ok || !tok.access_token) {
    console.warn("token exchange", r.status, JSON.stringify(tok));
    return page("연결하지 못했어요", "잠시 후 다시 해 주세요. / Bitte später erneut versuchen.", pending.ret, false);
  }
  if (!String(tok.scope || "").includes("calendar.readonly")) {
    return page("캘린더 권한이 필요해요", "구글 화면에서 캘린더 보기에 체크해 주세요. / Bitte den Kalender-Zugriff erlauben.", pending.ret, false);
  }
  const email = (tok.id_token && jwtPayload(tok.id_token).email) || "";
  const data = await loadHouse(env, pending.house);
  const old = data.accounts.find((a) => a.email === email);
  const refresh = tok.refresh_token || (old && old.refresh);
  if (!refresh) return page("연결하지 못했어요", "다시 연결해 주세요. / Bitte erneut verbinden.", pending.ret, false);
  if (old) Object.assign(old, { refresh, by: pending.uid, broken: false });
  else data.accounts.push({ email, refresh, by: pending.uid, added: Date.now() }); // 처음 연결한 계정 = 기본
  await saveHouse(env, pending.house, data);
  await env.STORE.put(`at:${email}`, tok.access_token, { expirationTtl: Math.max(60, Math.min(3000, (tok.expires_in || 3600) - 300)) });
  return page("연결했어요", "이 창은 닫아도 돼요. / Verbunden – dieses Fenster kann geschlossen werden.", pending.ret, true);
}

async function disconnect(env, me, body) {
  const data = await loadHouse(env, me.house);
  const acc = data.accounts.find((a) => a.email === body.email);
  if (!acc) return { ok: true };
  data.accounts = data.accounts.filter((a) => a !== acc);
  await saveHouse(env, me.house, data);
  await env.STORE.delete(`at:${acc.email}`);
  fetch("https://oauth2.googleapis.com/revoke", { method: "POST", body: new URLSearchParams({ token: acc.refresh }) }).catch(() => {});
  return { ok: true };
}

/* ---------- 일정 읽기 ---------- */

async function accessToken(env, acc) {
  const cached = await env.STORE.get(`at:${acc.email}`);
  if (cached) return cached;
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      refresh_token: acc.refresh,
      grant_type: "refresh_token",
    }),
  });
  const tok = await r.json().catch(() => ({}));
  if (!r.ok || !tok.access_token) {
    const err = new Error(tok.error === "invalid_grant" ? "revoked" : `refresh ${r.status}`);
    err.revoked = tok.error === "invalid_grant";
    throw err;
  }
  await env.STORE.put(`at:${acc.email}`, tok.access_token, { expirationTtl: Math.max(60, Math.min(3000, (tok.expires_in || 3600) - 300)) });
  return tok.access_token;
}

async function api(token, path, params) {
  const r = await fetch(`${CAL}/${path}?${new URLSearchParams(params)}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!r.ok) throw new Error(`calendar ${r.status} ${path}`);
  return r.json();
}

async function events(env, me, body) {
  const timeMin = new Date(body.timeMin), timeMax = new Date(body.timeMax);
  if (isNaN(timeMin) || isNaN(timeMax) || timeMax <= timeMin || timeMax - timeMin > 100 * 864e5) throw new Error("range");
  const data = await loadHouse(env, me.house);
  const accounts = [], calendars = [], out = [];
  const seenCal = new Set();
  let changed = false;

  for (const [i, acc] of data.accounts.entries()) {
    const info = { email: acc.email, main: i === 0, ok: true };
    accounts.push(info);
    try {
      const token = await accessToken(env, acc);
      const list = await api(token, "users/me/calendarList", { minAccessRole: "reader", maxResults: "250" });
      const cals = (list.items || []).filter((c) => (c.selected || c.primary) && !c.hidden && !seenCal.has(c.id));
      cals.forEach((c) => seenCal.add(c.id));
      const lists = await Promise.all(cals.map((c) =>
        api(token, `calendars/${encodeURIComponent(c.id)}/events`, {
          timeMin: timeMin.toISOString(), timeMax: timeMax.toISOString(),
          singleEvents: "true", orderBy: "startTime", maxResults: "500",
        }).catch((e) => { console.warn(String(e)); return { items: [] }; })));
      cals.forEach((c, k) => {
        calendars.push({
          id: c.id, account: acc.email, primary: !!c.primary,
          name: c.summaryOverride || c.summary || c.id, color: c.backgroundColor || "#6AAFE6",
        });
        for (const it of lists[k].items || []) {
          if (it.status === "cancelled" || !it.start) continue;
          out.push({ id: it.id, cal: c.id, title: it.summary || "", start: it.start, end: it.end || it.start });
        }
      });
      if (acc.broken) { acc.broken = false; changed = true; }
    } catch (e) {
      console.warn("account", acc.email, String(e));
      info.ok = false;
      if (e.revoked && !acc.broken) { acc.broken = true; changed = true; }
    }
  }
  if (changed) await saveHouse(env, me.house, data);
  return { accounts, calendars, events: out, at: Date.now() };
}
