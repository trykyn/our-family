/* 🐷 저금통 — 우리가족 앱(다빈 🐷 탭) · 우리집 한눈에(아이패드 다빈 창)이 같이 씀. 여기를 고치면 두 앱에 한꺼번에.
   직접 그린 돼지 저금통 + 5€ 지폐 · 1€ · 50c · 20c · 10c. 누르거나 저금통으로 끌어 놓으면 구멍으로 쏙 → 짤랑, 저금통 들썩, 금액 올라감.
   연달아 넣은 돈은 1.5초 모아서 기록 한 줄로 저장 (money.{id} = { at, amt, note: '@coins', by }).
   자료: kids.{k}.money.{id} = { at, amt(+받음 −씀, 유로), note('@키' 또는 직접 쓴 글), src?, tr?, by } — 금액 = amt 합계.
   쓰는 법: const pb = PiggyBank.mount(el, {
     kid, lang: () => 'ko'|'de', data: () => kids[k], write: (path, v) => …(kids.{k} 아래 경로),
     snd?, locked?() = 아이 잠금 중이면 true (그때 돈을 누르면 guard 로 부모 확인 뒤 들어감), guard?(fn), by?(),
     onBalHold?() = 금액을 2초 꾹 눌렀을 때 (부모용 금액 맞추기), history?: 보여 줄 기록 줄 수 (0 = 안 보임),
     hint?(잠김) = 동전 위 안내 글, text?: { hint, lockedHint, … 문구 바꾸기 }, big? });
   pb.update(); pb.flush(); pb.pending(); pb.coinsOut(금액) = 썼어요 그림; pb.cheer() = 받았어요 그림; pb.destroy();
   PiggyBank.NOTES = 기록 이유 그림 [그림, 한국어, 독일어]. 쓰기는 돈을 넣을 때만 (mount 중에는 쓰지 않음). */
(() => {
  'use strict';
  const T = {
    ko: { hint: '동전을 저금통에 넣어 봐!', lockedHint: '🔒 엄마·아빠 비밀번호를 넣고 넣어요', pig: '저금통', noMoney: '아직 기록이 없어요.', in: '받았어요', out: '썼어요' },
    de: { hint: 'Wirf die Münzen ins Sparschwein!', lockedHint: '🔒 Mit dem Eltern-Code einwerfen', pig: 'Sparschwein', noMoney: 'Noch keine Einträge.', in: 'Bekommen', out: 'Ausgegeben' },
  };
  // 기록 이유: [그림, 한국어, 독일어]
  const NOTES = {
    coins: ['🪙', '동전 넣기', 'Münzen eingeworfen'], allowance: ['💶', '용돈', 'Taschengeld'], gift: ['🎁', '선물 받음', 'Geschenk'], tooth: ['🦷', '이빨 요정', 'Zahnfee'], found: ['⭐', '칭찬 보상', 'Belohnung'],
    snack: ['🍭', '간식', 'Süßigkeiten'], toy: ['🧸', '장난감', 'Spielzeug'], save: ['🐷', '저금', 'Sparen'],
  };
  const PIG_SVG = `<svg viewBox="0 0 220 160" aria-hidden="true">
    <path d="M30 86c-18-2-22-18-12-22 8-3 10 8 2 10" fill="none" stroke="#F27BA6" stroke-width="5" stroke-linecap="round"/>
    <rect x="52" y="118" width="22" height="30" rx="9" fill="#F48AB2"/><rect x="138" y="118" width="22" height="30" rx="9" fill="#F48AB2"/>
    <rect x="80" y="124" width="20" height="26" rx="9" fill="#F79CC0"/><rect x="118" y="124" width="20" height="26" rx="9" fill="#F79CC0"/>
    <path d="M124 46c0-13 10-22 24-22 4 9-2 20-14 25z" fill="#F07FAA"/>
    <ellipse cx="106" cy="90" rx="78" ry="56" fill="#FFA9CB"/>
    <path d="M144 48c3-14 17-23 34-20 4 2 5 6 3 10-4 10-14 18-26 20-6 1-10-3-11-10z" fill="#FF97BE"/>
    <path d="M150 47c3-9 12-15 23-14 2 1 2 3 1 5-3 7-10 12-18 14-4 1-6-2-6-5z" fill="#FFC9DE"/>
    <ellipse cx="78" cy="70" rx="30" ry="16" fill="#fff" opacity=".35"/>
    <rect x="80" y="36" width="44" height="10" rx="5" fill="#9B3D63"/>
    <ellipse cx="182" cy="92" rx="22" ry="18" fill="#FF8DB8"/><ellipse cx="176" cy="92" rx="3.6" ry="5.5" fill="#B2456F"/><ellipse cx="189" cy="92" rx="3.6" ry="5.5" fill="#B2456F"/>
    <circle cx="158" cy="74" r="6" fill="#3B1B2B"/><circle cx="160" cy="72" r="2" fill="#fff"/>
    <ellipse cx="148" cy="106" rx="10" ry="6" fill="#FF6F9E" opacity=".45"/>
  </svg>`;
  // 돈: 5€ 지폐(회색), 1€(가운데 은색 + 금색 테두리), 50c·20c·10c(금색). 실제 크기 비율에 가깝게
  const COINS = [{ v: 5, w: 100, h: 54, label: '5', unit: '€', bill: true }, { v: 1, size: 64, label: '1', unit: '€', bi: true }, { v: 0.5, size: 66, label: '50', unit: 'c' }, { v: 0.2, size: 60, label: '20', unit: 'c' }, { v: 0.1, size: 54, label: '10', unit: 'c' }];
  function coinSVG(c) {
    if (c.bill) return `<svg viewBox="0 0 120 64" aria-hidden="true">
      <rect x="1" y="1" width="118" height="62" rx="6" fill="#C8D2CF" stroke="#8C9A96" stroke-width="2"/>
      <rect x="7" y="7" width="106" height="50" rx="4" fill="none" stroke="#A8B5B1" stroke-width="1.5" stroke-dasharray="3 2"/>
      <path d="M60 52V32a13 13 0 0 1 26 0v20" fill="none" stroke="#9AA8A4" stroke-width="6"/><path d="M66 52V34a7 7 0 0 1 14 0v18" fill="#B3C0BC"/>
      <rect x="96" y="7" width="9" height="50" fill="#E2C35C" opacity=".75"/>
      <text x="32" y="42" text-anchor="middle" font-family="Jua, sans-serif" font-size="36" fill="#4B5A56">5</text>
      <text x="32" y="55" text-anchor="middle" font-family="Jua, sans-serif" font-size="11" fill="#4B5A56">EURO</text>
    </svg>`;
    const ring = c.bi ? '#E2B84A' : '#D9A92E', face = c.bi ? '#D5DAE0' : '#F0C64E', ink = c.bi ? '#5A6470' : '#8A6200';
    return `<svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="${ring}"/><circle cx="50" cy="50" r="48" fill="none" stroke="${c.bi ? '#B8902A' : '#B88A1C'}" stroke-width="3" stroke-dasharray="3 3"/>
      <circle cx="50" cy="50" r="${c.bi ? 34 : 40}" fill="${face}"/>
      <path d="M26 34a30 30 0 0 1 22-14" stroke="#fff" stroke-width="5" opacity=".6" fill="none" stroke-linecap="round"/>
      <text x="50" y="${c.unit === '€' ? 62 : 58}" text-anchor="middle" font-family="Jua, sans-serif" font-size="${c.label.length > 1 ? 34 : 42}" fill="${ink}">${c.label}</text>
      <text x="50" y="80" text-anchor="middle" font-family="Jua, sans-serif" font-size="16" fill="${ink}">${c.unit === '€' ? 'EURO' : 'CENT'}</text>
    </svg>`;
  }

  const css = `
.pb { --pb-c: var(--kc, var(--mc, #C93A72)); display: grid; }
.pb-bank { position: relative; display: grid; justify-items: center; gap: 0; padding: 4px 0 6px; }
.pb-pig { width: 210px; max-width: 70%; border: 0; background: none; padding: 0; cursor: pointer; }
.pb.big .pb-pig { width: 250px; }
.pb-pig svg { width: 100%; height: auto; display: block; overflow: visible; }
.pb-pig.bump svg { animation: pb-bump .45s cubic-bezier(.2, 1.6, .4, 1); }
.pb-pig.wig svg { animation: pb-wig .5s ease-in-out; }
.pb-pig.tip svg { animation: pb-tip .75s ease-in-out; transform-origin: 50% 80%; }
@keyframes pb-bump { 0% { transform: translateY(0) scale(1); } 35% { transform: translateY(6px) scale(1.06, .92); } 70% { transform: translateY(-8px) scale(.97, 1.04); } 100% { transform: none; } }
@keyframes pb-wig { 0%, 100% { transform: rotate(0) scale(1); } 20% { transform: rotate(-10deg) scale(1.08); } 40% { transform: rotate(8deg) scale(1.08) translateY(-6px); } 60% { transform: rotate(-6deg) scale(1.04); } 80% { transform: rotate(3deg); } }
@keyframes pb-tip { 0%, 100% { transform: none; } 25% { transform: translateY(-8px) rotate(-14deg); } 50% { transform: translateY(-12px) rotate(12deg); } 75% { transform: translateY(-5px) rotate(-7deg); } }
.pb-bal { font-family: var(--font-display, inherit); font-size: 38px; color: var(--pb-c); line-height: 1.1; padding: 2px 12px; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; }
.pb.big .pb-bal { font-size: 44px; }
.pb-bal.pop { animation: pb-pop .45s cubic-bezier(.2, 1.6, .4, 1); }
@keyframes pb-pop { 0% { transform: scale(1); } 40% { transform: scale(1.18); } 100% { transform: scale(1); } }
.pb-hint { margin: 2px 0 8px; text-align: center; font-size: 15px; font-weight: 700; color: var(--pb-c); }
.pb-coins { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: center; gap: 10px 12px; margin-bottom: 16px; }
.pb-coins .br { flex-basis: 100%; height: 0; } /* 5€ 지폐 한 줄, 동전 한 줄 */
.pb-coin { border: 0; background: none; padding: 0; cursor: grab; touch-action: none; -webkit-user-select: none; user-select: none; }
.pb-coin svg { display: block; width: 100%; height: 100%; filter: drop-shadow(0 3px 2px rgba(0, 0, 0, .18)); }
.pb-coin:active svg { transform: scale(.94); }
.pb-coins.locked .pb-coin { opacity: .5; filter: grayscale(.5); }
.pb-fly { position: fixed; z-index: 250; pointer-events: none; }
.pb-fly svg { width: 100%; height: 100%; display: block; }
.pb-plus { position: fixed; z-index: 260; pointer-events: none; font-family: var(--font-display, inherit); font-size: 24px; color: #2E9D5A; text-shadow: 0 1px 0 #fff; animation: pb-up .9s ease-out forwards; }
@keyframes pb-up { from { transform: translate(-50%, 0); opacity: 1; } to { transform: translate(-50%, -48px); opacity: 0; } }
.pb-conf { position: fixed; z-index: 300; width: 9px; height: 13px; border-radius: 2px; pointer-events: none; animation: pb-conf 1.1s ease-out forwards; }
@keyframes pb-conf { to { transform: translate(var(--dx), calc(var(--dy) + 160px)) rotate(var(--rot)); opacity: 0; } }
.pb-hist { list-style: none; margin: 0; padding: 0; display: grid; }
.pb-hist li { display: flex; align-items: center; gap: 10px; padding: 7px 0; border-top: 1px solid rgba(0, 0, 0, .08); }
.pb-hist li:first-child { border-top: 0; }
.pb-hist .t { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pb-hist .d { flex: none; font-size: 13px; opacity: .6; font-variant-numeric: tabular-nums; }
.pb-hist .amt { flex: none; font-weight: 700; font-variant-numeric: tabular-nums; }
.pb-hist .amt.plus { color: #2E9D5A; }
.pb-hist .amt.minus { color: #D64545; }
.pb-hist .none { opacity: .6; }
.pb.big .pb-hist li { font-size: 18px; padding: 9px 0; }
`;
  function addCss() {
    if (document.getElementById('pb-css')) return;
    const st = document.createElement('style'); st.id = 'pb-css'; st.textContent = css; document.head.prepend(st); // 맨 앞: 각 앱 CSS가 덮어쓸 수 있게
  }
  function el(tag, props, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') e.className = v; else if (k === 'text') e.textContent = v; else if (k === 'html') e.innerHTML = v; else if (k === 'style') e.style.cssText = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v);
    }
    for (const c of kids) if (c != null && c !== false) e.append(c);
    return e;
  }
  const fmt = (n) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n || 0); // 독일 돈이니까 늘 0,00 €
  const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const sumOf = (d) => Object.values((d && d.money) || {}).reduce((a, m) => a + (Number(m && m.amt) || 0), 0);
  const cw = (c) => c.w || c.size, ch = (c) => c.h || c.size;

  function mount(root, o) {
    addCss();
    if (root._pb) root._pb.destroy(); // 같은 자리에는 저금통 하나만
    const lang = () => (o.lang && o.lang() === 'de' ? 'de' : 'ko');
    const L = () => ({ ...T[lang()], ...((o.text && (o.text[lang()] || o.text)) || {}) });
    const snd = { tap() {}, coin() {}, oink() {}, ...(o.snd || {}) };
    const locked = () => !!(o.locked && o.locked());
    const guard = o.guard || ((fn) => fn());
    const W = (path, v) => o.write(path, v);
    const zoom = o.big ? 1.25 : 1;
    let alive = true, pending = 0, timer = 0;
    const pig = el('button', { type: 'button', class: 'pb-pig', html: PIG_SVG });
    const bal = el('span', { class: 'pb-bal' });
    const hint = el('p', { class: 'pb-hint' });
    const coins = el('div', { class: 'pb-coins' });
    const hist = el('ul', { class: 'pb-hist' });
    const wrap = el('div', { class: 'pb' + (o.big ? ' big' : '') }, el('div', { class: 'pb-bank' }, pig, bal), hint, coins, o.history ? hist : null);
    root.replaceChildren(wrap);

    function anim(e, c) { e.classList.remove('bump', 'wig', 'tip', 'pop'); void e.offsetWidth; e.classList.add(c); clearTimeout(e._pbT); e._pbT = setTimeout(() => e.classList.remove(c), 800); }
    function confetti(target, n = 22) {
      const r = target.getBoundingClientRect(), colors = ['#FF6B6B', '#FFD23F', '#5BC0EB', '#9BE564', '#C79BF2', '#FF9F1C', '#FF7EB6'];
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 110;
        const p = el('i', { class: 'pb-conf', style: `left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;background:${colors[i % colors.length]};--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d - 60}px;--rot:${Math.random() * 720 - 360}deg` });
        document.body.append(p); setTimeout(() => p.remove(), 1200);
      }
    }
    const noteText = (m) => {
      const v = m.note || '';
      if (v.startsWith('@')) { const t = NOTES[v.slice(1)]; return t ? `${t[0]} ${t[lang() === 'de' ? 2 : 1]}` : ''; }
      return m.src && m.src !== lang() && m.tr ? m.tr : v; // 다른 언어로 쓴 글은 번역이 있으면 번역
    };
    function render(popIt) {
      if (!alive) return;
      bal.textContent = fmt(Math.round((sumOf(o.data()) + pending) * 100) / 100);
      if (popIt) anim(bal, 'pop');
      hint.textContent = (o.hint && o.hint(locked())) || (locked() ? L().lockedHint || L().hint : L().hint);
      coins.classList.toggle('locked', locked());
      pig.setAttribute('aria-label', L().pig);
      if (o.history) {
        const ms = Object.values((o.data() || {}).money || {}).filter((m) => m && m.note !== '@adjust' && m.note !== '@carry').sort((a, b) => (b.at || 0) - (a.at || 0)).slice(0, o.history);
        hist.replaceChildren(...(ms.length ? ms.map((m) => { const d = new Date(m.at || 0);
          return el('li', {}, el('span', { class: 't', text: noteText(m) || (m.amt >= 0 ? L().in : L().out) }), el('span', { class: 'd', text: `${d.getMonth() + 1}/${d.getDate()}` }),
            el('span', { class: 'amt ' + (m.amt >= 0 ? 'plus' : 'minus'), text: (m.amt >= 0 ? '+' : '−') + fmt(Math.abs(m.amt)) })); })
          : [el('li', { class: 'none', text: L().noMoney })]));
      }
    }
    function flush() {
      clearTimeout(timer);
      if (!pending) return;
      const amt = Math.round(pending * 100) / 100;
      pending = 0;
      W(['money', newId()], { at: Date.now(), amt, note: '@coins', ...(o.by ? { by: o.by() } : {}) });
    }
    function landed(c) {
      if (!alive) return;
      snd.coin();
      anim(pig, 'bump');
      pending = Math.round((pending + c.v) * 100) / 100;
      render(true);
      // "+50c" 가 저금통 위로 떠오름
      const r = pig.getBoundingClientRect();
      const t = el('div', { class: 'pb-plus', text: c.v >= 1 ? `+${c.v} €` : `+${Math.round(c.v * 100)} c` });
      t.style.left = `${r.left + r.width / 2}px`; t.style.top = `${r.top - 6}px`;
      document.body.append(t);
      setTimeout(() => t.remove(), 950);
      clearTimeout(timer);
      timer = setTimeout(flush, 1500);
    }
    // 돈을 (from 위치에서) 저금통 구멍으로 날려 보냄
    function fly(c, from) {
      const pr = pig.getBoundingClientRect();
      const tx = pr.left + pr.width * (102 / 220), ty = pr.top + pr.height * (41 / 160);
      const f = el('div', { class: 'pb-fly', html: coinSVG(c) });
      Object.assign(f.style, { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px` });
      document.body.append(f);
      const dx = tx - (from.left + from.width / 2), dy = ty - (from.top + from.height / 2);
      const a = f.animate([
        { transform: 'translate(0, 0) rotate(0) scale(1)' },
        { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 70}px) rotate(200deg) scale(1.08)`, offset: 0.5 },
        { transform: `translate(${dx}px, ${dy - 10}px) rotate(360deg) scale(.75, .75)`, offset: 0.82 },
        { transform: `translate(${dx}px, ${dy + 14}px) rotate(360deg) scale(.12, .6)`, opacity: 0 },
      ], { duration: 680, easing: 'cubic-bezier(.45, 0, .55, 1)' });
      a.onfinish = () => { f.remove(); landed(c); };
    }
    const btns = COINS.map((c) => {
      const w = cw(c) * zoom, ht = ch(c) * zoom;
      const b = el('button', { type: 'button', class: 'pb-coin', style: `width:${w}px;height:${ht}px`, 'aria-label': c.v >= 1 ? `${c.v} €` : `${Math.round(c.v * 100)} Cent`, html: coinSVG(c) });
      // 누르면 날아가고, 끌어서 저금통에 놓아도 들어감
      let start = null, ghost = null;
      b.addEventListener('pointerdown', (e) => { if (locked()) return; start = { x: e.clientX, y: e.clientY, id: e.pointerId }; try { b.setPointerCapture(e.pointerId); } catch {} });
      // 잠겨 있으면: 누르면 부모 확인 → 맞으면 그 돈이 쏙
      b.addEventListener('click', () => { if (locked()) guard(() => fly(c, b.getBoundingClientRect())); });
      b.addEventListener('pointermove', (e) => {
        if (!start || e.pointerId !== start.id) return;
        if (!ghost && Math.hypot(e.clientX - start.x, e.clientY - start.y) < 8) return;
        if (!ghost) { ghost = el('div', { class: 'pb-fly', html: coinSVG(c) }); Object.assign(ghost.style, { width: `${w}px`, height: `${ht}px` }); document.body.append(ghost); snd.tap(1); }
        ghost.style.left = `${e.clientX - w / 2}px`; ghost.style.top = `${e.clientY - ht / 2}px`;
      });
      const end = (e, cancel) => {
        if (!start || e.pointerId !== start.id) return;
        start = null;
        if (!ghost) { if (!cancel) fly(c, b.getBoundingClientRect()); return; }
        const g = ghost; ghost = null;
        const pr = pig.getBoundingClientRect(), gr = g.getBoundingClientRect();
        const cx = gr.left + gr.width / 2, cy = gr.top + gr.height / 2;
        const over = !cancel && cx > pr.left - 20 && cx < pr.right + 20 && cy > pr.top - 40 && cy < pr.bottom + 10;
        if (over) { g.remove(); fly(c, gr); return; }
        // 저금통 밖에 놓으면 제자리로
        const br = b.getBoundingClientRect();
        g.animate([{ transform: 'none' }, { transform: `translate(${br.left - gr.left}px, ${br.top - gr.top}px)` }], { duration: 250, easing: 'ease-out' }).onfinish = () => g.remove();
      };
      b.addEventListener('pointerup', (e) => end(e, false));
      b.addEventListener('pointercancel', (e) => end(e, true));
      return b;
    });
    btns.splice(COINS.filter((c) => c.bill).length, 0, el('i', { class: 'br' }));
    coins.replaceChildren(...btns);
    pig.addEventListener('click', () => { anim(pig, 'wig'); snd.oink(); });
    // 부모용: 금액 숫자를 2초 꾹 (버튼 없음, 아이가 모르게)
    if (o.onBalHold) {
      let pressTimer = null, pressAt = null;
      const stop = () => { clearTimeout(pressTimer); pressTimer = null; };
      bal.addEventListener('pointerdown', (e) => { pressAt = { x: e.clientX, y: e.clientY }; stop(); pressTimer = setTimeout(() => { pressTimer = null; flush(); o.onBalHold(); }, 2000); });
      bal.addEventListener('pointermove', (e) => { if (pressTimer && pressAt && Math.hypot(e.clientX - pressAt.x, e.clientY - pressAt.y) > 12) stop(); });
      for (const t of ['pointerup', 'pointercancel', 'pointerleave']) bal.addEventListener(t, stop);
      bal.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    // 💸 썼어요: 저금통이 흔들리며 구멍에서 돈이 튀어나옴 (쓴 만큼, 최대 6개)
    function coinsOut(amt) {
      const pr = pig.getBoundingClientRect();
      if (!alive || !pr.width) return;
      anim(pig, 'tip');
      const sx = pr.left + pr.width * (102 / 220), sy = pr.top + pr.height * (41 / 160), list = [];
      let left = Math.round(Math.abs(amt) * 100);
      for (const c of COINS) while (left >= Math.round(c.v * 100) && list.length < 6) { list.push(c); left -= Math.round(c.v * 100); }
      if (!list.length) list.push(COINS[COINS.length - 1]);
      list.forEach((c, i) => setTimeout(() => {
        const w = cw(c) * 0.8 * zoom, ht = ch(c) * 0.8 * zoom, f = el('div', { class: 'pb-fly', html: coinSVG(c) });
        Object.assign(f.style, { left: `${sx - w / 2}px`, top: `${sy - ht / 2}px`, width: `${w}px`, height: `${ht}px` });
        document.body.append(f);
        const dx = (i % 2 ? 1 : -1) * (40 + Math.random() * 70);
        f.animate([{ transform: 'translate(0, 0) scale(.3)', opacity: 0 }, { transform: `translate(${dx * 0.5}px, -90px) rotate(180deg) scale(1)`, opacity: 1, offset: 0.45 },
          { transform: `translate(${dx}px, 150px) rotate(360deg) scale(.9)`, opacity: 0 }], { duration: 900, easing: 'cubic-bezier(.3, 0, .6, 1)' }).onfinish = () => f.remove();
        if (i < 3) snd.coin();
      }, 250 + i * 140));
    }
    // 💶 받았어요: 반짝이 + 꿈틀
    function cheer() { if (!alive) return; confetti(pig); anim(pig, 'wig'); }
    const onVis = () => { if (document.hidden) flush(); };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('pagehide', flush);
    function destroy() {
      flush(); alive = false;
      document.removeEventListener('visibilitychange', onVis); window.removeEventListener('pagehide', flush);
      if (root._pb === api) root._pb = null;
    }
    const api = { update: () => render(false), flush, pending: () => pending, coinsOut, cheer, destroy, k: o.kid, pig, bal };
    root._pb = api;
    render(false);
    return api;
  }
  window.PiggyBank = { mount, NOTES, sumOf, fmt };
})();
