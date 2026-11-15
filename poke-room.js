/* 🏠 포켓몬 방 — 우리가족 앱(다빈 '포켓몬 방' 탭)과 우리집 한눈에(아이패드 큰 화면)가 같이 씀.
   미션 스티커 1장 = 포켓몬 1마리 + 열매 1개. 열매를 먹이면 진화(첫 단계 3개, 둘째 단계 5개).
   황금 스티커 1개 = 가구 1개. 황금 스티커를 2주 연속 받으면 ✨ 반짝이, 4개마다 전설의 포켓몬이 놀러 옴.
   자료는 kids.{k}.room (stickers-shared.js 맨 위 설명). 방 배경·가구는 직접 그린 것/이모지, 포켓몬 그림만 poke/ 폴더.
   쓰는 법: const room = PokeRoom.mount(el, { kid, lang: () => 'ko', data: () => kids[k], write: (path, v) => …, big }); room.update(); room.destroy(); */
(() => {
  'use strict';
  const FS = window.FamilyStickers;
  const HOME_MAX = 10;
  // 한국어 조사: 받침이 있으면 이/으로, 없으면 가/로 (ㄹ 받침은 로)
  const jong = (w) => { const c = w.charCodeAt(w.length - 1) - 0xAC00; return c >= 0 && c < 11172 ? c % 28 : 0; };
  const iga = (w) => w + (jong(w) ? '이' : '가'), euro = (w) => w + (jong(w) && jong(w) !== 8 ? '으로' : '로');
  const T = {
    ko: { berry: '열매', deco: '꾸미기', dex: '도감', feedHint: '열매를 줄 포켓몬을 눌러요', noBerry: '미션을 다 하면 열매를 받아요', empty: '미션을 다 하고 선물 상자를 열면 포켓몬이 와요!',
      ate: (n) => `냠냠! ${n}`, evolved: (a, b) => `${iga(a)} ${euro(b)} 진화했어요!`, shinyCame: (n) => `✨ ${iga(n)} 반짝반짝 빛나요!`, legendCame: (n) => `🌟 전설의 포켓몬 ${iga(n)} 놀러 왔어요!`,
      decoHead: (n, free) => `🏅 황금 스티커 ${n}개 · 고를 수 있는 가구 ${free}개`, decoTip: '가구를 눌러 놓거나 치워요. 방에서 끌어서 옮겨요.', locked: '🏅 황금 스티커를 받으면 고를 수 있어요',
      dexHead: (n) => `도감 ${n} / 151`, homeHead: (n) => `방에 나온 친구 ${n} / ${HOME_MAX} — 눌러서 넣고 빼요`, homeFull: `방에는 ${HOME_MAX}마리까지 나올 수 있어요`, close: '닫기', sleep: '쿨쿨… 밤이라 자고 있어요', toEvo: (n) => `진화까지 열매 ${n}개` },
    de: { berry: 'Beeren', deco: 'Möbel', dex: 'Pokédex', feedHint: 'Tippe ein Pokémon an, um es zu füttern', noBerry: 'Für jede geschaffte Mission gibt es eine Beere', empty: 'Schaffe deine Missionen und öffne das Geschenk – dann kommt ein Pokémon!',
      ate: (n) => `Mampf! ${n}`, evolved: (a, b) => `${a} hat sich zu ${b} entwickelt!`, shinyCame: (n) => `✨ ${n} glitzert jetzt!`, legendCame: (n) => `🌟 Das legendäre ${n} ist zu Besuch!`,
      decoHead: (n, free) => `🏅 ${n} Goldsticker · ${free} Möbel frei`, decoTip: 'Tippe zum Aufstellen oder Wegräumen. Im Zimmer ziehen zum Verschieben.', locked: '🏅 Mit einem Goldsticker freischalten',
      dexHead: (n) => `Pokédex ${n} / 151`, homeHead: (n) => `Im Zimmer ${n} / ${HOME_MAX} – tippen zum Rein/Raus`, homeFull: `Höchstens ${HOME_MAX} Pokémon im Zimmer`, close: 'Schließen', sleep: 'Zzz… nachts wird geschlafen', toEvo: (n) => `Noch ${n} Beeren bis zur Entwicklung` },
  };
  // 가구: [이모지, 기본 x, 기본 y, 벽(1)이면 벽에 붙음, 크기]
  const DECO = {
    rug: ['', 50, 80, 0, 1], bed: ['🛏️', 16, 70, 0, 1.5], sofa: ['🛋️', 82, 66, 0, 1.4], plant: ['🪴', 7, 58, 0, 1.1], teddy: ['🧸', 30, 90, 0, .9],
    ball: ['⚽', 62, 92, 0, .7], balloon: ['🎈', 92, 30, 1, 1], piano: ['🎹', 66, 60, 0, 1.2], tent: ['⛺', 40, 64, 0, 1.4], frame: ['🖼️', 70, 22, 1, 1],
    rainbow: ['🌈', 22, 18, 1, 1.2], clock: ['🕰️', 50, 12, 1, .9], books: ['📚', 92, 88, 0, .9], cake: ['🍰', 52, 72, 0, .8], kite: ['🪁', 36, 26, 1, 1], slide: ['🛝', 24, 62, 0, 1.4],
  };
  const css = `
.pr { --pr-s: 1; position: relative; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
.pr-room { position: relative; width: 100%; aspect-ratio: 4 / 3; border-radius: 18px; overflow: hidden; touch-action: none;
  background: linear-gradient(#FFF4E0 0 52%, #E8B27A 52% 53.2%, #D9A066 53.2%) ; box-shadow: inset 0 0 0 3px rgba(0,0,0,.06); }
.pr-room::before { content: ''; position: absolute; inset: 53.2% 0 0; background: repeating-linear-gradient(90deg, transparent 0 11.5%, rgba(120,70,30,.18) 11.5% 12%), repeating-linear-gradient(0deg, transparent 0 24%, rgba(120,70,30,.10) 24% 25%); }
.pr-room::after { content: ''; position: absolute; inset: 0 0 48%; background: radial-gradient(circle at 12px 12px, rgba(255,180,120,.22) 3px, transparent 3.5px) 0 0 / 28px 28px; pointer-events: none; }
.pr-win { position: absolute; left: 38%; top: 9%; width: 24%; height: 30%; border-radius: 10px 10px 4px 4px; border: 5px solid #fff; box-shadow: 0 2px 0 rgba(0,0,0,.08);
  background: linear-gradient(#8ED6FF, #D6F1FF); overflow: hidden; z-index: 1; }
.pr-win::before { content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 4px; margin-left: -2px; background: #fff; box-shadow: 0 0 0 0 #fff; }
.pr-win::after { content: ''; position: absolute; left: 0; right: 0; top: 50%; height: 4px; margin-top: -2px; background: #fff; }
.pr-win i { position: absolute; left: 14%; top: 16%; width: 26%; aspect-ratio: 1; border-radius: 50%; background: #FFE066; box-shadow: 0 0 12px #FFE066; }
.pr-win b { position: absolute; right: 8%; top: 52%; width: 40%; height: 18%; border-radius: 20px; background: #fff; opacity: .9; }
.pr.night .pr-room { background: linear-gradient(#4B4E7A 0 52%, #3A3550 52% 53.2%, #5C4A63 53.2%); }
.pr.night .pr-win { background: linear-gradient(#1D2457, #3B3F7C); }
.pr.night .pr-win i { background: #FFF3B0; box-shadow: -6px 0 0 0 #1D2457 inset, 0 0 10px #FFF3B0; }
.pr.night .pr-win b { opacity: .15; }
.pr-mon, .pr-deco { position: absolute; transform: translate(-50%, -100%); background: none; border: 0; padding: 0; margin: 0; cursor: grab; touch-action: none; -webkit-tap-highlight-color: transparent; }
.pr-mon { transition: left var(--d, 2s) linear, top var(--d, 2s) linear; }
.pr-mon.drag, .pr-deco.drag { transition: none; cursor: grabbing; }
.pr-mon img { display: block; image-rendering: pixelated; pointer-events: none; transform-origin: 50% 100%; }
.pr-mon.flip img { transform: scaleX(-1); }
.pr-mon::after { content: ''; position: absolute; left: 15%; right: 15%; bottom: -3px; height: 8px; border-radius: 50%; background: rgba(0,0,0,.16); z-index: -1; }
.pr-mon.jump img { animation: pr-jump .5s ease-out; }
.pr-mon.flip.jump img { animation-name: pr-jumpf; }
@keyframes pr-jump { 40% { transform: translateY(-28%) scaleY(1.05); } 70% { transform: translateY(0) scaleY(.9); } }
@keyframes pr-jumpf { 40% { transform: scaleX(-1) translateY(-28%) scaleY(1.05); } 70% { transform: scaleX(-1) translateY(0) scaleY(.9); } }
.pr-mon.evo img { animation: pr-evo 1.4s ease-in-out; }
@keyframes pr-evo { 0%, 100% { filter: none; } 20%, 60% { filter: brightness(0) invert(1); transform: scale(1.15); } 40%, 80% { filter: none; } }
.pr-mon .zz { position: absolute; right: -6px; top: -10px; font-size: calc(14px * var(--pr-s)); animation: pr-zz 2.4s infinite; pointer-events: none; }
@keyframes pr-zz { 0% { opacity: 0; transform: translateY(6px); } 40% { opacity: 1; } 100% { opacity: 0; transform: translateY(-12px); } }
.pr-mon .shine { position: absolute; left: 0; top: 0; font-size: calc(12px * var(--pr-s)); animation: pr-tw 1.6s infinite; pointer-events: none; }
@keyframes pr-tw { 50% { opacity: .2; transform: scale(.6); } }
.pr-bub { position: absolute; transform: translate(-50%, -100%); background: #fff; color: #333; border-radius: 14px; padding: .3em .7em; font-weight: 700; font-size: calc(13px * var(--pr-s));
  white-space: nowrap; box-shadow: 0 3px 10px rgba(0,0,0,.15); pointer-events: none; z-index: 999; animation: pr-bub 1.8s forwards; }
@keyframes pr-bub { 0% { opacity: 0; margin-top: 6px; } 12%, 80% { opacity: 1; margin-top: 0; } 100% { opacity: 0; margin-top: -8px; } }
.pr-heart { position: absolute; pointer-events: none; z-index: 998; font-size: calc(18px * var(--pr-s)); animation: pr-heart 1s ease-out forwards; }
@keyframes pr-heart { to { opacity: 0; transform: translate(var(--hx), -60px) scale(1.4); } }
.pr-deco { font-size: calc(48px * var(--pr-s) * var(--z, 1)); line-height: 1; filter: drop-shadow(0 3px 0 rgba(0,0,0,.12)); }
.pr-deco.rug { width: calc(150px * var(--pr-s)); height: calc(52px * var(--pr-s)); transform: translate(-50%, -50%); border-radius: 50%;
  background: repeating-radial-gradient(ellipse, #FF9EB5 0 10%, #FFD3DE 10% 20%); filter: none; opacity: .9; }
.pr-empty { position: absolute; inset: 58% 8% auto; text-align: center; font-weight: 700; color: #7A4A20; font-size: calc(14px * var(--pr-s)); z-index: 2; }
.pr-bar { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
.pr-bar button { flex: 1; min-width: 0; border: 0; border-radius: 14px; padding: calc(10px * var(--pr-s)) 8px; font: inherit; font-weight: 700; font-size: calc(15px * var(--pr-s));
  background: #FFF0D6; color: #6B3E12; cursor: pointer; }
.pr-bar button[aria-pressed="true"] { background: #FF8A3D; color: #fff; box-shadow: 0 0 0 3px #FFD2B0; }
.pr-bar button:disabled { opacity: .5; }
.pr-msg { margin: 8px 2px 0; min-height: 1.3em; font-size: calc(13px * var(--pr-s)); color: #8A6A4A; text-align: center; }
.pr-news { position: absolute; left: 50%; top: 6%; transform: translateX(-50%); z-index: 1000; background: #FFF8D6; color: #6B3E12; font-weight: 800; border-radius: 16px;
  padding: .55em 1em; box-shadow: 0 6px 18px rgba(0,0,0,.18); font-size: calc(15px * var(--pr-s)); text-align: center; max-width: 90%; animation: pr-news 4.5s forwards; pointer-events: none; }
@keyframes pr-news { 0% { opacity: 0; transform: translate(-50%, -10px) scale(.9); } 8%, 85% { opacity: 1; transform: translate(-50%, 0) scale(1); } 100% { opacity: 0; } }
.pr-panel { margin-top: 10px; background: #FFFaF0; border-radius: 16px; padding: 12px; box-shadow: inset 0 0 0 2px #FFE3BF; }
.pr-panel h4 { margin: 0 0 8px; font-size: calc(14px * var(--pr-s)); color: #6B3E12; display: flex; justify-content: space-between; gap: 8px; align-items: center; }
.pr-panel h4 button { border: 0; background: none; font: inherit; color: #B07040; cursor: pointer; }
.pr-panel p { margin: 0 0 8px; font-size: calc(12px * var(--pr-s)); color: #9A7A5A; }
.pr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(calc(64px * var(--pr-s)), 1fr)); gap: 6px; margin-bottom: 10px; }
.pr-grid button { position: relative; border: 0; border-radius: 12px; background: #fff; padding: 4px 2px; font: inherit; font-size: calc(10.5px * var(--pr-s)); color: #6B3E12; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; gap: 2px; box-shadow: 0 1px 0 rgba(0,0,0,.06); }
.pr-grid button img { width: 80%; aspect-ratio: 1; object-fit: contain; }
.pr-grid button .e { font-size: calc(30px * var(--pr-s)); line-height: 1.3; }
.pr-grid button.on { background: #FFE2C4; box-shadow: 0 0 0 2px #FF8A3D; }
.pr-grid button.lock { opacity: .45; }
.pr-grid button.unk img { filter: brightness(0); opacity: .18; }
.pr-grid button .b { position: absolute; right: 3px; top: 2px; font-size: calc(10px * var(--pr-s)); }
.pr-grid button .n { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; }
.pr-grid button .rug-ic { width: 70%; height: calc(22px * var(--pr-s)); margin: calc(8px * var(--pr-s)) 0; border-radius: 50%; background: repeating-radial-gradient(ellipse, #FF9EB5 0 18%, #FFD3DE 18% 36%); }
`;
  function addCss() {
    if (document.getElementById('pr-css')) return;
    const st = document.createElement('style'); st.id = 'pr-css'; st.textContent = css; document.head.append(st);
  }
  function el(tag, props, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') e.className = v; else if (k === 'text') e.textContent = v; else if (k === 'style') e.style.cssText = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v);
    }
    for (const c of kids) if (c != null && c !== false) e.append(c);
    return e;
  }
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const isNight = () => { const h = new Date().getHours(); return h >= 20 || h < 7; };
  const keyOf = (x) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;

  function mount(root, o) {
    addCss();
    if (root._pr) root._pr.destroy(); // 같은 자리에 방이 이미 있으면 먼저 정리 (방은 한 자리에 하나만)
    const L = () => T[o.lang() === 'de' ? 'de' : 'ko'];
    const name = (id) => FS.pokeName(id, o.lang());
    const roomEl = el('div', { class: 'pr-room' });
    const win = el('div', { class: 'pr-win', 'aria-hidden': 'true' }, el('i'), el('b'));
    roomEl.append(win);
    const btnBerry = el('button', { type: 'button', 'aria-pressed': 'false' });
    const btnDeco = el('button', { type: 'button', 'aria-pressed': 'false' });
    const btnDex = el('button', { type: 'button', 'aria-pressed': 'false' });
    const msg = el('p', { class: 'pr-msg' });
    const panel = el('div', { class: 'pr-panel', hidden: '' });
    const wrap = el('div', { class: 'pr' }, roomEl, el('div', { class: 'pr-bar' }, btnBerry, btnDeco, btnDex), msg, panel);
    root.replaceChildren(wrap);
    let feeding = false, open = '', alive = true, granted = false, scale = 1;
    const monEls = new Map(), decoEls = new Map();

    const room = () => (o.data() && o.data().room) || {};
    const mons = () => Object.entries(room().mons || {}).filter(([, m]) => m && FS.DEX[m.p]).map(([id, m]) => ({ id, ...m })).sort((a, b) => (a.at || 0) - (b.at || 0));
    const homeIds = () => {
      const all = mons(), h = room().home;
      if (Array.isArray(h)) { const ok = new Set(all.map((m) => m.id)); return h.filter((id) => ok.has(id)); }
      return all.slice(-HOME_MAX).map((m) => m.id);
    };
    const berries = () => Math.max(0, mons().filter((m) => !m.g).length - (room().used || 0));
    const golds = () => Object.keys((o.data() && o.data().golds) || {}).sort();
    const need = (m) => (FS.pokeStage(m.p) === 1 ? 3 : 5);

    // 처음 열 때: 이미 받은 미션 스티커도 포켓몬으로 방에 넣음
    function seed() {
      const r = room(), d = o.data() || {};
      if (r.seeded) return;
      for (const [id, s] of Object.entries(d.stickers || {})) {
        if (!s || (r.mons && r.mons[id])) continue;
        const p = FS.pokeOf(typeof s.d === 'number' ? s.d : 0);
        o.write(['room', 'mons', id], { p, b: p, at: s.at || Date.now(), f: 0 });
      }
      o.write(['room', 'seeded'], true);
    }
    // 황금 스티커 2주 연속 → ✨ 반짝이 한 마리, 황금 스티커 4개마다 → 🌟 전설의 포켓몬
    function grants() {
      if (granted) return;
      const g = golds(), all = mons();
      if (!all.length) return;
      let streak = 0;
      const set = new Set(g);
      for (const w of g) { const [y, m, d] = w.split('-').map(Number); if (set.has(keyOf(new Date(y, m - 1, d - 7)))) streak++; }
      const shinies = all.filter((m) => m.s).length;
      if (streak > shinies) {
        const home = new Set(homeIds()), cand = all.filter((m) => !m.s && !m.g && home.has(m.id));
        const m = cand.length ? pick(cand) : null;
        if (m) { granted = true; const { id, ...v } = m; o.write(['room', 'mons', id], { ...v, s: true }); news(L().shinyCame(name(m.p))); return; }
      }
      const legends = all.filter((m) => m.g).length;
      if (Math.floor(g.length / 4) > legends) {
        const have = new Set(all.map((m) => m.p)), cand = FS.LEGEND_IDS.filter((x) => !have.has(x));
        const p = pick(cand.length ? cand : FS.LEGEND_IDS);
        granted = true;
        const uid = 'L' + Date.now().toString(36), h = room().home;
        o.write(['room', 'mons', uid], { p, b: p, at: Date.now(), f: 0, g: 1 });
        if (Array.isArray(h)) o.write(['room', 'home'], [...h.slice(-(HOME_MAX - 1)), uid]); // 기본(최근 10마리)이면 저절로 보임
        news(L().legendCame(name(p)));
      }
    }
    function news(t) {
      const n = el('div', { class: 'pr-news', text: t });
      roomEl.append(n); setTimeout(() => n.remove(), 4600);
      if (o.snd) o.snd.tada();
    }
    function bubble(x, y, t) {
      const b = el('div', { class: 'pr-bub', text: t, style: `left:${x}%;top:${y}%` });
      roomEl.append(b); setTimeout(() => b.remove(), 1900);
    }
    function hearts(x, y) {
      for (let i = 0; i < 5; i++) {
        const hh = el('span', { class: 'pr-heart', text: pick(['💖', '💕', '🍓']), style: `left:${x}%;top:${y}%;--hx:${rnd(-30, 30)}px;animation-delay:${i * 0.08}s` });
        roomEl.append(hh); setTimeout(() => hh.remove(), 1400);
      }
    }

    // ── 포켓몬 ──
    function placeMon(e, x, y, d) {
      const ox = parseFloat(e.style.left) || x;
      if (Math.abs(x - ox) > 0.5) e.classList.toggle('flip', x > ox);
      e.style.setProperty('--d', `${d}s`);
      e.style.left = `${x}%`; e.style.top = `${y}%`; e.style.zIndex = String(10 + Math.round(y));
    }
    function sizeImg(img) {
      if (!img.naturalWidth) return;
      img.style.width = `${img.naturalWidth * scale}px`;
    }
    function monEl(m) {
      const img = el('img', { alt: '', draggable: 'false' });
      img.onload = () => sizeImg(img);
      const e = el('button', { type: 'button', class: 'pr-mon', 'aria-label': name(m.p) }, img);
      e._img = img;
      setSprite(e, m);
      placeMon(e, rnd(10, 90), rnd(62, 95), 0);
      dragable(e, () => tapMon(e), (x, y) => { placeMon(e, x, Math.max(58, y), 0); e._rest = Date.now() + 6000; });
      return e;
    }
    function setSprite(e, m) {
      const key = `${m.p}/${m.s ? 1 : 0}`;
      if (e._key === key) return;
      e._key = key; e._img.src = FS.pokeWalk(m.p, m.s);
      e.setAttribute('aria-label', name(m.p));
      e.querySelector('.shine') && e.querySelector('.shine').remove();
      if (m.s) e.append(el('span', { class: 'shine', text: '✨' }));
    }
    function tapMon(e) {
      const m = (room().mons || {})[e._id];
      if (!m) return;
      const x = parseFloat(e.style.left), y = parseFloat(e.style.top) - 14;
      e.classList.remove('jump'); void e.offsetWidth; e.classList.add('jump');
      if (feeding && berries() > 0) return feed(e, m, x, y);
      if (o.snd) o.snd.boing();
      const nx = FS.pokeNext(m.p).length ? L().toEvo(Math.max(1, need(m) - (m.f || 0))) : '';
      bubble(x, y, `${m.s ? '✨ ' : ''}${name(m.p)}${'💖'.repeat(Math.min(3, Math.ceil((m.f || 0) / 2)))}`);
      if (nx) msg.textContent = `${name(m.p)} · ${nx}`;
    }
    function feed(e, m, x, y) {
      const f = (m.f || 0) + 1, nexts = FS.pokeNext(m.p);
      hearts(x, y);
      if (o.snd) o.snd.coin();
      o.write(['room', 'used'], (room().used || 0) + 1);
      if (nexts.length && f >= need(m)) {
        const to = pick(nexts), from = m.p;
        e.classList.add('evo');
        setTimeout(() => { o.write(['room', 'mons', e._id], { ...m, p: to, f: 0 }); }, 700);
        setTimeout(() => { e.classList.remove('evo'); news(L().evolved(name(from), name(to))); }, 1400);
      } else {
        o.write(['room', 'mons', e._id], { ...m, f });
        bubble(x, y, L().ate(name(m.p)));
      }
      setTimeout(renderBar, 50); // 열매가 다 떨어지면 renderBar 가 먹이기를 끔
    }
    // 끌어서 옮기기 (조금만 움직이면 '누르기')
    function dragable(e, onTap, onMove, onDrop) {
      let st = null;
      e.addEventListener('pointerdown', (ev) => { st = { x: ev.clientX, y: ev.clientY, moved: false }; try { e.setPointerCapture(ev.pointerId); } catch {} });
      e.addEventListener('pointermove', (ev) => {
        if (!st) return;
        if (!st.moved && Math.hypot(ev.clientX - st.x, ev.clientY - st.y) < 8) return;
        st.moved = true; e.classList.add('drag');
        const r = roomEl.getBoundingClientRect();
        const x = Math.min(97, Math.max(3, ((ev.clientX - r.left) / r.width) * 100)), y = Math.min(99, Math.max(8, ((ev.clientY - r.top) / r.height) * 100 + (e.classList.contains('rug') ? 0 : 6)));
        onMove(x, y);
      });
      const end = () => { if (!st) return; const moved = st.moved; st = null; e.classList.remove('drag'); if (moved) { if (onDrop) onDrop(); } else onTap(); };
      e.addEventListener('pointerup', end); e.addEventListener('pointercancel', () => { st = null; e.classList.remove('drag'); });
      e.addEventListener('click', (ev) => ev.preventDefault());
    }
    function wander() {
      if (!alive) return;
      if (!root.isConnected) return destroy();
      if (!root.offsetParent || isNight()) return;
      for (const e of monEls.values()) {
        if (e.classList.contains('drag') || (e._rest && Date.now() < e._rest) || Math.random() > 0.3) continue;
        const ox = parseFloat(e.style.left), oy = parseFloat(e.style.top);
        const x = Math.min(94, Math.max(6, ox + rnd(-28, 28))), y = Math.min(96, Math.max(60, oy + rnd(-12, 12)));
        const d = Math.max(1, Math.hypot(x - ox, (y - oy) * 0.75) / 9);
        placeMon(e, x, y, d.toFixed(2));
        e._rest = Date.now() + d * 1000 + rnd(800, 3500);
      }
    }

    // ── 가구 ──
    function decoEl(key) {
      const [em, , , , z] = DECO[key];
      const e = el('div', { class: 'pr-deco' + (key === 'rug' ? ' rug' : ''), text: em, style: `--z:${z}` });
      dragable(e, () => {}, (x, y) => { e.style.left = `${x}%`; e.style.top = `${y}%`; e.style.zIndex = key === 'rug' ? '3' : String(10 + Math.round(y)); },
        () => o.write(['room', 'deco', key], { ...((room().deco || {})[key] || {}), x: Math.round(parseFloat(e.style.left)), y: Math.round(parseFloat(e.style.top)) }));
      return e;
    }

    function renderRoom() {
      wrap.classList.toggle('night', isNight());
      scale = Math.min(2.4, Math.max(1, roomEl.clientWidth / 300));
      wrap.style.setProperty('--pr-s', o.big ? Math.min(1.8, Math.max(1, roomEl.clientWidth / 520)).toFixed(2) : '1');
      // 가구
      const deco = room().deco || {};
      for (const [key, e] of decoEls) if (!deco[key] || deco[key].off || !DECO[key]) { e.remove(); decoEls.delete(key); }
      for (const [key, v] of Object.entries(deco)) {
        if (!DECO[key] || !v || v.off) continue;
        let e = decoEls.get(key);
        if (!e) { e = decoEl(key); decoEls.set(key, e); roomEl.append(e); }
        if (!e.classList.contains('drag')) {
          const [, dx, dy, wall] = DECO[key], x = typeof v.x === 'number' ? v.x : dx, y = typeof v.y === 'number' ? v.y : dy;
          e.style.left = `${x}%`; e.style.top = `${y}%`; e.style.zIndex = key === 'rug' ? '3' : String(wall ? 2 : 10 + Math.round(y));
        }
      }
      // 포켓몬
      const all = Object.fromEntries(mons().map((m) => [m.id, m])), home = homeIds();
      for (const [id, e] of monEls) if (!home.includes(id)) { e.remove(); monEls.delete(id); }
      for (const id of home) {
        const m = all[id];
        let e = monEls.get(id);
        if (!e) { e = monEl(m); e._id = id; monEls.set(id, e); roomEl.append(e); }
        else setSprite(e, m);
        for (const z of e.querySelectorAll('.zz')) z.remove();
        if (isNight()) e.append(el('span', { class: 'zz', text: '💤' }));
        if (e._img.complete) sizeImg(e._img);
      }
      let empty = roomEl.querySelector('.pr-empty');
      if (!home.length && !empty) roomEl.append(el('div', { class: 'pr-empty', text: L().empty }));
      if (home.length && empty) empty.remove();
    }
    function renderBar() {
      const b = berries();
      if (!b) feeding = false;
      btnBerry.textContent = `🍓 ${L().berry} ${b}`;
      btnBerry.setAttribute('aria-pressed', String(feeding));
      btnDeco.textContent = `🪑 ${L().deco}`;
      btnDeco.setAttribute('aria-pressed', String(open === 'deco'));
      const seen = new Set(mons().map((m) => m.p));
      btnDex.textContent = `📖 ${seen.size}/151`;
      btnDex.setAttribute('aria-pressed', String(open === 'dex'));
      msg.textContent = feeding ? L().feedHint : isNight() ? L().sleep : b ? '' : L().noBerry;
      roomEl.style.cursor = feeding ? 'pointer' : '';
    }
    function renderPanel() {
      panel.hidden = !open;
      if (!open) return panel.replaceChildren();
      const closeB = el('button', { type: 'button', text: `✕ ${L().close}`, onclick: () => { open = ''; renderAll(); } });
      if (open === 'deco') {
        const deco = room().deco || {}, owned = Object.keys(deco).filter((k) => DECO[k]), free = Math.max(0, golds().length - owned.length);
        panel.replaceChildren(el('h4', {}, el('span', { text: L().decoHead(golds().length, free) }), closeB), el('p', { text: free || owned.length ? L().decoTip : L().locked }),
          el('div', { class: 'pr-grid' }, ...Object.keys(DECO).map((key) => {
            const v = deco[key], has = !!v, on = has && !v.off;
            const ic = key === 'rug' ? el('span', { class: 'rug-ic' }) : el('span', { class: 'e', text: DECO[key][0] });
            return el('button', { type: 'button', class: on ? 'on' : has || free ? '' : 'lock', onclick: () => {
              if (has) o.write(['room', 'deco', key], { ...v, off: on ? true : null });
              else if (free) o.write(['room', 'deco', key], { x: DECO[key][1], y: DECO[key][2] });
              else return;
              if (o.snd) o.snd.stick();
            } }, ic, has ? null : el('span', { class: 'b', text: free ? '🏅' : '🔒' }));
          })));
      } else {
        const all = mons(), home = homeIds(), seen = new Set(all.map((m) => m.p));
        const grid = el('div', { class: 'pr-grid' }, ...[...all].reverse().map((m) => el('button', { type: 'button', class: home.includes(m.id) ? 'on' : '', onclick: () => {
          const h = homeIds(), i = h.indexOf(m.id);
          if (i >= 0) h.splice(i, 1); else if (h.length >= HOME_MAX) { msg.textContent = L().homeFull; return; } else h.push(m.id);
          o.write(['room', 'home'], h); if (o.snd) o.snd.tap(i >= 0 ? 1 : 3);
        } }, el('img', { src: FS.pokeArt(m.p), alt: '', loading: 'lazy' }), el('span', { class: 'n', text: name(m.p) }), m.s ? el('span', { class: 'b', text: '✨' }) : m.g ? el('span', { class: 'b', text: '🌟' }) : null)));
        const dex = el('div', { class: 'pr-grid' }, ...Array.from({ length: FS.POKE_N }, (_, i) => i + 1).map((id) => el('button', { type: 'button', class: seen.has(id) ? '' : 'unk', tabindex: '-1' },
          el('img', { src: FS.pokeArt(id), alt: '', loading: 'lazy' }), el('span', { class: 'n', text: seen.has(id) ? name(id) : `#${id}` }))));
        panel.replaceChildren(el('h4', {}, el('span', { text: L().homeHead(home.length) }), closeB), all.length ? grid : el('p', { text: L().empty }),
          el('h4', {}, el('span', { text: L().dexHead(seen.size) })), dex);
      }
    }
    function renderAll() { if (!alive) return; renderRoom(); renderBar(); renderPanel(); }

    btnBerry.addEventListener('click', () => { if (!berries()) { msg.textContent = L().noBerry; return; } feeding = !feeding; if (o.snd) o.snd.tap(2); renderBar(); });
    btnDeco.addEventListener('click', () => { open = open === 'deco' ? '' : 'deco'; feeding = false; renderAll(); });
    btnDex.addEventListener('click', () => { open = open === 'dex' ? '' : 'dex'; feeding = false; renderAll(); });
    const timer = setInterval(wander, 1200);
    const nightTimer = setInterval(() => { if (wrap.classList.contains('night') !== isNight()) renderAll(); }, 60e3);
    const ro = window.ResizeObserver ? new ResizeObserver(() => renderRoom()) : null;
    if (ro) ro.observe(roomEl);
    function destroy() { alive = false; clearInterval(timer); clearInterval(nightTimer); if (ro) ro.disconnect(); }
    renderAll();
    // 쓰기는 mount 가 끝난 다음에 (앱이 쓰자마자 화면을 다시 그리면서 방을 또 만들지 않게)
    setTimeout(() => { if (alive) seed(); }, 0);
    setTimeout(() => { if (alive) grants(); }, 900);
    root._pr = { update: () => { renderAll(); if (!granted) grants(); }, destroy };
    return root._pr;
  }
  window.PokeRoom = { mount, DECO };
})();
