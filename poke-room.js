/* 🥚 포켓몬 방 / 💖 티니핑 공주방(아린) — 우리가족 앱과 우리집 한눈에(아이패드)가 같이 씀. 다빈 · 아린 · 엄마 · 아빠 각자 방이 하나씩.
   네 명 모두 똑같이: 🎯 미션 탭에서 오늘 미션을 다 하면 선물 상자 → 스티커 + 열매/코인이 이 방 가방에 들어옴.
   처음엔 알 하나를 고름 (불꽃=파이리, 물=꼬부기, 풀=이상해씨, 번개=피카츄).
   오늘 미션을 다 하면 선물 상자에서 열매(5가지) 또는 🪙 코인. 열매를 먹이면 알이 깨고(5개) 포켓몬이 진화(하트 10개, 15개).
   좋아하는 열매는 하트 2개. 코인으로 새 알(10개)과 가구를 삼. 황금 스티커 = 🪙 3개, 황금 스티커 4개마다 🌟 황금 알(전설).
   자료: kids.{k}.poke (stickers-shared.js 맨 위 설명). 방 배경·가구·알은 직접 그린 것/이모지, 포켓몬 그림만 poke/ 폴더.
   쓰는 법: const room = PokeRoom.mount(el, { kid, lang: () => 'ko', data: () => kids[k], write: (path, v) => …(kids.{k} 아래 경로), big?, snd? });
            room.update(); room.destroy(); */
(() => {
  'use strict';
  const FS = window.FamilyStickers;
  const HOME_MAX = 6, EGG_NEED = 5;
  const BERRY = Object.fromEntries(FS.BERRIES.map((b) => [b[0], b]));
  const jong = (w) => { const c = w.charCodeAt(w.length - 1) - 0xAC00; return c >= 0 && c < 11172 ? c % 28 : 0; };
  const iga = (w) => w + (jong(w) ? '이' : '가'), euro = (w) => w + (jong(w) && jong(w) !== 8 ? '으로' : '로');
  const T = {
    ko: {
      pickTitle: '🥚 알을 하나 골라요!', pickSub: '열매를 먹이면 알에서 포켓몬이 나와요', shop: '가게', close: '닫기',
      noBerry: (b) => `${iga(b)} 없어요. 오늘 미션을 하면 받아요`, feedHint: (b) => `${b} 줄 친구를 눌러요`, pickBerry: '열매를 고르고 친구를 눌러서 먹여요',
      ate: (n) => `냠냠! ${n}`, fav: '좋아해요! 💖💖', hatched: (n) => `펑! ${iga(n)} 태어났어요!`, shinyHatch: (n) => `✨ 반짝이 ${iga(n)} 태어났어요!!`,
      evolved: (a, b) => `${iga(a)} ${euro(b)} 진화했어요!`, eggInfo: (n) => `🥚 열매 ${n}개 더 먹으면 태어나요`, toEvo: (n) => `진화까지 하트 ${n}개`, likes: (b) => `좋아하는 열매 ${b}`,
      shopHead: (c) => `🪙 코인 ${c}개`, eggs: '🥚 알', furn: '🪑 가구', needCoin: (n) => `코인이 ${n}개 더 필요해요`, again: '한 번 더 누르면 사요',
      eggCame: (n) => `🥚 ${iga(n)} 왔어요!`, decoTip: '산 가구는 눌러서 놓거나 치워요. 방에서 끌어서 옮겨요.',
      homeHead: (n) => `방에 나온 친구 ${n} / ${HOME_MAX} — 눌러서 넣고 빼요`, homeFull: `방에는 ${HOME_MAX}마리까지 나올 수 있어요`, dexHead: (n, N) => `도감 ${n} / ${N}`,
      goldBonus: '🏅 황금 스티커 보너스! 🪙 코인 3개', goldEgg: '🌟 황금 알이 생겼어요! 전설의 포켓몬이 들어 있대요', sleep: '쿨쿨… 밤이라 자고 있어요',
    },
    de: {
      pickTitle: '🥚 Such dir ein Ei aus!', pickSub: 'Füttere es mit Beeren, dann schlüpft ein Pokémon', shop: 'Laden', close: 'Schließen',
      noBerry: (b) => `Keine ${b}. Schaffe deine Tagesmission!`, feedHint: (b) => `Tippe ein Pokémon an, um ${b} zu geben`, pickBerry: 'Beere wählen, dann Pokémon antippen',
      ate: (n) => `Mampf! ${n}`, fav: 'Lecker! 💖💖', hatched: (n) => `Plopp! ${n} ist geschlüpft!`, shinyHatch: (n) => `✨ Ein schillerndes ${n} ist geschlüpft!!`,
      evolved: (a, b) => `${a} hat sich zu ${b} entwickelt!`, eggInfo: (n) => `🥚 Noch ${n} Beeren bis zum Schlüpfen`, toEvo: (n) => `Noch ${n} Herzen bis zur Entwicklung`, likes: (b) => `Lieblingsbeere ${b}`,
      shopHead: (c) => `🪙 ${c} Münzen`, eggs: '🥚 Eier', furn: '🪑 Möbel', needCoin: (n) => `Dir fehlen noch ${n} Münzen`, again: 'Nochmal tippen zum Kaufen',
      eggCame: (n) => `🥚 Ein ${n} ist da!`, decoTip: 'Gekaufte Möbel antippen zum Aufstellen/Wegräumen. Im Zimmer verschieben.',
      homeHead: (n) => `Im Zimmer ${n} / ${HOME_MAX} – tippen zum Rein/Raus`, homeFull: `Höchstens ${HOME_MAX} im Zimmer`, dexHead: (n, N) => `Pokédex ${n} / ${N}`,
      goldBonus: '🏅 Goldsticker-Bonus! 🪙 3 Münzen', goldEgg: '🌟 Ein Gold-Ei! Darin steckt ein legendäres Pokémon', sleep: 'Zzz… nachts wird geschlafen',
    },
  };
  // 💖 티니핑 방(아린)에서 바뀌는 글
  const TP = {
    ko: { eggInfo: (n) => `💖 열매 ${n}개 더 먹으면 티니핑이 나와요`, goldEgg: '👑 황금 하트가 생겼어요! 특별한 티니핑이 들어 있대요', eggCame: (n) => `💖 ${iga(n)} 왔어요!`,
      eggs: '💖 하트 알', toEvo: (n) => `변신까지 하트 ${n}개`, changed: (n) => `✨ ${n} 모습으로 변신했어요!`, accNext: (n, e) => `하트 ${n}개 더 모으면 ${e}`,
      accGot: (e) => `${e} 받았어요! 예쁘다!`, came: (n) => `💖 ${iga(n)} 놀러 왔어요!` },
    de: { eggInfo: (n) => `💖 Noch ${n} Beeren, dann kommt ein Teenieping`, goldEgg: '👑 Ein Goldherz! Darin steckt ein besonderes Teenieping', eggCame: (n) => `💖 ${n} ist da!`,
      eggs: '💖 Herz-Eier', toEvo: (n) => `Noch ${n} Herzen bis zur Verwandlung`, changed: (n) => `✨ Verwandelt in ${n}!`, accNext: (n, e) => `Noch ${n} Herzen bis ${e}`,
      accGot: (e) => `${e} bekommen! Wie hübsch!`, came: (n) => `💖 ${n} ist zu Besuch!`, dexHead: (n, N) => `Sammlung ${n} / ${N}` },
  };
  // 가구: [이모지, 기본 x, 기본 y, 벽(1), 크기, 값(코인)]
  const DECO = {
    rug: ['', 50, 80, 0, 1, 3], plant: ['🪴', 7, 58, 0, 1.1, 3], teddy: ['🧸', 30, 90, 0, .9, 3], ball: ['⚽', 62, 92, 0, .7, 2], cake: ['🍰', 52, 72, 0, .8, 2],
    balloon: ['🎈', 92, 30, 1, 1, 2], frame: ['🖼️', 70, 22, 1, 1, 3], books: ['📚', 92, 88, 0, .9, 3], clock: ['🕰️', 50, 12, 1, .9, 4], kite: ['🪁', 36, 26, 1, 1, 4],
    rainbow: ['🌈', 22, 18, 1, 1.2, 5], bed: ['🛏️', 16, 70, 0, 1.5, 6], sofa: ['🛋️', 82, 66, 0, 1.4, 6], piano: ['🎹', 66, 60, 0, 1.2, 8], tent: ['⛺', 40, 64, 0, 1.4, 8], slide: ['🛝', 24, 62, 0, 1.4, 8],
  };
  // 👑 공주방 가구 (아린)
  const DECO_P = {
    rug: ['', 50, 80, 0, 1, 3], flowers: ['💐', 7, 58, 0, 1, 3], ribbon: ['🎀', 20, 24, 1, .9, 2], crown: ['👑', 50, 8, 1, .8, 4], mirror: ['🪞', 82, 30, 1, 1.1, 4],
    dress: ['👗', 92, 30, 1, .9, 4], cupcake: ['🧁', 44, 78, 0, .7, 2], teapot: ['🫖', 56, 76, 0, .8, 3], ballet: ['🩰', 34, 92, 0, .8, 3], wand: ['🪄', 64, 92, 0, .7, 2],
    teddy: ['🧸', 28, 90, 0, .9, 3], gem: ['💎', 70, 22, 1, .8, 3], rainbow: ['🌈', 22, 14, 1, 1.1, 5], unicorn: ['🦄', 74, 88, 0, 1.1, 5],
    bed: ['🛏️', 16, 70, 0, 1.5, 6], piano: ['🎹', 66, 60, 0, 1.2, 8], carousel: ['🎠', 86, 66, 0, 1.4, 8], castle: ['🏰', 30, 62, 0, 1.4, 8],
  };
  const css = `
.pr { --pr-s: 1; position: relative; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
.pr-room { position: relative; width: 100%; aspect-ratio: 4 / 3; border-radius: 18px; overflow: hidden; touch-action: none;
  background: linear-gradient(#FFF4E0 0 52%, #E8B27A 52% 53.2%, #D9A066 53.2%); box-shadow: inset 0 0 0 3px rgba(0,0,0,.06); }
.pr-room::before { content: ''; position: absolute; inset: 53.2% 0 0; background: repeating-linear-gradient(90deg, transparent 0 11.5%, rgba(120,70,30,.18) 11.5% 12%), repeating-linear-gradient(0deg, transparent 0 24%, rgba(120,70,30,.10) 24% 25%); }
.pr-room::after { content: ''; position: absolute; inset: 0 0 48%; background: radial-gradient(circle at 12px 12px, rgba(255,180,120,.22) 3px, transparent 3.5px) 0 0 / 28px 28px; pointer-events: none; }
.pr-win { position: absolute; left: 38%; top: 9%; width: 24%; height: 30%; border-radius: 10px 10px 4px 4px; border: 5px solid #fff; box-shadow: 0 2px 0 rgba(0,0,0,.08);
  background: linear-gradient(#8ED6FF, #D6F1FF); overflow: hidden; z-index: 1; }
.pr-win::before { content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 4px; margin-left: -2px; background: #fff; }
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
.pr-mon img, .pr-mon svg { display: block; image-rendering: pixelated; pointer-events: none; transform-origin: 50% 100%; }
.pr-mon.flip img { transform: scaleX(-1); }
.pr-mon::after { content: ''; position: absolute; left: 15%; right: 15%; bottom: -3px; height: 8px; border-radius: 50%; background: rgba(0,0,0,.16); z-index: -1; }
.pk-egg { image-rendering: pixelated; }
.pr-mon.egg > .pk-egg { animation: pr-wob 3.2s ease-in-out infinite; animation-delay: var(--wd, 0s); }
.pr-mon.egg.crack > .pk-egg { animation-duration: 1.4s; }
.pr-mon.egg .ck { position: absolute; left: 18%; top: 34%; width: 64%; pointer-events: none; }
@keyframes pr-wob { 0%, 70%, 100% { transform: rotate(0); } 76% { transform: rotate(-9deg); } 84% { transform: rotate(8deg); } 92% { transform: rotate(-4deg); } }
.pr-mon.jump > img { animation: pr-jump .5s ease-out; }
.pr-mon.flip.jump > img { animation-name: pr-jumpf; }
@keyframes pr-jump { 40% { transform: translateY(-28%) scaleY(1.05); } 70% { transform: translateY(0) scaleY(.9); } }
@keyframes pr-jumpf { 40% { transform: scaleX(-1) translateY(-28%) scaleY(1.05); } 70% { transform: scaleX(-1) translateY(0) scaleY(.9); } }
.pr-mon.evo > img { animation: pr-evo 1.4s ease-in-out; }
@keyframes pr-evo { 0%, 100% { filter: none; } 20%, 60% { filter: brightness(0) invert(1); transform: scale(1.15); } 40%, 80% { filter: none; } }
.pr-mon.egg.hatch > .pk-egg { animation: pr-hatch 1.3s ease-in-out forwards; }
@keyframes pr-hatch { 0% { transform: rotate(0); } 10%, 30%, 50% { transform: rotate(-14deg); } 20%, 40%, 60% { transform: rotate(14deg); } 85% { transform: scale(1.3); filter: brightness(0) invert(1); } 100% { transform: scale(1.4); filter: brightness(0) invert(1); opacity: .6; } }
.pr.smooth .pr-mon img { image-rendering: auto; filter: drop-shadow(0 2px 2px rgba(0,0,0,.12)); }
.pr.smooth .pr-mon.walk:not(.jump):not(.evo) > img { animation: pr-bob .42s ease-in-out infinite alternate; }
@keyframes pr-bob { from { translate: 0 0; rotate: -3deg; } to { translate: 0 -6%; rotate: 3deg; } }
.pr-mon .acc { position: absolute; left: 50%; top: 0; transform: translate(-50%, -55%); font-size: calc(17px * var(--pr-s)); line-height: 1; white-space: nowrap; pointer-events: none; filter: drop-shadow(0 1px 1px rgba(0,0,0,.25)); }
.pr.princess .pr-room { background: linear-gradient(#FFE6F3 0 52%, #F4A9CB 52% 53.2%, #FAD4E6 53.2%); box-shadow: inset 0 0 0 3px rgba(240,120,170,.25); }
.pr.princess .pr-room::before { background: conic-gradient(#FFF7FB 25%, #F9C9DE 0 50%, #FFF7FB 0 75%, #F9C9DE 0) 0 0 / 12.5% 25%; opacity: .95; }
.pr.princess .pr-room::after { background: repeating-linear-gradient(90deg, rgba(255,255,255,.55) 0 14px, transparent 14px 34px), radial-gradient(circle at 17px 14px, rgba(246,200,107,.8) 2px, transparent 2.6px) 0 0 / 34px 30px; }
.pr.princess .pr-win { border-color: #F6C86B; border-radius: 50% 50% 6px 6px / 40% 40% 6px 6px; background: linear-gradient(#B9C8FF, #FFD9EE); }
.pr.princess .pr-win::before, .pr.princess .pr-win::after { background: #F6C86B; }
.pr-cur { position: absolute; top: 6%; width: 9%; height: 40%; z-index: 2; pointer-events: none; background: repeating-linear-gradient(90deg, #FF8FC0 0 6px, #FFB3D5 6px 12px); box-shadow: 0 2px 0 rgba(0,0,0,.08); }
.pr-cur.l { left: 32%; border-radius: 0 0 90% 30%; } .pr-cur.r { right: 32%; border-radius: 0 0 30% 90%; }
.pr-cur::before { content: ''; position: absolute; left: -12%; right: -12%; top: -6px; height: 10px; border-radius: 6px; background: #F6C86B; }
.pr.princess.night .pr-room { background: linear-gradient(#5A3E7A 0 52%, #46305E 52% 53.2%, #6A4C82 53.2%); }
.pr.princess.night .pr-room::before { opacity: .3; }
.pr.princess.night .pr-win { background: linear-gradient(#1D2457, #3B3F7C); }
.pr-mon .zz { position: absolute; right: -6px; top: -10px; font-size: calc(14px * var(--pr-s)); animation: pr-zz 2.4s infinite; pointer-events: none; }
@keyframes pr-zz { 0% { opacity: 0; transform: translateY(6px); } 40% { opacity: 1; } 100% { opacity: 0; transform: translateY(-12px); } }
.pr-mon .shine { position: absolute; left: 0; top: 0; font-size: calc(12px * var(--pr-s)); animation: pr-tw 1.6s infinite; pointer-events: none; }
@keyframes pr-tw { 50% { opacity: .2; transform: scale(.6); } }
.pr-bub { position: absolute; transform: translate(-50%, -100%); background: #fff; color: #333; border-radius: 14px; padding: .3em .7em; font-weight: 700; font-size: calc(13px * var(--pr-s));
  white-space: nowrap; box-shadow: 0 3px 10px rgba(0,0,0,.15); pointer-events: none; z-index: 999; animation: pr-bub 2s forwards; }
@keyframes pr-bub { 0% { opacity: 0; margin-top: 6px; } 12%, 80% { opacity: 1; margin-top: 0; } 100% { opacity: 0; margin-top: -8px; } }
.pr-heart { position: absolute; pointer-events: none; z-index: 998; font-size: calc(18px * var(--pr-s)); animation: pr-heart 1s ease-out forwards; }
@keyframes pr-heart { to { opacity: 0; transform: translate(var(--hx), -60px) scale(1.4); } }
.pr-deco { font-size: calc(48px * var(--pr-s) * var(--z, 1)); line-height: 1; filter: drop-shadow(0 3px 0 rgba(0,0,0,.12)); }
.pr-deco.rug { width: calc(150px * var(--pr-s)); height: calc(52px * var(--pr-s)); transform: translate(-50%, -50%); border-radius: 50%;
  background: repeating-radial-gradient(ellipse, #FF9EB5 0 10%, #FFD3DE 10% 20%); filter: none; opacity: .9; }
.pr-pick { position: absolute; inset: 0; z-index: 1001; display: grid; place-content: center; gap: 10px; text-align: center; background: rgba(255,248,232,.92); padding: 10px; }
.pr-pick b { font-size: calc(19px * var(--pr-s)); color: #6B3E12; }
.pr-pick p { margin: 0; font-size: calc(13px * var(--pr-s)); color: #9A7A5A; }
.pr-pick .row { display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; }
.pr-pick button { border: 0; background: #fff; border-radius: 16px; padding: 8px 8px 6px; font: inherit; font-weight: 700; color: #6B3E12; font-size: calc(12px * var(--pr-s)); cursor: pointer;
  display: flex; flex-direction: column; align-items: center; gap: 4px; box-shadow: 0 2px 0 rgba(0,0,0,.08); width: calc(62px * var(--pr-s)); }
.pr-pick button .pk-egg { width: 56%; animation: pr-wob 2.6s ease-in-out infinite; }
.pr-pick button:nth-child(2) .pk-egg { animation-delay: .4s; } .pr-pick button:nth-child(3) .pk-egg { animation-delay: .8s; } .pr-pick button:nth-child(4) .pk-egg { animation-delay: 1.2s; }
.pr-berries { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; margin-top: 10px; }
.pr-berries button { border: 0; border-radius: 14px; padding: calc(6px * var(--pr-s)) 2px; font: inherit; font-weight: 800; font-size: calc(14px * var(--pr-s)); background: #FFF0D6; color: #6B3E12; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 3px; }
.pr-berries button .e { font-size: calc(22px * var(--pr-s)); }
.pr-berries button.zero { opacity: .45; }
.pr-berries button[aria-pressed="true"] { background: #FF8A3D; color: #fff; box-shadow: 0 0 0 3px #FFD2B0; }
.pr-bar { display: flex; gap: 8px; margin-top: 8px; }
.pr-bar button, .pr-bar span { flex: 1; min-width: 0; border: 0; border-radius: 14px; padding: calc(10px * var(--pr-s)) 8px; font: inherit; font-weight: 800; font-size: calc(15px * var(--pr-s));
  background: #FFF0D6; color: #6B3E12; cursor: pointer; text-align: center; }
.pr-bar span { background: #FFF6CC; cursor: default; }
.pr-bar button[aria-pressed="true"] { background: #FF8A3D; color: #fff; box-shadow: 0 0 0 3px #FFD2B0; }
.pr-msg { margin: 8px 2px 0; min-height: 1.3em; font-size: calc(13px * var(--pr-s)); color: #8A6A4A; text-align: center; }
.pr-news { position: absolute; left: 50%; top: 6%; transform: translateX(-50%); z-index: 1000; background: #FFF8D6; color: #6B3E12; font-weight: 800; border-radius: 16px;
  padding: .55em 1em; box-shadow: 0 6px 18px rgba(0,0,0,.18); font-size: calc(15px * var(--pr-s)); text-align: center; max-width: 90%; animation: pr-news 4.5s forwards; pointer-events: none; }
@keyframes pr-news { 0% { opacity: 0; transform: translate(-50%, -10px) scale(.9); } 8%, 85% { opacity: 1; transform: translate(-50%, 0) scale(1); } 100% { opacity: 0; } }
.pr-panel { margin-top: 10px; background: #FFFAF0; border-radius: 16px; padding: 12px; box-shadow: inset 0 0 0 2px #FFE3BF; }
.pr-panel h4 { margin: 0 0 8px; font-size: calc(14px * var(--pr-s)); color: #6B3E12; display: flex; justify-content: space-between; gap: 8px; align-items: center; }
.pr-panel h4 button { border: 0; background: none; font: inherit; color: #B07040; cursor: pointer; }
.pr-panel p { margin: 0 0 8px; font-size: calc(12px * var(--pr-s)); color: #9A7A5A; }
.pr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(calc(64px * var(--pr-s)), 1fr)); gap: 6px; margin-bottom: 10px; }
.pr-grid button { position: relative; border: 0; border-radius: 12px; background: #fff; padding: 4px 2px; font: inherit; font-size: calc(10.5px * var(--pr-s)); color: #6B3E12; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; gap: 2px; box-shadow: 0 1px 0 rgba(0,0,0,.06); }
.pr-grid button img { width: 80%; aspect-ratio: 1; object-fit: contain; }
.pr-grid button .eg { width: 42%; margin: 6px 0 2px; } .pr-grid button .eg .pk-egg { display: block; width: 100%; }
.pr-grid button .e { font-size: calc(30px * var(--pr-s)); line-height: 1.3; }
.pr-grid button.on { background: #FFE2C4; box-shadow: 0 0 0 2px #FF8A3D; }
.pr-grid button.armed { background: #FFF3B0; box-shadow: 0 0 0 2px #F0B400; }
.pr-grid button.poor { opacity: .5; }
.pr-grid button.unk img { filter: brightness(0); opacity: .18; }
.pr-grid button .b { position: absolute; right: 3px; top: 2px; font-size: calc(10px * var(--pr-s)); }
.pr-grid button .n { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; }
.pr-grid button .rug-ic { width: 70%; height: calc(22px * var(--pr-s)); margin: calc(8px * var(--pr-s)) 0; border-radius: 50%; background: repeating-radial-gradient(ellipse, #FF9EB5 0 18%, #FFD3DE 18% 36%); }
`;
  const CRACK = '<svg class="ck" viewBox="0 0 60 20" aria-hidden="true"><path d="M2 10l8-6 7 9 8-8 8 9 8-7 8 8 9-6" stroke="#5a3a1a" stroke-width="3" fill="none" stroke-linejoin="round"/></svg>';
  function addCss() {
    if (document.getElementById('pr-css')) return;
    const st = document.createElement('style'); st.id = 'pr-css'; st.textContent = css; document.head.append(st);
  }
  function el(tag, props, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') e.className = v; else if (k === 'text') e.textContent = v; else if (k === 'style') e.style.cssText = v; else if (k === 'html') e.innerHTML = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v);
    }
    for (const c of kids) if (c != null && c !== false) e.append(c);
    return e;
  }
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const uid = (p) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  const isNight = () => { const h = new Date().getHours(); return h >= 20 || h < 7; };

  function mount(root, o) {
    addCss();
    if (root._pr) root._pr.destroy(); // 같은 자리에 방이 이미 있으면 먼저 정리
    const lang = () => (o.lang() === 'de' ? 'de' : 'ko');
    const SET = FS.charSet(o.kid), DK = SET.room === 'princess' ? DECO_P : DECO; // 아린 = 💖 티니핑 공주방, 나머지 = 🥚 포켓몬
    const L = () => (SET.key === 'ping' ? { ...T[lang()], ...TP.ko, ...(lang() === 'de' ? TP.de : {}) } : T[lang()]);
    const name = (id) => SET.name(id, lang());
    const bName = (k) => BERRY[k][lang() === 'de' ? 3 : 2];
    const eggName = (egg) => SET.eggName(egg, lang());
    const snd = { tap() {}, tada() {}, boing() {}, stick() {}, coin() {}, ...(o.snd || {}) };
    const roomEl = el('div', { class: 'pr-room' }, el('div', { class: 'pr-win', 'aria-hidden': 'true' }, el('i'), el('b')));
    const berryRow = el('div', { class: 'pr-berries' });
    const coinEl = el('span');
    const btnShop = el('button', { type: 'button', 'aria-pressed': 'false' });
    const btnDex = el('button', { type: 'button', 'aria-pressed': 'false' });
    const msg = el('p', { class: 'pr-msg' });
    const panel = el('div', { class: 'pr-panel', hidden: '' });
    if (SET.room === 'princess') roomEl.append(el('div', { class: 'pr-cur l' }), el('div', { class: 'pr-cur r' }));
    const wrap = el('div', { class: 'pr' + (SET.room ? ` ${SET.room} smooth` : '') }, roomEl, berryRow, el('div', { class: 'pr-bar' }, coinEl, btnShop, btnDex), msg, panel);
    root.replaceChildren(wrap);
    let feeding = '', open = '', alive = true, scale = 1, armed = '', grantAt = 0, msgUntil = 0;
    const monEls = new Map(), decoEls = new Map();

    const W = (path, v) => o.write(['poke', ...path], v);
    const pk = () => (o.data() && o.data().poke) || {};
    const items = () => Object.entries(pk().items || {});
    const count = (kind) => items().filter(([, v]) => v === kind).length;
    const take = (kind, n) => items().filter(([, v]) => v === kind).slice(0, n).map(([id]) => id);
    const mons = () => Object.entries(pk().mons || {}).filter(([, m]) => m && (m.egg || SET.valid(m.p))).map(([id, m]) => ({ id, ...m })).sort((a, b) => (a.at || 0) - (b.at || 0));
    const hatched = (m) => !!m.h && SET.valid(m.p);
    const homeIds = () => {
      const all = mons(), h = pk().home;
      if (Array.isArray(h)) { const ok = new Set(all.map((m) => m.id)); return h.filter((id) => ok.has(id)).slice(0, HOME_MAX); }
      return all.slice(-HOME_MAX).map((m) => m.id);
    };
    const need = (m) => (!hatched(m) ? EGG_NEED : SET.next(m.p).length ? SET.evoNeed(m.p) : 0);
    const accOf = (m) => (SET.acc && hatched(m) && !SET.next(m.p).length ? SET.acc(m.f || 0) : ''); // 💖 변신 없는 티니핑: 하트로 🎀 → 👑
    const say = (t) => { msg.textContent = t; msgUntil = Date.now() + 3000; };
    function addHome(id) { const h = pk().home; if (Array.isArray(h) && h.length < HOME_MAX) W(['home'], [...h, id]); }

    // 처음 고르는 알 (정해진 포켓몬) + 딸기 3개
    function pickEgg(egg) {
      if (mons().length) return;
      W(['mons', uid('e')], { egg, p: SET.startEggs[egg], f: 0, at: Date.now() });
      if (!pk().start) W(['start'], Date.now());
      for (const n of [1, 2, 3]) W(['items', `w${n}`], 'strawberry');
      news(L().eggCame(eggName(egg)));
    }
    // 💖 티니핑 방: 처음엔 하츄핑이 바로 와 있음 (알 고르기 없음). 예전 포켓몬 자료는 정리 (열매 · 코인은 그대로)
    let booted = false;
    function boot() {
      const p = pk();
      if (!alive || !SET.start || booted || (p.set === SET.key && mons().length)) return;
      booted = true;
      if (p.set !== SET.key) { W(['mons'], null); W(['home'], null); W(['deco'], null); W(['set'], SET.key); }
      W(['mons', 'start'], { p: SET.start, h: Date.now(), f: 0, at: Date.now() });
      if (!p.start) W(['start'], Date.now());
      for (const n of [1, 2, 3]) W(['items', `w${n}`], 'strawberry');
      setTimeout(() => news(L().came(name(SET.start))), 400);
    }
    // 황금 스티커: 🪙 3개씩 (주마다 한 번), 4개마다 황금 알 — 알을 고른 다음에 받은 것만
    function grants() {
      const start = pk().start;
      if (!alive || !start || Date.now() - grantAt < 3000) return;
      const golds = Object.entries((o.data() && o.data().golds) || {}).filter(([, g]) => g && (g.at || 0) >= start).map(([w]) => w).sort();
      const gp = pk().gp || {}, todo = golds.filter((w) => !gp[w]);
      if (todo.length) {
        grantAt = Date.now();
        for (const w of todo) { for (const x of ['a', 'b', 'c']) W(['items', `g${w}${x}`], 'coin'); W(['gp', w], 1); }
        news(L().goldBonus); return;
      }
      const all = pk().mons || {};
      for (let i = 1; i <= Math.floor(golds.length / 4); i++) {
        if (all[`gold${i}`]) continue;
        grantAt = Date.now();
        W(['mons', `gold${i}`], { egg: 'gold', f: 0, at: Date.now() }); addHome(`gold${i}`);
        news(L().goldEgg); return;
      }
    }
    function news(t) {
      const n = el('div', { class: 'pr-news', text: t });
      roomEl.append(n); setTimeout(() => n.remove(), 4600);
      snd.tada();
    }
    function bubble(x, y, t) {
      const b = el('div', { class: 'pr-bub', text: t, style: `left:${x}%;top:${y}%` });
      roomEl.append(b); setTimeout(() => b.remove(), 2100);
    }
    function hearts(x, y, n, icon) {
      for (let i = 0; i < n; i++) {
        const hh = el('span', { class: 'pr-heart', text: i === 0 && icon ? icon : '💖', style: `left:${x}%;top:${y}%;--hx:${rnd(-30, 30)}px;animation-delay:${i * 0.08}s` });
        roomEl.append(hh); setTimeout(() => hh.remove(), 1400);
      }
    }

    // ── 포켓몬 · 알 ──
    function placeMon(e, x, y, d) {
      const ox = parseFloat(e.style.left) || x;
      if (Math.abs(x - ox) > 0.5) e.classList.toggle('flip', x > ox);
      e.style.setProperty('--d', `${d}s`);
      e.style.left = `${x}%`; e.style.top = `${y}%`; e.style.zIndex = String(10 + Math.round(y));
      if (d > 0) { e.classList.add('walk'); clearTimeout(e._wt); e._wt = setTimeout(() => e.classList.remove('walk'), d * 1000); }
    }
    function sizeImg(e) {
      if (e._egg) { const img = e.querySelector('.pk-egg'); if (img) img.style.width = `${34 * scale}px`; return; }
      if (e._img && SET.room) { e._img.style.height = `${52 * scale}px`; return; } // 티니핑 그림은 크기가 제각각 → 키를 맞춤
      if (e._img && e._img.naturalWidth) e._img.style.width = `${e._img.naturalWidth * scale}px`;
    }
    function monEl(id) {
      const e = el('button', { type: 'button', class: 'pr-mon' });
      e._id = id;
      placeMon(e, rnd(10, 90), rnd(62, 95), 0);
      dragable(e, () => tapMon(e), (x, y) => { placeMon(e, x, Math.max(58, y), 0); e._rest = Date.now() + 6000; });
      return e;
    }
    function setLook(e, m) {
      const egg = !hatched(m), cracked = egg && (m.f || 0) >= 3, acc = accOf(m), key = egg ? `egg/${m.egg}/${cracked ? 1 : 0}` : `${m.p}/${m.s ? 1 : 0}/${acc}`;
      if (e._key === key) return;
      e._key = key; e._egg = egg;
      e.classList.toggle('egg', egg); e.classList.toggle('crack', cracked); e.classList.remove('hatch');
      if (egg) {
        e.innerHTML = SET.eggHTML(m.egg) + (cracked ? CRACK : '');
        e.style.setProperty('--wd', `${rnd(0, 3).toFixed(1)}s`);
        e.setAttribute('aria-label', eggName(m.egg));
        e._img = null;
      } else {
        const img = el('img', { alt: '', draggable: 'false', src: SET.walk(m.p, m.s) });
        img.onload = () => sizeImg(e);
        e.replaceChildren(img); e._img = img;
        if (m.s) e.append(el('span', { class: 'shine', text: '✨' }));
        if (acc) e.append(el('span', { class: 'acc', text: acc }));
        e.setAttribute('aria-label', name(m.p));
      }
    }
    function tapMon(e) {
      const raw = (pk().mons || {})[e._id];
      if (!raw) return;
      const m = { id: e._id, ...raw };
      const x = parseFloat(e.style.left), y = parseFloat(e.style.top) - 14;
      e.classList.remove('jump'); void e.offsetWidth; e.classList.add('jump');
      if (feeding && count(feeding) > 0) return feed(e, m, feeding, x, y);
      snd.boing();
      if (!hatched(m)) { bubble(x, y, eggName(m.egg)); say(L().eggInfo(Math.max(1, EGG_NEED - (m.f || 0)))); return; }
      const fav = BERRY[SET.fav(m.p)][1], n = need(m), accN = !n && SET.acc ? SET.accAt.find((t) => t > (m.f || 0)) : 0;
      bubble(x, y, `${m.s ? '✨ ' : ''}${name(m.p)} ${'💖'.repeat(Math.min(3, Math.ceil((m.f || 0) / 4)))}`);
      say(`${name(m.p)} · ${L().likes(fav)}${n ? ' · ' + L().toEvo(Math.max(1, n - (m.f || 0))) : accN ? ' · ' + L().accNext(accN - (m.f || 0), SET.acc(accN)) : ''}`);
    }
    function feed(e, m, kind, x, y) {
      const key = take(kind, 1)[0];
      if (!key || e._busy) return;
      const { id, ...v } = m;
      W(['items', key], null);
      if (!hatched(m)) {
        const f = (m.f || 0) + 1;
        hearts(x, y, 2, BERRY[kind][1]); snd.coin();
        if (f >= EGG_NEED) {
          const have = new Set(mons().filter(hatched).map((z) => z.p));
          const p = SET.valid(m.p) ? m.p : SET.hatch(m.egg, have), s = Math.random() < SET.shiny;
          e._busy = true; e.classList.add('hatch');
          setTimeout(() => { e._busy = false; W(['mons', id], { ...v, p, s, h: Date.now(), f: 0 }); news(s ? L().shinyHatch(name(p)) : L().hatched(name(p))); hearts(x, y, 8); }, 1300);
        } else { W(['mons', id], { ...v, f }); bubble(x, y, L().eggInfo(EGG_NEED - f)); }
      } else {
        const fav = SET.fav(m.p) === kind, f = (m.f || 0) + (fav ? 2 : 1), nexts = SET.next(m.p), n = need(m), a0 = accOf(m), a1 = accOf({ ...m, f });
        hearts(x, y, fav ? 6 : 3, BERRY[kind][1]); snd.coin();
        if (nexts.length && f >= n) {
          const to = pick(nexts), from = m.p;
          e._busy = true; e.classList.add('evo');
          setTimeout(() => { W(['mons', id], { ...v, p: to, f: 0 }); }, 700);
          setTimeout(() => { e._busy = false; e.classList.remove('evo'); news(SET.key === 'ping' ? L().changed(name(to)) : L().evolved(name(from), name(to))); }, 1400);
        } else { W(['mons', id], { ...v, f }); bubble(x, y, fav ? L().fav : L().ate(name(m.p))); if (a1 !== a0) setTimeout(() => news(L().accGot(a1)), 500); }
      }
      setTimeout(renderBar, 60);
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
      if (!root.offsetParent) return;
      if (msgUntil && Date.now() > msgUntil) { msgUntil = 0; renderBar(); }
      if (isNight()) return;
      for (const e of monEls.values()) {
        if (e._egg || e._busy || e.classList.contains('drag') || (e._rest && Date.now() < e._rest) || Math.random() > 0.3) continue;
        const ox = parseFloat(e.style.left), oy = parseFloat(e.style.top);
        const x = Math.min(94, Math.max(6, ox + rnd(-28, 28))), y = Math.min(96, Math.max(60, oy + rnd(-12, 12)));
        const d = Math.max(1, Math.hypot(x - ox, (y - oy) * 0.75) / 9);
        placeMon(e, x, y, d.toFixed(2));
        e._rest = Date.now() + d * 1000 + rnd(800, 3500);
      }
    }

    // ── 가구 ──
    function decoEl(key) {
      const [em, , , , z] = DK[key];
      const e = el('div', { class: 'pr-deco' + (key === 'rug' ? ' rug' : ''), text: em, style: `--z:${z}` });
      dragable(e, () => {}, (x, y) => { e.style.left = `${x}%`; e.style.top = `${y}%`; e.style.zIndex = key === 'rug' ? '3' : String(10 + Math.round(y)); },
        () => W(['deco', key], { ...((pk().deco || {})[key] || {}), x: Math.round(parseFloat(e.style.left)), y: Math.round(parseFloat(e.style.top)) }));
      return e;
    }

    function renderRoom() {
      wrap.classList.toggle('night', isNight());
      scale = Math.min(2.4, Math.max(1, roomEl.clientWidth / 300));
      wrap.style.setProperty('--pr-s', o.big ? Math.min(1.8, Math.max(1, roomEl.clientWidth / 520)).toFixed(2) : '1');
      // 처음: 알 고르기
      if (SET.start && !booted) setTimeout(boot, 0); // 쓰기는 mount 가 끝난 다음에 (앱이 쓰자마자 방을 다시 만들지 않게)
      let pickEl = roomEl.querySelector('.pr-pick');
      if (!mons().length && !SET.start) {
        if (!pickEl) {
          pickEl = el('div', { class: 'pr-pick' }, el('b', { text: L().pickTitle }), el('p', { text: L().pickSub }),
            el('div', { class: 'row' }, ...Object.keys(SET.startEggs).map((egg) => el('button', { type: 'button', onclick: () => pickEgg(egg), html: SET.eggHTML(egg) }, eggName(egg)))));
          roomEl.append(pickEl);
        }
      } else if (pickEl) pickEl.remove();
      // 가구
      const deco = pk().deco || {};
      for (const [key, e] of decoEls) if (!deco[key] || deco[key].off || !DK[key]) { e.remove(); decoEls.delete(key); }
      for (const [key, v] of Object.entries(deco)) {
        if (!DK[key] || !v || v.off) continue;
        let e = decoEls.get(key);
        if (!e) { e = decoEl(key); decoEls.set(key, e); roomEl.append(e); }
        if (!e.classList.contains('drag')) {
          const [, dx, dy, wall] = DK[key], x = typeof v.x === 'number' ? v.x : dx, y = typeof v.y === 'number' ? v.y : dy;
          e.style.left = `${x}%`; e.style.top = `${y}%`; e.style.zIndex = key === 'rug' ? '3' : String(wall ? 2 : 10 + Math.round(y));
        }
      }
      // 포켓몬 · 알
      const all = Object.fromEntries(mons().map((m) => [m.id, m])), home = homeIds();
      for (const [id, e] of monEls) if (!home.includes(id)) { e.remove(); monEls.delete(id); }
      for (const id of home) {
        let e = monEls.get(id);
        if (!e) { e = monEl(id); monEls.set(id, e); roomEl.append(e); }
        if (!e._busy) setLook(e, all[id]);
        for (const z of e.querySelectorAll('.zz')) z.remove();
        if (isNight() && !e._egg) e.append(el('span', { class: 'zz', text: '💤' }));
        sizeImg(e);
      }
    }
    function renderBar() {
      if (feeding && !count(feeding)) feeding = '';
      berryRow.replaceChildren(...FS.BERRIES.map(([k, ic]) => {
        const n = count(k);
        return el('button', { type: 'button', class: n ? '' : 'zero', 'aria-pressed': String(feeding === k), 'aria-label': bName(k), onclick: () => {
          if (!n) { say(L().noBerry(bName(k))); return; }
          feeding = feeding === k ? '' : k; snd.tap(2); msgUntil = 0; renderBar();
        } }, el('span', { class: 'e', text: ic }), String(n));
      }));
      coinEl.textContent = `🪙 ${count('coin')}`;
      btnShop.textContent = `🛒 ${L().shop}`; btnShop.setAttribute('aria-pressed', String(open === 'shop'));
      btnDex.textContent = `📖 ${new Set(mons().filter(hatched).map((m) => m.p)).size}/${SET.dex.length}`; btnDex.setAttribute('aria-pressed', String(open === 'dex'));
      if (!msgUntil || Date.now() > msgUntil) msg.textContent = feeding ? L().feedHint(`${BERRY[feeding][1]} ${bName(feeding)}`) : isNight() ? L().sleep : mons().length ? L().pickBerry : '';
    }
    function buy(key, price, done) {
      const c = count('coin');
      if (c < price) { say(L().needCoin(price - c)); armed = ''; renderPanel(); return; }
      if (armed !== key) { armed = key; say(L().again); snd.tap(1); renderPanel(); return; }
      armed = '';
      for (const id of take('coin', price)) W(['items', id], null);
      done(); snd.tada();
    }
    function renderPanel() {
      panel.hidden = !open;
      if (!open) return panel.replaceChildren();
      const closeB = el('button', { type: 'button', text: `✕ ${L().close}`, onclick: () => { open = ''; armed = ''; renderAll(); } });
      const coins = count('coin');
      if (open === 'shop') {
        const deco = pk().deco || {};
        const eggs = el('div', { class: 'pr-grid' }, ...SET.eggs.map((egg) => el('button', { type: 'button', class: armed === `egg:${egg}` ? 'armed' : coins < FS.EGG_PRICE ? 'poor' : '',
          onclick: () => buy(`egg:${egg}`, FS.EGG_PRICE, () => { const id = uid('e'); W(['mons', id], { egg, f: 0, at: Date.now() }); addHome(id); news(L().eggCame(eggName(egg))); }) },
          el('span', { class: 'eg', html: SET.eggHTML(egg) }), el('span', { class: 'n', text: eggName(egg) }), el('span', { text: `🪙 ${FS.EGG_PRICE}` }))));
        const furn = el('div', { class: 'pr-grid' }, ...Object.keys(DK).map((key) => {
          const v = deco[key], has = !!v, on = has && !v.off, price = DK[key][5];
          const ic = key === 'rug' ? el('span', { class: 'rug-ic' }) : el('span', { class: 'e', text: DK[key][0] });
          return el('button', { type: 'button', class: on ? 'on' : armed === `deco:${key}` ? 'armed' : !has && coins < price ? 'poor' : '', onclick: () => {
            if (has) { W(['deco', key], { ...v, off: on ? true : null }); snd.stick(); return; }
            buy(`deco:${key}`, price, () => W(['deco', key], { x: DK[key][1], y: DK[key][2] }));
          } }, ic, has ? null : el('span', { text: `🪙 ${price}` }));
        }));
        panel.replaceChildren(el('h4', {}, el('span', { text: L().shopHead(coins) }), closeB), el('h4', {}, el('span', { text: L().eggs })), eggs,
          el('h4', {}, el('span', { text: L().furn })), el('p', { text: L().decoTip }), furn);
      } else {
        const all = mons(), home = homeIds(), seen = new Set(all.filter(hatched).map((m) => m.p));
        const grid = el('div', { class: 'pr-grid' }, ...[...all].reverse().map((m) => el('button', { type: 'button', class: home.includes(m.id) ? 'on' : '', onclick: () => {
          const h = homeIds(), i = h.indexOf(m.id);
          if (i >= 0) h.splice(i, 1); else if (h.length >= HOME_MAX) { say(L().homeFull); return; } else h.push(m.id);
          W(['home'], h); snd.tap(i >= 0 ? 1 : 3);
        } }, hatched(m) ? el('img', { src: SET.art(m.p), alt: '', loading: 'lazy' }) : el('span', { class: 'eg', html: SET.eggHTML(m.egg) }),
          el('span', { class: 'n', text: hatched(m) ? name(m.p) : eggName(m.egg) }), m.s && hatched(m) ? el('span', { class: 'b', text: '✨' }) : null)));
        const dex = el('div', { class: 'pr-grid' }, ...SET.dex.map((id) => el('button', { type: 'button', class: seen.has(id) ? '' : 'unk', tabindex: '-1' },
          el('img', { src: SET.art(id), alt: '', loading: 'lazy' }), el('span', { class: 'n', text: seen.has(id) ? name(id) : typeof id === 'number' ? `#${id}` : '?' }))));
        panel.replaceChildren(el('h4', {}, el('span', { text: L().homeHead(home.length) }), closeB), grid, el('h4', {}, el('span', { text: L().dexHead(seen.size, SET.dex.length) })), dex);
      }
    }
    function renderAll() { if (!alive) return; renderRoom(); renderBar(); renderPanel(); }

    btnShop.addEventListener('click', () => { open = open === 'shop' ? '' : 'shop'; armed = ''; feeding = ''; renderAll(); });
    btnDex.addEventListener('click', () => { open = open === 'dex' ? '' : 'dex'; armed = ''; feeding = ''; renderAll(); });
    const timer = setInterval(wander, 1200);
    const nightTimer = setInterval(() => { if (wrap.classList.contains('night') !== isNight()) renderAll(); }, 60e3);
    const ro = window.ResizeObserver ? new ResizeObserver(() => { if (alive) renderRoom(); }) : null;
    if (ro) ro.observe(roomEl);
    function destroy() { alive = false; clearInterval(timer); clearInterval(nightTimer); if (ro) ro.disconnect(); }
    renderAll();
    // 쓰기는 mount 가 끝난 다음에 (앱이 쓰자마자 다시 그리면서 방을 또 만들지 않게)
    setTimeout(grants, 900);
    root._pr = { update: () => { renderAll(); grants(); }, destroy };
    return root._pr;
  }
  window.PokeRoom = { mount, DECO, DECO_P };
})();
