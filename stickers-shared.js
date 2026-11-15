/* 칭찬 스티커 공통 파일 — 우리가족 앱과 우리집 한눈에가 함께 씀 (trykyn.github.io/our-family/stickers-shared.js).
   여기 있는 것(스티커 그림 · 칭찬 이유 · 소리 · 개수 계산 규칙)을 고치면 두 앱에 한 번에 적용됨.
   스티커 자료는 가족 문서 kids.{davin|arin} 에 저장:
     stickers.{id} = { at, d(그림 번호), why('@brush' 또는 직접 쓴 글), src?, tr?, by }
     cfg = { small, big, reward, bigReward, start }   ← start 이후에 붙인 스티커가 지금 판
     lock = { on, pin }  (kids.lock: 엄마·아빠 비밀번호 2자리)
   다빈 = 동글동글 속성 몬스터, 아린 = 반짝이 하트 요정 (직접 그린 SVG) */
(() => {
  'use strict';
  const MONSTERS = [
    { c: '#FF8A3D', b: '#FFD9B8', top: 'flame' }, { c: '#3DA5FF', b: '#C8E8FF', top: 'drop' },
    { c: '#4CBF5A', b: '#CFF2C9', top: 'leaf' }, { c: '#FFC928', b: '#FFF2BF', top: 'bolt' },
    { c: '#9C7BFF', b: '#E4DAFF', top: 'horns' }, { c: '#FF6B9A', b: '#FFD6E3', top: 'star' },
    { c: '#2EC4B6', b: '#C6F3EE', top: 'bubble' }, { c: '#B0805A', b: '#EBD8C6', top: 'rock' },
  ];
  const MON_TOP = {
    flame: '<path d="M50 4c9 11 15 16 11 27 6-2 8-9 8-9 5 11-2 21-19 21S27 43 31 31c0 0 3 7 9 7-5-11 4-20 10-34z" fill="#FF5A1F"/><path d="M50 22c4 6 6 9 4 14-3 4-9 3-10-2 0-4 3-7 6-12z" fill="#FFD23F"/>',
    drop: '<path d="M50 3c9 13 14 20 14 28a14 14 0 0 1-28 0c0-8 5-15 14-28z" fill="#1E7FD9"/><ellipse cx="45" cy="26" rx="3" ry="5" fill="#fff" opacity=".7"/>',
    leaf: '<path d="M52 32c-3-15 8-26 26-29-2 18-11 29-26 29z" fill="#2E9D3F"/><path d="M53 31c5-9 12-16 21-23" stroke="#1E6F2B" stroke-width="2.4" fill="none" stroke-linecap="round"/>',
    bolt: '<path d="M57 2 37 31h13l-7 19 22-31H52z" fill="#FF9F1C" stroke="#8A5200" stroke-width="2" stroke-linejoin="round"/>',
    horns: '<path d="M31 33 21 7l20 18zM69 33l10-26-20 18z" fill="#6A4BD6" stroke="#4A2FB0" stroke-width="1.5" stroke-linejoin="round"/>',
    star: '<path d="m50 3 5.5 11.5 12.5 1.5-9.3 8.6 2.5 12.4L50 30.7 38.8 37l2.5-12.4L32 16l12.5-1.5z" fill="#FFD23F" stroke="#E09A00" stroke-width="2" stroke-linejoin="round"/>',
    bubble: '<circle cx="36" cy="18" r="8" fill="#B5F0E9" stroke="#2EC4B6" stroke-width="2.4"/><circle cx="56" cy="9" r="6" fill="#B5F0E9" stroke="#2EC4B6" stroke-width="2.4"/><circle cx="67" cy="23" r="4.5" fill="#B5F0E9" stroke="#2EC4B6" stroke-width="2.4"/>',
    rock: '<path d="M30 34 37 16l10 7 9-13 12 24z" fill="#7D5A3C" stroke="#5C3F28" stroke-width="2" stroke-linejoin="round"/>',
  };
  function monsterSVG(i) {
    const m = MONSTERS[((i % MONSTERS.length) + MONSTERS.length) % MONSTERS.length];
    return `<svg viewBox="0 0 100 100" aria-hidden="true">${MON_TOP[m.top]}
      <ellipse cx="29" cy="90" rx="11" ry="6" fill="${m.c}"/><ellipse cx="71" cy="90" rx="11" ry="6" fill="${m.c}"/>
      <circle cx="50" cy="60" r="32" fill="${m.c}"/><ellipse cx="50" cy="71" rx="20" ry="15" fill="${m.b}"/>
      <ellipse cx="38" cy="54" rx="7.5" ry="8.5" fill="#fff"/><ellipse cx="62" cy="54" rx="7.5" ry="8.5" fill="#fff"/>
      <circle cx="39.5" cy="55.5" r="4.4" fill="#1B1B1B"/><circle cx="63.5" cy="55.5" r="4.4" fill="#1B1B1B"/>
      <circle cx="41.2" cy="53.6" r="1.6" fill="#fff"/><circle cx="65.2" cy="53.6" r="1.6" fill="#fff"/>
      <path d="M43 66q7 7.5 14 0" stroke="#1B1B1B" stroke-width="2.8" fill="none" stroke-linecap="round"/>
      <ellipse cx="29" cy="64" rx="5.5" ry="3.2" fill="#FF6F86" opacity=".5"/><ellipse cx="71" cy="64" rx="5.5" ry="3.2" fill="#FF6F86" opacity=".5"/>
    </svg>`;
  }
  const FAIRIES = [
    { c: '#FF7EB6', top: 'crown' }, { c: '#B79CFF', top: 'ribbon' }, { c: '#6FD3BE', top: 'flower' }, { c: '#FFB066', top: 'star' },
    { c: '#7CC4FF', top: 'moon' }, { c: '#FFC93C', top: 'rainbow' }, { c: '#FF8FA0', top: 'heart' }, { c: '#C79BF2', top: 'gem' },
  ];
  const FAI_TOP = {
    crown: '<path d="M33 30 37 11l8 10 5-14 5 14 8-10 4 19z" fill="#FFD23F" stroke="#E09A00" stroke-width="2" stroke-linejoin="round"/><circle cx="50" cy="22" r="2.6" fill="#FF5FA2"/>',
    ribbon: '<path d="M50 24 30 12v22zM50 24l20-12v22z" fill="#FF5FA2" stroke="#D93A80" stroke-width="1.5" stroke-linejoin="round"/><circle cx="50" cy="24" r="5.5" fill="#E8408A"/>',
    flower: '<g fill="#FFF3A6" stroke="#F5C400" stroke-width="1.2"><circle cx="50" cy="8" r="6"/><circle cx="60" cy="16" r="6"/><circle cx="56" cy="28" r="6"/><circle cx="44" cy="28" r="6"/><circle cx="40" cy="16" r="6"/></g><circle cx="50" cy="19" r="5" fill="#FF8A3D"/>',
    star: '<path d="m50 4 5.5 11.5 12.5 1.5-9.3 8.6 2.5 12.4L50 31.7 38.8 38l2.5-12.4L32 17l12.5-1.5z" fill="#FFE066" stroke="#F0B400" stroke-width="2" stroke-linejoin="round"/>',
    moon: '<path d="M60 4a15 15 0 1 0 7 26 13 13 0 1 1-7-26z" fill="#FFE066" stroke="#F0B400" stroke-width="1.5"/>',
    rainbow: '<path d="M24 32a26 26 0 0 1 52 0" stroke="#FF6B6B" stroke-width="5" fill="none"/><path d="M30 32a20 20 0 0 1 40 0" stroke="#FFD23F" stroke-width="5" fill="none"/><path d="M36 32a14 14 0 0 1 28 0" stroke="#5BC0EB" stroke-width="5" fill="none"/>',
    heart: '<path d="M50 30C38 21 36 12 42 8c4-2 7 0 8 3 1-3 4-5 8-3 6 4 4 13-8 22z" fill="#FF3E7F"/>',
    gem: '<path d="M38 18 44 8h12l6 10-12 14z" fill="#8FE3FF" stroke="#3BA9D9" stroke-width="2" stroke-linejoin="round"/><path d="M38 18h24M44 8l6 10 6-10" stroke="#3BA9D9" stroke-width="1.4" fill="none"/>',
  };
  function fairySVG(i) {
    const f = FAIRIES[((i % FAIRIES.length) + FAIRIES.length) % FAIRIES.length];
    return `<svg viewBox="0 0 100 100" aria-hidden="true">
      <ellipse cx="17" cy="52" rx="13" ry="18" fill="#fff" opacity=".85" stroke="${f.c}" stroke-width="2"/><ellipse cx="83" cy="52" rx="13" ry="18" fill="#fff" opacity=".85" stroke="${f.c}" stroke-width="2"/>
      ${FAI_TOP[f.top]}
      <path d="M50 95C17 73 9 55 17 40c8-14 27-12 33 1 6-13 25-15 33-1 8 15 0 33-33 55z" fill="${f.c}"/>
      <ellipse cx="40" cy="58" rx="6.5" ry="8" fill="#fff"/><ellipse cx="60" cy="58" rx="6.5" ry="8" fill="#fff"/>
      <circle cx="40.5" cy="59.5" r="4.4" fill="#3B1B3B"/><circle cx="60.5" cy="59.5" r="4.4" fill="#3B1B3B"/>
      <circle cx="42.2" cy="57.4" r="1.7" fill="#fff"/><circle cx="62.2" cy="57.4" r="1.7" fill="#fff"/><circle cx="39" cy="61.5" r=".9" fill="#fff"/><circle cx="59" cy="61.5" r=".9" fill="#fff"/>
      <path d="M45 69q5 5 10 0" stroke="#3B1B3B" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <ellipse cx="31" cy="67" rx="5" ry="3" fill="#FF3E7F" opacity=".35"/><ellipse cx="69" cy="67" rx="5" ry="3" fill="#FF3E7F" opacity=".35"/>
      <path d="M84 20l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z" fill="#FFD23F"/>
    </svg>`;
  }
  const stickerSVG = (kid, d) => (kid === 'arin' ? fairySVG(d) : monsterSVG(d));
  const STICKER_N = 8;
  // 선물 상자 (아이 색)
  const giftSVG = (kid) => {
    const [a, b] = kid === 'arin' ? ['#FF9ED2', '#C79BF2'] : ['#FFE45C', '#FF9F1C'];
    return `<svg viewBox="0 0 100 100" aria-hidden="true">
      <rect x="14" y="40" width="72" height="52" rx="8" fill="${a}"/><rect x="8" y="28" width="84" height="18" rx="6" fill="${b}"/>
      <rect x="44" y="28" width="12" height="64" fill="#fff" opacity=".85"/>
      <path d="M50 28C38 10 22 14 28 24c3 5 14 4 22 4zM50 28c12-18 28-14 22-4-3 5-14 4-22 4z" fill="#fff" stroke="${b}" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="30" cy="62" r="3" fill="#fff" opacity=".7"/><circle cx="70" cy="74" r="3" fill="#fff" opacity=".7"/><circle cx="68" cy="56" r="2" fill="#fff" opacity=".7"/>
    </svg>`;
  };

  const WHY = {
    brush: ['🪥', '양치', 'Zähne putzen'], tidy: ['🧸', '정리', 'Aufräumen'], homework: ['📚', '숙제', 'Hausaufgaben'], help: ['🤝', '도와줬어요', 'Geholfen'],
    eat: ['🥦', '골고루 먹기', 'Gut gegessen'], kind: ['💖', '착한 행동', 'Lieb gewesen'], sleep: ['😴', '일찍 자기', 'Früh ins Bett'], brave: ['🦁', '용감했어요', 'Mutig gewesen'],
  };

  function bigSVG(kid, d) {
    const inner = stickerSVG(kid, d).replace('<svg viewBox="0 0 100 100" aria-hidden="true">', '<svg x="19" y="13" width="62" height="62" viewBox="0 0 100 100">');
    const rb = kid === 'arin' ? '#FF5FA2' : '#3DA5FF';
    return `<svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M32 72 22 99l13-5 8 9 7-30zM68 72l10 27-13-5-8 9-7-30z" fill="${rb}"/>
      <circle cx="50" cy="45" r="43" fill="#FFC928" stroke="#E09A00" stroke-width="4"/><circle cx="50" cy="45" r="35" fill="#FFF0A8"/>
      ${inner}
      <path d="M17 34a35 35 0 0 1 20-22" stroke="#fff" stroke-width="5" opacity=".7" fill="none" stroke-linecap="round"/>
      <path d="M86 12l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#fff"/>
    </svg>`;
  }

  let actx = null;
  function tone(notes) {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      const t0 = actx.currentTime;
      for (const [f, t, d, type] of notes) {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = type || 'sine';
        o.frequency.setValueAtTime(f, t0 + t);
        g.gain.setValueAtTime(0.0001, t0 + t);
        g.gain.exponentialRampToValueAtTime(0.22, t0 + t + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + t + d);
        o.connect(g).connect(actx.destination);
        o.start(t0 + t); o.stop(t0 + t + d + 0.03);
      }
    } catch {}
  }
  const SND = {
    tap: (n) => tone([[440 * Math.pow(1.26, n), 0, 0.14, 'triangle']]),
    tada: () => tone([[523, 0, 0.16], [659, 0.12, 0.16], [784, 0.24, 0.16], [1047, 0.36, 0.45]]),
    boing: () => tone([[260, 0, 0.12, 'triangle'], [420, 0.07, 0.18, 'triangle']]),
    stick: () => tone([[880, 0, 0.08], [1320, 0.06, 0.16]]),
    coin: () => tone([[988, 0, 0.08, 'square'], [1319, 0.07, 0.22, 'square']]),
    oink: () => tone([[180, 0, 0.12, 'sawtooth'], [150, 0.1, 0.14, 'sawtooth']]),
  };

  // 개수 규칙: 작은 스티커 small 개 = 큰 스티커 1장, 큰 스티커 big 장 = 선물
  const cfgOf = (kidData, k) => ({ small: k === 'arin' ? 7 : 10, big: 4, reward: '', bigReward: '', start: 0, ...((kidData && kidData.cfg) || {}) });
  const stickersOf = (kidData) => Object.entries((kidData && kidData.stickers) || {}).map(([id, s]) => ({ id, ...s })).sort((a, b) => (a.at || 0) - (b.at || 0));
  const boardOf = (kidData, k) => { const c = cfgOf(kidData, k); return stickersOf(kidData).filter((s) => (s.at || 0) >= (c.start || 0)); };
  function progressOf(kidData, k) {
    const c = cfgOf(kidData, k), all = boardOf(kidData, k);
    const bigs = Math.min(Math.floor(all.length / c.small), c.big);
    const gift = bigs >= c.big;
    return { c, all, bigs, gift, smallNow: gift ? [] : all.slice(bigs * c.small), now: gift ? c.small : all.length - bigs * c.small };
  }

  window.FamilyStickers = { monsterSVG, fairySVG, stickerSVG, STICKER_N, giftSVG, bigSVG, WHY, tone, SND, cfgOf, stickersOf, boardOf, progressOf };
})();
