/* 🎯 주간 미션판 — 우리가족 앱 · 우리집 한눈에(아이패드) · 우리 주간 미션(친구 가족 앱)이 같이 씀. 여기를 고치면 세 앱에 한꺼번에.
   오늘의 미션 칸 → 다 하면 🎁 선물 상자(톡톡톡 3번) → 스티커가 그 요일 칸에 + 방 가방에 열매·🪙 → 7칸 다 차면 🏅 황금 스티커 → 다 모으면 선물.
   빈 칸을 누르면 쉬는 날(아프거나 여행), 쉬는 날로 주가 다 차도 황금 스티커. 지우기 모드(부모)에서는 스티커를 눌러 지움(되돌리기 가능).
   자료는 kids.{k} 아래 (stickers-shared.js 맨 위 설명): mdone.{날짜}, stickers.{id}, golds.{주 월요일}, cfg, {FS.ROOM}.items.
   우리 가족만 쓰는 것(비밀번호 · 번역 · 가족 계정 저장)은 각 앱이 옵션으로 넘김 — 이 파일에는 넣지 않음.
   쓰는 법: const mb = MissionBoard.mount(el, {
     kid, lang: () => 'ko'|'de', data: () => kids[k], write: (path, v) => …(kids.{k} 아래 경로),
     snd?, guard?(fn) = 부모 확인(쉬는 날 · 지우기 · 새 판), giftGuard?(fn) = 선물 상자 열기 전 확인, reward?() = 보여 줄 선물 이름,
     toast?(글, 되돌리기 함수), by?() = 누가 줬는지, text?: { noReward, … 문구 바꾸기 }, onDeleteEnd?() });
   mb.update(); mb.setDelete(true|false); mb.destroy();
   쓰기는 모두 누를 때만 (mount 중에는 쓰지 않음 — 앱이 쓰자마자 다시 그리면서 판을 또 만들지 않게). */
(() => {
  'use strict';
  const FS = window.FamilyStickers;
  const T = {
    ko: {
      msTitle: '🎯 오늘의 미션', msGot: '✅ 오늘 미션 스티커를 받았어요!', msClaim: '🎁 선물 상자 열기!', lock: '🔒 ', tapBox: '상자를 톡톡톡 눌러 봐!',
      msGiftTitle: '🎉 오늘 미션 다 했어요!', rewardGot: (x) => `${x} 받았어요! 방 가방에 넣어 뒀어요`, noReward: '선물 미정', noMs: '설정에서 미션을 골라 주세요',
      week: '이번 주', weekGold: '🏅 이번 주 완성! 황금 스티커를 받았어요', offHint: '빈 칸을 누르면 쉬는 날 (아프거나 여행 간 날)',
      goldDone: (n) => `🎉 황금 스티커 ${n}개 다 모았어요!`, newBoard: '새 판 시작', newAsk: '선물을 받았으면 새 판을 시작할까요?',
      offDone: '🏖️ 쉬는 날로 표시했어요', offUndone: '쉬는 날 표시를 지웠어요', delHint: '지울 스티커를 누르세요', delDone: '완료', delToast: '스티커를 지웠어요', undo: '되돌리기',
      goldGot: '🏅 황금 스티커를 받았어요!',
    },
    de: {
      msTitle: '🎯 Tagesmission', msGot: '✅ Heute schon einen Missions-Sticker bekommen!', msClaim: '🎁 Geschenk öffnen!', lock: '🔒 ', tapBox: 'Tipp dreimal aufs Geschenk!',
      msGiftTitle: '🎉 Heute alles geschafft!', rewardGot: (x) => `${x} bekommen! Liegt im Zimmer`, noReward: 'Geschenk offen', noMs: 'Wähle in den Einstellungen Missionen aus',
      week: 'Diese Woche', weekGold: '🏅 Woche geschafft! Goldsticker bekommen', offHint: 'Leeres Feld antippen = Pausentag (krank oder verreist)',
      goldDone: (n) => `🎉 Alle ${n} Goldsticker gesammelt!`, newBoard: 'Neue Runde starten', newAsk: 'Geschenk bekommen? Neue Runde starten?',
      offDone: '🏖️ Als Pausentag eingetragen', offUndone: 'Pausentag entfernt', delHint: 'Tippe auf einen Sticker zum Löschen', delDone: 'Fertig', delToast: 'Sticker gelöscht', undo: 'Rückgängig',
      goldGot: '🏅 Goldsticker bekommen!',
    },
  };
  // 색은 각 앱이 바꿀 수 있게 변수로 (--mb-k1/k2 = 아이 색, --mb-kc = 진한 글자색)
  const css = `
.mb { --mb-k1: #FFE08A; --mb-k2: #FFB46B; --mb-kc: #A86400; --mb-surface: #fff; --mb-soft: #FFF4E4; --mb-line: #F0D9B8; --mb-muted: #9A7A5A; --mb-done: #4CBE8C;
  --mb-font: inherit; font-family: inherit; }
.mb-ms { margin-bottom: 14px; padding: 12px; border-radius: 18px; background: var(--mb-soft); }
.mb-ms-h { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; font-family: var(--mb-font); font-size: 1.1em; }
.mb-ms-h span { color: var(--mb-muted); font-size: .85em; }
.mb-tiles { display: grid; grid-template-columns: repeat(var(--n, 4), minmax(0, 1fr)); gap: 6px; }
.mb-tiles.many { grid-template-columns: repeat(auto-fill, minmax(84px, 1fr)); }
.mb-tile { position: relative; display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 8px 2px 6px; border-radius: 14px; border: 2.5px solid var(--mb-line);
  background: var(--mb-surface); color: inherit; font: inherit; cursor: pointer; min-height: 78px; transition: transform .1s; }
.mb-tile:active { transform: scale(.95); }
.mb-tile .e { font-size: 30px; line-height: 1.1; }
.mb-tile .e .mi { width: 1.15em; height: 1.15em; display: inline-block; vertical-align: middle; }
.mb-tile .t { font-size: 11px; font-weight: 700; line-height: 1.2; text-align: center; overflow-wrap: anywhere; }
.mb-tile.done { border-color: var(--mb-done); background: #EAF8F0; }
.mb-tile.done::after { content: '✓'; position: absolute; top: 3px; right: 4px; width: 20px; height: 20px; border-radius: 50%; background: var(--mb-done); color: #fff; font-size: 13px; font-weight: 700; display: grid; place-items: center; }
.mb-claim, .mb-got { width: 100%; margin-top: 10px; border: 0; border-radius: 14px; padding: 12px; font: inherit; font-family: var(--mb-font); font-size: 1.1em; text-align: center; }
.mb-claim { background: linear-gradient(140deg, var(--mb-k1), var(--mb-k2)); color: #2A1A0A; cursor: pointer; animation: mb-pulse 1.6s ease-in-out infinite; } /* 넓은 막대라 기울이면 위 칸을 덮음 → 두근두근만 */
.mb-got { background: #EAF7EC; color: #2E7D3A; }
.mb-noms { color: var(--mb-muted); text-align: center; margin: 4px 0; }
.mb-golds { display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; margin-bottom: 6px; }
.mb-big { width: clamp(50px, 14vw, 64px); height: clamp(50px, 14vw, 64px); border-radius: 50%; border: 3px dashed var(--mb-line); background: var(--mb-surface); display: grid; place-items: center; color: var(--mb-line); font-size: 26px; padding: 0; font-family: inherit; }
.mb-big.full { border: 0; background: none; cursor: pointer; }
.mb-big svg { width: 100%; height: 100%; }
.mb-gift-ic { font-size: 34px; filter: grayscale(1); opacity: .45; } .mb-gift-ic.ready { filter: none; opacity: 1; animation: mb-wob 1.2s infinite; }
.mb-rw { text-align: center; color: var(--mb-muted); font-size: .9em; margin-bottom: 12px; }
.mb-rw b { color: var(--mb-kc); font-weight: 700; }
.mb-head { display: flex; justify-content: space-between; align-items: baseline; margin: 4px 2px 8px; font-family: var(--mb-font); }
.mb-board { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 6px; padding-bottom: 20px; }
.mb-slot { position: relative; aspect-ratio: 1; border: 2.5px dashed var(--mb-line); border-radius: 16px; background: var(--mb-surface); display: grid; place-items: center;
  font: inherit; font-size: 22px; padding: 0; color: var(--mb-muted); cursor: pointer; overflow: visible; }
.mb-slot svg { width: 88%; height: 88%; }
.mb-slot .day { position: absolute; left: 0; right: 0; bottom: -20px; text-align: center; font-family: var(--mb-font); font-size: 13px; color: var(--mb-kc); }
.mb-slot.today { border-style: solid; border-width: 3px; border-color: var(--mb-kc); background: var(--mb-soft); }
.mb-slot.missed { opacity: .45; }
.mb-slot.future { opacity: .55; cursor: default; }
.mb-slot.off { border-style: solid; border-color: #9CCBEA; background: #E8F4FD; opacity: 1; }
.mb-slot.full { border: 0; background: none; }
.mb-slot.pop svg, .mb-big.pop svg { animation: mb-pop .7s cubic-bezier(.2, 1.6, .4, 1); }
.mb-slot.wig svg, .mb-big.wig svg { animation: mb-wob .45s; }
.mb.del .mb-slot.full, .mb.del .mb-big.full { animation: mb-wob .9s infinite; }
.mb.del .mb-slot.full::after, .mb.del .mb-big.full::after { content: '✕'; position: absolute; top: -6px; right: -6px; width: 22px; height: 22px; border-radius: 50%; background: #E5484D; color: #fff;
  font-size: 13px; font-weight: 700; display: grid; place-items: center; }
.mb-big.full { position: relative; }
.mb-delbar { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 10px; padding: 8px 12px; border-radius: 14px; background: #FDECEC; color: #B4282E; font-weight: 700; }
.mb-btn { border: 0; border-radius: 12px; padding: 8px 16px; font: inherit; font-weight: 700; background: linear-gradient(140deg, var(--mb-k1), var(--mb-k2)); color: #2A1A0A; cursor: pointer; }
.mb-hint { color: var(--mb-muted); font-size: .85em; text-align: center; margin: 6px 0 0; }
.mb-done { margin-top: 10px; padding: 14px; border-radius: 18px; text-align: center; background: var(--mb-soft); animation: mb-pop .6s cubic-bezier(.2, 1.6, .4, 1); }
.mb-done b { display: block; font-family: var(--mb-font); font-weight: 400; font-size: 1.4em; }
.mb-done .rw { font-size: 1.15em; margin: 4px 0 10px; }
.mb-gift { position: fixed; inset: 0; z-index: 200; display: grid; place-items: center; background: rgba(40, 24, 8, .45); }
.mb-gift-card { --mb-k1: #FFE08A; --mb-k2: #FFB46B; display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 22px 28px; border-radius: 28px; background: #fff; color: #3A2410;
  box-shadow: 0 30px 70px -20px rgba(0,0,0,.5); width: min(88vw, 380px); text-align: center; }
.mb-gift-card b { font-family: var(--mb-font, inherit); font-size: 24px; font-weight: 400; }
.mb-gift-card .gift { width: 170px; height: 170px; border: 0; background: none; padding: 0; cursor: pointer; }
.mb-gift-card .gift svg, .mb-gift-card .reveal svg { width: 100%; height: 100%; }
.mb-gift-card .gift.shake { animation: mb-wob .4s; }
.mb-gift-card .reveal { width: 180px; height: 180px; animation: mb-pop .7s cubic-bezier(.2, 1.6, .4, 1); }
.mb-gift-card .taps { display: flex; gap: 8px; } .mb-gift-card .taps i { width: 14px; height: 14px; border-radius: 50%; background: #F0D9B8; } .mb-gift-card .taps i.on { background: #FF8A3D; }
.mb-gift-card .hint { font-weight: 700; color: #9A7A5A; }
.mb-gift-card .hint .pi { width: 1.25em; height: 1.25em; vertical-align: -.25em; }
.mb-confetti { position: fixed; width: 10px; height: 14px; border-radius: 3px; z-index: 210; pointer-events: none; animation: mb-conf 1.1s ease-out forwards; }
.mb-toast { position: fixed; left: 50%; bottom: calc(20px + env(safe-area-inset-bottom)); transform: translateX(-50%); z-index: 220; display: flex; gap: 12px; align-items: center;
  background: #3A2410; color: #fff; padding: 10px 16px; border-radius: 14px; font-size: 15px; }
.mb-toast button { border: 0; background: none; color: #FFD27A; font: inherit; font-weight: 700; cursor: pointer; }
@keyframes mb-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.025); } }
@keyframes mb-wob { 0%, 100% { transform: rotate(0); } 25% { transform: rotate(-6deg); } 75% { transform: rotate(6deg); } }
@keyframes mb-pop { 0% { transform: scale(.2); } 70% { transform: scale(1.15); } 100% { transform: scale(1); } }
@keyframes mb-conf { to { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)); opacity: 0; } }
.mb.big .mb-tile .e { font-size: 38px; } .mb.big .mb-tile .t { font-size: 14px; } .mb.big .mb-big { width: 80px; height: 80px; } .mb.big .mb-slot .day { font-size: 15px; }
`;
  function addCss() {
    if (document.getElementById('mb-css')) return;
    const st = document.createElement('style'); st.id = 'mb-css'; st.textContent = css; document.head.prepend(st); // 맨 앞: 각 앱 CSS가 덮어쓸 수 있게
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
  const keyOf = (x) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
  const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  function confetti(target, n = 32) {
    const r = target.getBoundingClientRect(), colors = ['#FF6B6B', '#FFD23F', '#5BC0EB', '#9BE564', '#C79BF2', '#FF9F1C', '#FF7EB6'];
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, d = 70 + Math.random() * 130;
      const p = el('i', { class: 'mb-confetti', style: `left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;background:${colors[i % colors.length]};--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d - 70}px;--rot:${Math.random() * 720 - 360}deg` });
      document.body.append(p); setTimeout(() => p.remove(), 1200);
    }
  }
  function ownToast(t, undo, undoLabel) {
    for (const old of document.querySelectorAll('.mb-toast')) old.remove();
    const e = el('div', { class: 'mb-toast' }, el('span', { text: t }), undo ? el('button', { type: 'button', text: undoLabel, onclick: () => { e.remove(); undo(); } }) : null);
    document.body.append(e); setTimeout(() => e.remove(), 4000);
  }

  function mount(root, o) {
    addCss();
    if (root._mb) root._mb.destroy(); // 같은 자리에는 판 하나만
    const k = o.kid;
    const lang = () => (o.lang && o.lang() === 'de' ? 'de' : 'ko');
    const L = () => ({ ...T[lang()], ...((o.text && (o.text[lang()] || o.text)) || {}) });
    const snd = { tap() {}, tada() {}, boing() {}, stick() {}, coin() {}, ...(o.snd || {}) };
    const guard = o.guard || ((fn) => fn());
    const giftGuard = o.giftGuard || guard;
    const toast = (t, undo) => (o.toast ? o.toast(t, undo) : ownToast(t, undo, L().undo));
    const kd = () => o.data() || {};
    const W = (path, v) => o.write(path, v);
    const wrap = el('div', { class: 'mb' + (o.big ? ' big' : '') });
    root.replaceChildren(wrap);
    let alive = true, del = false, popId = '', popGold = '', timer = 0;

    function wig(e) { e.classList.remove('wig'); void e.offsetWidth; e.classList.add('wig'); }
    function render() {
      if (!alive) return;
      const day = keyOf(new Date()), M = FS.missionState(kd(), k, day), Wk = FS.weekState(kd(), k, day), G = FS.goldState(kd(), k);
      const labels = FS.WEEK_LABEL[lang()] || FS.WEEK_LABEL.ko;
      const reward = (o.reward ? o.reward() : (G.c && G.c.reward)) || '';
      wrap.classList.toggle('del', del);
      // 오늘의 미션
      const ms = del ? el('div', { class: 'mb-delbar' }, el('span', { text: L().delHint }), el('button', { type: 'button', class: 'mb-btn', text: L().delDone, onclick: () => setDelete(false) }))
        : el('div', { class: 'mb-ms' }, el('div', { class: 'mb-ms-h' }, el('b', { text: L().msTitle }), el('span', { text: `${M.done} / ${M.total}` })),
          M.total ? el('div', { class: 'mb-tiles' + (M.total > 5 ? ' many' : ''), style: `--n:${M.total}` }, ...M.list.map((x) => el('button', { type: 'button', class: 'mb-tile' + (M.day[x.id] ? ' done' : ''), onclick: () => {
            if (M.got) { toast(L().msGot); return; }
            const on = !M.day[x.id];
            W(['mdone', day, x.id], on ? true : null); snd.tap(on ? 3 : 1);
            render();
            if (on && M.done + 1 === M.total) setTimeout(() => giftGuard(openGift), 350); // 마지막 미션 → (필요하면 부모 확인) → 선물 상자
          } }, el('span', { class: 'e', html: FS.missionIconHTML ? FS.missionIconHTML(x) : '' }, FS.missionIconHTML ? null : FS.missionIcon(x)), el('span', { class: 't', text: FS.missionLabel(x, lang()) }))))
            : el('p', { class: 'mb-noms', text: L().noMs }),
          M.got ? el('div', { class: 'mb-got', text: L().msGot }) : M.all ? el('button', { type: 'button', class: 'mb-claim', text: L().msClaim, onclick: () => giftGuard(openGift) }) : null);
      // 황금 스티커 줄
      const golds = el('div', { class: 'mb-golds' });
      for (let i = 0; i < G.need; i++) {
        const g = G.golds[i];
        if (!g) { golds.append(el('span', { class: 'mb-big', text: '★' })); continue; }
        const b = el('button', { type: 'button', class: 'mb-big full' + (g.week === popGold ? ' pop' : ''), html: FS.bigSVG(k, g.d || 0), onclick: () => { if (del) return delGold(g); wig(b); snd.stick(); } });
        golds.append(b);
      }
      golds.append(el('span', { class: 'mb-gift-ic' + (G.gift ? ' ready' : ''), 'aria-hidden': 'true', text: '🎁' }));
      popGold = '';
      // 이번 주 7칸
      const board = el('div', { class: 'mb-board' }, ...Wk.days.map((x) => {
        if (x.got) {
          const b = el('button', { type: 'button', class: 'mb-slot full' + (x.id && x.id === popId ? ' pop' : ''), html: FS.stickerSVG(k, x.d), 'aria-label': labels[x.i],
            onclick: () => { if (del) return delDay(x); wig(b); snd.boing(); } });
          b.append(el('span', { class: 'day', text: labels[x.i] }));
          return b;
        }
        return el('button', { type: 'button', class: `mb-slot ${x.off ? 'off' : x.status}`, 'aria-label': labels[x.i], onclick: () => { if (x.status !== 'future' && !del) guard(() => toggleOff(x)); } },
          x.sick ? '🤒' : x.off ? '🏖️' : x.status === 'missed' ? '·' : x.status === 'today' ? '⭐' : '', el('span', { class: 'day', text: labels[x.i] }));
      }));
      popId = '';
      const foot = G.gift ? el('div', { class: 'mb-done' }, el('b', { text: L().goldDone(G.need) }), reward ? el('div', { class: 'rw', text: `🎁 ${reward}` }) : null,
        el('button', { type: 'button', class: 'mb-btn', text: L().newBoard, onclick: () => guard(() => { if (o.askNewBoard !== false && !confirm(L().newAsk)) return; W(['cfg'], { ...((kd().cfg) || {}), start: Date.now() }); render(); }) }))
        : el('p', { class: 'mb-hint', text: Wk.all && Wk.gold ? L().weekGold : L().offHint });
      wrap.replaceChildren(ms, golds, el('div', { class: 'mb-rw' }, '🎁 ', reward ? el('b', { text: reward }) : L().noReward, ` · 🏅 ${G.count}/${G.need}`),
        el('div', { class: 'mb-head' }, el('b', { text: L().week }), el('span', { text: `⭐ ${Wk.count} / 7` })), board, foot);
    }
    // 🎁 선물 상자: 톡톡톡 3번 → 스티커 펑 → 오늘 칸에 붙고 방 가방에 열매 + 🪙
    function openGift() {
      if (!alive || document.querySelector('.mb-gift')) return;
      const day = keyOf(new Date()), M = FS.missionState(kd(), k, day);
      if (!M.all || M.got) return;
      const d = FS.newRewardD();
      let taps = 0;
      const dots = el('div', { class: 'taps' }, el('i'), el('i'), el('i'));
      const hint = el('span', { class: 'hint', text: L().tapBox });
      const gift = el('button', { type: 'button', class: 'gift', 'aria-label': L().tapBox, html: FS.giftSVG(k), onclick: () => {
        if (taps >= 3) return;
        taps++; snd.tap(taps);
        [...dots.children].forEach((i, n) => i.classList.toggle('on', n < taps));
        if (taps < 3) { gift.classList.remove('shake'); void gift.offsetWidth; gift.classList.add('shake'); return; }
        snd.tada();
        const rv = el('div', { class: 'reveal', html: FS.stickerSVG(k, d) });
        gift.replaceWith(rv); dots.remove();
        const got = L().rewardGot(FS.rewardText ? FS.rewardText(d, lang()) : FS.rewardIcon(d));
        if (window.PokeRoom && window.PokeRoom.rich) hint.replaceChildren(...window.PokeRoom.rich(got)); else hint.textContent = got; // 열매 · 코인 그림
        confetti(rv, 36);
        setTimeout(() => { ov.remove(); save(d, day); }, 1500);
      } });
      const ov = el('div', { class: 'mb-gift' }, el('div', { class: 'mb-gift-card' }, el('b', { text: L().msGiftTitle }), gift, dots, hint));
      document.body.append(ov);
    }
    function save(d, day) { // day = 선물 상자를 연 날 (상자를 열어 둔 채 자정이 지나도 그날에 붙음)
      const id = newId(), md = (kd().mdone || {})[day];
      if (md && md.got) return; // 오늘 스티커는 한 장만
      const R = FS.ROOM || 'room';
      if (FS.weekCompletesToday(kd(), k, day)) { const wk = FS.weekKeys(day)[0]; W(['golds', wk], { at: Date.now(), d }); popGold = wk; setTimeout(() => { snd.tada(); toast(L().goldGot); }, 500); }
      popId = id;
      W(['mdone', day, 'got'], id);
      W(['stickers', id], { at: Date.now(), d, why: '@mission', ...(o.by ? { by: o.by() } : {}) });
      const it = FS.rewardItem(d);
      if (it) { W([R, 'items', id], it); W([R, 'items', id + 'c'], 'coin'); } // 열매 + 🪙 1개
      snd.stick();
      render();
    }
    // 쉬는 날 표시/해제 — 표시해서 이번 주가 다 차면 황금 스티커도
    function toggleOff(x) {
      const day = keyOf(new Date());
      if (x.off) {
        const Wk = FS.weekState(kd(), k, day), gw = Wk.all && Wk.gold ? FS.weekKeys(x.key)[0] : '', g = gw && (kd().golds || {})[gw]; // 풀면 이번 주가 안 차므로 황금 스티커도 뺌
        W(['mdone', x.key, 'off'], null); if (x.sick) W(['mdone', x.key, 'sick'], null); if (g) W(['golds', gw], null); render();
        toast(L().offUndone, g ? () => { W(['mdone', x.key, 'off'], true); if (x.sick) W(['mdone', x.key, 'sick'], true); W(['golds', gw], g); render(); } : undefined); return;
      }
      let gw = '';
      if (FS.weekCompletesWithOff(kd(), k, day, x.key)) { gw = FS.weekKeys(day)[0]; W(['golds', gw], { at: Date.now(), d: FS.newRewardD() }); popGold = gw; setTimeout(() => snd.tada(), 300); }
      W(['mdone', x.key, 'off'], true);
      render();
      toast(L().offDone, () => { W(['mdone', x.key, 'off'], null); if (gw) W(['golds', gw], null); render(); });
    }
    // 🗑 지우기: 그날 스티커 (+ 그 주 황금 스티커, 아직 안 쓴 열매 · 코인) / 황금 스티커. 되돌리기 가능
    function delDay(x) {
      const R = FS.ROOM || 'room', d0 = kd(), s = (d0.stickers || {})[x.id], wk = FS.weekKeys(x.key)[0], g = (d0.golds || {})[wk];
      const items = (d0[R] || {}).items || {}, it = items[x.id], ic = items[x.id + 'c'];
      if (it) W([R, 'items', x.id], null);
      if (ic) W([R, 'items', x.id + 'c'], null);
      W(['mdone', x.key, 'got'], null); W(['stickers', x.id], null);
      if (g) W(['golds', wk], null);
      render();
      toast(L().delToast, () => { W(['mdone', x.key, 'got'], x.id); if (s) W(['stickers', x.id], s); if (g) W(['golds', wk], g); if (it) W([R, 'items', x.id], it); if (ic) W([R, 'items', x.id + 'c'], ic); render(); });
    }
    function delGold(g) {
      const { week, ...v } = g;
      W(['golds', week], null); render();
      toast(L().delToast, () => { W(['golds', week], v); render(); });
    }
    function setDelete(on) { del = !!on; render(); if (!del && o.onDeleteEnd) o.onDeleteEnd(); }
    // 날짜가 바뀌면 새로 그림 (밤새 켜 둔 아이패드)
    let lastDay = keyOf(new Date());
    timer = setInterval(() => { if (!root.isConnected) return destroy(); const d = keyOf(new Date()); if (d !== lastDay) { lastDay = d; render(); } }, 60e3);
    function destroy() { alive = false; clearInterval(timer); if (root._mb === api) root._mb = null; }
    const api = { update: render, setDelete, get deleting() { return del; }, openGift: () => giftGuard(openGift), destroy, k };
    root._mb = api;
    render();
    return api;
  }
  window.MissionBoard = { mount };
})();
