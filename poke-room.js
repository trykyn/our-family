/* 🥚 포켓몬 방 / 💖 티니핑 공주방(아린) — 우리가족 앱과 우리집 한눈에(아이패드)가 같이 씀. 다빈 · 아린 · 엄마 · 아빠 각자 방이 하나씩.
   네 명 모두 똑같이: 🎯 미션 탭에서 오늘 미션을 다 하면 선물 상자 → 스티커 + 열매/코인이 이 방 가방에 들어옴.
   처음엔 알 하나를 고름 (불꽃=파이리, 물=꼬부기, 풀=이상해씨, 번개=피카츄).
   오늘 미션을 다 하면 선물 상자에서 열매(5가지) 또는 🪙 코인. 열매를 먹이면 알이 깨고(5개) 포켓몬이 진화(하트 10개, 15개).
   좋아하는 열매는 하트 2개. 코인으로 새 알(10개)과 가구를 삼. 황금 스티커 = 🪙 3개, 황금 스티커 4개마다 🌟 황금 알(전설).
   🍚 돌보기 (다마고치, 2026-11-16): 밥 때(아침 7–12 · 점심 12–17 · 저녁 17–20)마다 방 친구 1~2마리가 배고파함 → 🍚 밥(공짜) → 🤚 쓰다듬기(꾹 누른 채 문지르기)
     → 다 하면 폴짝. 오늘 돌봐 준 친구(밥 · 쓰다듬기 · 목욕)는 미션 열매를 먹을 때 하트 +1 (하루 한 번 — 하트는 미션 열매로만, 2026-11-16 엄마). 하루 두 번 💩 (톡 눌러 치움). 밤엔 🌙 불 끄기 → 쿨쿨. 아침 첫 인사. 안 돌봐도 아프거나 떠나지 않음.
     2단계: 🧼 목욕 (톡톡 3번 → 🚿, 3~5일마다 꼬질꼬질 🛁) · 🤒 감기 (사흘 넘게 못 왔거나 목욕을 아주 오래 못 하면, 아플 때만 💊 버튼이 나옴 — 약값 🪙1, 이틀 지나면 저절로 나음)
       · ⚽ 공놀이 (바닥을 누르면 공 → 친구가 쫓아가 뻥) · 💭 하루 소원 하나 (⚽ 또는 좋아하는 열매 → 들어주면 하트 +1)
     3단계: 🎂 태어난 지 7 · 30 · 100 · 365일 파티 (🪙 선물) · 오늘 미션 응원 ("양치 했어?"), 미션 다 하면 같이 춤
     상태는 시간으로 계산하고 누를 때만 저장: room.care.{id} = { e: 마지막 밥, p: 쓰다듬기, b: 목욕, s: 감기 걸린 때, m: 약 먹은 때 }, pc.{날짜-0|1} = 치운 똥, lo = 불 끈 밤,
       wk = 인사한 날, care.{id}.k = 열매 보너스 받은 날(20261116 꼴), care.{id}.j = 좋아하지 않는 열매를 먹은 날 (하루 한 개), wish = 소원 들어준 날, bd.{id} = 축하한 날수, items.{id} = 'pill' (💊)
   🔊 목소리 (2026-11-16): 포켓몬 = 게임 울음소리 poke/cry/{번호}.m4a (PokeAPI cries) · 티니핑 = 친구마다 다른 '핑♪' + 기기 목소리로 이름 (높고 빠르게). 방 오른쪽 위 🔇 (이 기기에 저장)
   자료: kids.{k}.room (FS.ROOM, stickers-shared.js 맨 위 설명). 방 배경·가구·알은 직접 그린 것/이모지, 포켓몬 그림만 poke/ 폴더.
   쓰는 법: const room = PokeRoom.mount(el, { kid, lang: () => 'ko', data: () => kids[k], write: (path, v) => …(kids.{k} 아래 경로), big?, snd? });
            room.update(); room.destroy(); */
(() => {
  'use strict';
  const FS = window.FamilyStickers;
  // 🖼️ 장소 (포켓몬: 센터 앞 · 체육관 · 바닷가 / 티니핑: 하트로즈 베이커리 · 이모션 왕국 성 정원, 가게 🪙 12) — 장소마다 어울리는 가구 따로 (room.pdeco). ✨ 진화 · 변신은 게임처럼 화면 전체 장면 (evoScene). ❓ 도움말 · 🃏 상태 카드 (2026-11-16): 방 왼쪽 위 ❓ → 아래 칸에 키우는 법 · 좋아하는 열매 · 머리 위 그림 뜻. 친구를 누르면 게임 같은 상태 카드.
  const BASE = (document.currentScript && document.currentScript.src) ? new URL('.', document.currentScript.src).href : './'; // 가구 그림: poke/deco/*.svg
  // 🎨 돌보기 아이콘: 이모지 대신 직접 그린 귀여운 그림 (원본 · 미리보기: Eunjin/_handoff/deco-tools/icons.js · _handoff/icon-test.html)
  const ICON = (() => {
    const K = '#6B3E26';
    const S = (b) => `<svg class="pi" viewBox="0 0 48 48" aria-hidden="true">${b}</svg>`;
    const eyes = (x1, x2, y, r = 1.9) => `<ellipse cx="${x1}" cy="${y}" rx="${r}" ry="${r * 1.2}" fill="#3B2316"/><ellipse cx="${x2}" cy="${y}" rx="${r}" ry="${r * 1.2}" fill="#3B2316"/><circle cx="${x1 + .6}" cy="${y - .8}" r=".7" fill="#fff"/><circle cx="${x2 + .6}" cy="${y - .8}" r=".7" fill="#fff"/>`;
    const blush = (x1, x2, y) => `<ellipse cx="${x1}" cy="${y}" rx="2.6" ry="1.5" fill="#FF8FA8" opacity=".75"/><ellipse cx="${x2}" cy="${y}" rx="2.6" ry="1.5" fill="#FF8FA8" opacity=".75"/>`;
    const smile = (x, y, w = 2.6) => `<path d="M${x - w} ${y}q${w} ${w * 1.1} ${w * 2} 0" stroke="#3B2316" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    const hl = (x, y, rx, ry, rot = -25) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".6" transform="rotate(${rot} ${x} ${y})"/>`;
    const sw = `stroke="${K}" stroke-width="2.2" stroke-linejoin="round"`;
    return {
      rice: S(`<path d="M17 11c-2-3 2-4 0-7M24 10c-2-3 2-4 0-7M31 11c-2-3 2-4 0-7" stroke="#B9CBD8" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M8 25c-1-6 4-9 8-8 1-4 6-6 9-4 3-3 9-1 9 4 4-1 7 3 6 8z" fill="#fff" ${sw}/>
    <path d="M15 21l2 1M22 18l2 .5M29 20l1.5 1.5M20 23l2 .4M33 23l1 1" stroke="#E6DCCB" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M18 41h12l-1 4H19z" fill="#5FAEDB" ${sw}/><path d="M6 25h36c0 10-8 17-18 17S6 35 6 25z" fill="#8FD3F4" ${sw}/>
    ${eyes(19, 29, 31)}${blush(15, 33, 34)}${smile(24, 34)}${hl(12, 29, 2, 4, 20)}`),
      soap: S(`<rect x="5" y="21" width="32" height="20" rx="9" fill="#FF9EC7" ${sw}/><path d="M10 25c4-2 14-2 22 0" stroke="#fff" stroke-width="2.4" opacity=".6" fill="none" stroke-linecap="round"/>
    ${eyes(16, 26, 31)}${blush(12, 30, 34)}${smile(21, 34)}
    <circle cx="37" cy="14" r="6.5" fill="#DFF3FF" stroke="#7FBFE6" stroke-width="1.8"/><circle cx="43" cy="26" r="4" fill="#DFF3FF" stroke="#7FBFE6" stroke-width="1.6"/><circle cx="27" cy="10" r="3.4" fill="#DFF3FF" stroke="#7FBFE6" stroke-width="1.5"/>
    <circle cx="35" cy="12" r="1.8" fill="#fff"/><circle cx="42" cy="25" r="1.1" fill="#fff"/>`),
      ball: S(`<circle cx="24" cy="25" r="18" fill="#fff"/><path d="M24 7c-10 6-12 30 0 36-16-2-22-30 0-36z" fill="#FF6B6B"/><path d="M24 7c10 6 12 30 0 36 16-2 22-30 0-36z" fill="#5BC0EB"/>
    <path d="M24 7c-5 8-5 28 0 36 5-8 5-28 0-36z" fill="#FFD23F"/><circle cx="24" cy="25" r="18" fill="none" ${sw}/><circle cx="24" cy="8.5" r="3" fill="#fff" stroke="${K}" stroke-width="1.6"/>${hl(15, 16, 3, 5.5, 30)}`),
      pill: S(`<g transform="rotate(-35 24 26)"><path d="M15 18h9v16h-9a8 8 0 0 1 0-16z" fill="#FF7EB6"/><path d="M24 18h9a8 8 0 0 1 0 16h-9z" fill="#fff"/>
    <rect x="7" y="18" width="34" height="16" rx="8" fill="none" ${sw}/><path d="M24 18v16" stroke="${K}" stroke-width="1.6"/><path d="M11 22c3-1.5 7-1.5 10-.5" stroke="#fff" stroke-width="2" opacity=".7" fill="none" stroke-linecap="round"/>
    ${eyes(29, 35, 25, 1.4)}${smile(32, 28.5, 1.8)}</g><path d="M40 6l1.4 3.2 3.2 1.4-3.2 1.4L40 15.2l-1.4-3.2-3.2-1.4 3.2-1.4z" fill="#FFD23F"/>`),
      hand: S(`<rect x="13.5" y="11" width="5.6" height="18" rx="2.8" fill="#FFDCC0" ${sw}/><rect x="19.4" y="7" width="5.6" height="20" rx="2.8" fill="#FFDCC0" ${sw}/><rect x="25.3" y="8" width="5.6" height="20" rx="2.8" fill="#FFDCC0" ${sw}/><rect x="31.2" y="12" width="5.4" height="17" rx="2.7" fill="#FFDCC0" ${sw}/>
    <ellipse cx="11" cy="30" rx="4" ry="7" transform="rotate(-35 11 30)" fill="#FFDCC0" ${sw}/><path d="M12 26c0 12 6 18 13 18s12-6 12-14v-6H12z" fill="#FFDCC0" ${sw}/>
    <path d="M14 25h22" stroke="#FFDCC0" stroke-width="3"/>${blush(19, 31, 35)}<path d="M41 4c-3-2-6 0-5 3 0 2 3 4 5 5 2-1 5-3 5-5 1-3-2-5-5-3z" fill="#FF6FA8"/>`),
      bath: S(`<circle cx="15" cy="16" r="5" fill="#DFF3FF" stroke="#7FBFE6" stroke-width="1.6"/><circle cx="23" cy="13" r="6" fill="#DFF3FF" stroke="#7FBFE6" stroke-width="1.6"/><circle cx="31" cy="17" r="4.4" fill="#DFF3FF" stroke="#7FBFE6" stroke-width="1.6"/>
    <circle cx="21.5" cy="11" r="1.6" fill="#fff"/><circle cx="38" cy="15" r="3" fill="#FFD23F" stroke="${K}" stroke-width="1.4"/><path d="M40.5 15.5l3 .5-3 1" fill="#FF9F1C"/><circle cx="38.6" cy="14.2" r=".7" fill="#3B2316"/>
    <path d="M4 21h40v4H4z" fill="#fff" ${sw}/><path d="M6 25h36v4c0 7-5 11-12 11H18c-7 0-12-4-12-11z" fill="#fff" ${sw}/><path d="M9 27h30" stroke="#8FD3F4" stroke-width="3" stroke-linecap="round"/>
    <circle cx="14" cy="43" r="2.4" fill="#F6CF6A" stroke="${K}" stroke-width="1.4"/><circle cx="34" cy="43" r="2.4" fill="#F6CF6A" stroke="${K}" stroke-width="1.4"/>${hl(12, 31, 1.6, 3, 10)}`),
      sick: S(`<circle cx="22" cy="26" r="16" fill="#FFE7A8" ${sw}/><path d="M13 22l4 2-4 2M31 22l-4 2 4 2" stroke="#3B2316" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    ${blush(13, 31, 30)}<path d="M17 33q2.5-2 5 0t5 0" stroke="#3B2316" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M28 31l14-10" stroke="${K}" stroke-width="5.6" stroke-linecap="round"/><path d="M28 31l14-10" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/><path d="M33 27.5l7-5" stroke="#FF6B6B" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="27.5" cy="31.5" r="2.6" fill="#FF6B6B" stroke="${K}" stroke-width="1.2"/><path d="M38 6c2 3 3 5 3 6.5a3 3 0 0 1-6 0C35 11 36 9 38 6z" fill="#8FD3F4" stroke="#5FAEDB" stroke-width="1.2"/>`),
      poop: S(`<path d="M28 6c4 0 5 4 3 7" stroke="#5A3A22" stroke-width="2" fill="none" stroke-linecap="round"/>
    <ellipse cx="24" cy="38" rx="18" ry="7.5" fill="#A8754A" stroke="#5A3A22" stroke-width="2.2"/><ellipse cx="24" cy="28.5" rx="13.5" ry="6.5" fill="#B9834F" stroke="#5A3A22" stroke-width="2.2"/>
    <ellipse cx="24" cy="19.5" rx="8.5" ry="5.5" fill="#C7915B" stroke="#5A3A22" stroke-width="2.2"/><path d="M24 14c2-2 5-3 5-7" stroke="#5A3A22" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    ${hl(19, 17, 2, 1, -10)}${hl(15, 26, 3, 1.2, -10)}${eyes(19, 29, 35.5)}${blush(14.5, 33.5, 39)}${smile(24, 38.5, 2.4)}`),
      shower: S(`<path d="M36 4v7H26" stroke="#9AA3AD" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M11 21a13 10 0 0 1 26 0z" fill="#D7DEE6" ${sw}/><rect x="9" y="20" width="30" height="4.6" rx="2.3" fill="#B7C0CC" ${sw}/>
    ${[[14, 31], [22, 34], [30, 31], [18, 41], [27, 43], [36, 39]].map(([x, y]) => `<path d="M${x} ${y - 4}c2 3 3 4.5 3 6a3 3 0 0 1-6 0c0-1.5 1-3 3-6z" fill="#8FD3F4" stroke="#5FAEDB" stroke-width="1"/>`).join('')}`),
      bubbles: S(`<circle cx="18" cy="28" r="12" fill="#E8F7FF" stroke="#8EC9EA" stroke-width="2"/><circle cx="34" cy="20" r="8" fill="#F3E8FF" stroke="#C3A8F0" stroke-width="2"/><circle cx="35" cy="37" r="6" fill="#FFE8F3" stroke="#F0A8CB" stroke-width="2"/>
    <circle cx="13" cy="23" r="3" fill="#fff"/><circle cx="31" cy="17" r="2" fill="#fff"/><circle cx="33" cy="35" r="1.5" fill="#fff"/>`),
      drop: S(`<path d="M24 5c8 11 13 18 13 24a13 13 0 0 1-26 0c0-6 5-13 13-24z" fill="#8FD3F4" stroke="#4E9CCB" stroke-width="2.2"/>${hl(18, 28, 2.4, 5, 15)}`),
      sparkle: S(`<path d="M24 3l4.5 16.5L45 24l-16.5 4.5L24 45l-4.5-16.5L3 24l16.5-4.5z" fill="#FFE27A" stroke="#E0A92A" stroke-width="1.8" stroke-linejoin="round"/><circle cx="24" cy="24" r="4" fill="#fff"/>`),
      star: S(`<path d="M24 4l6 12.6 13.6 1.8-10 9.4 2.6 13.6L24 34.8l-12.2 6.6 2.6-13.6-10-9.4L18 16.6z" fill="#FFD23F" ${sw}/>${eyes(19.5, 28.5, 25, 1.5)}${smile(24, 28.5, 2)}`),
      heart: S(`<path d="M24 42C8 31 3 21 7 13c4-7 13-7 17 1 4-8 13-8 17-1 4 8-1 18-17 29z" fill="#FF6FA8" stroke="#D93A7E" stroke-width="2.2" stroke-linejoin="round"/>${hl(15, 16, 3, 5, 35)}`),
      party: S(`<path d="M8 42l8-26 18 18z" fill="#FFD23F" ${sw}/><path d="M11 33l5 5M13 26l9 9" stroke="#FF6B6B" stroke-width="2.4"/>
    <circle cx="32" cy="10" r="2.6" fill="#FF6FA8"/><circle cx="40" cy="20" r="2.4" fill="#5BC0EB"/><path d="M24 6l3 4M38 30l4 2M42 8l-3 3" stroke="#9BE564" stroke-width="2.6" stroke-linecap="round"/><circle cx="44" cy="30" r="1.8" fill="#C79BF2"/>`),
      cake: S(`<path d="M24 5c2 3 3 4.5 3 6a3 3 0 0 1-6 0c0-1.5 1-3 3-6z" fill="#FFB020"/><rect x="22.5" y="11" width="3" height="9" rx="1" fill="#FF8FC0" stroke="${K}" stroke-width="1.2"/>
    <rect x="8" y="20" width="32" height="20" rx="4" fill="#FFF2E2" ${sw}/><path d="M8 25c4 5 6 0 9 3s5-2 8 1 5-2 8 0 5-3 7-3v-6H8z" fill="#FF9EC7" stroke="${K}" stroke-width="1.6"/>
    <path d="M5 40h38" stroke="${K}" stroke-width="2.4" stroke-linecap="round"/>${eyes(19, 29, 33, 1.6)}${smile(24, 36, 2)}`),
      moon: S(`<path d="M30 6a18 18 0 1 0 12 30A15 15 0 0 1 30 6z" fill="#FFE27A" ${sw}/><path d="M17 26q2 2 4 0M26 30q2 2 4 0" stroke="#3B2316" stroke-width="1.6" fill="none" stroke-linecap="round"/>${blush(16, 32, 31)}
    <path d="M40 8l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1z" fill="#FFF3B0"/>`),
      bulb: S(`<path d="M24 5a13 13 0 0 0-8 23c2 2 3 4 3 7h10c0-3 1-5 3-7a13 13 0 0 0-8-23z" fill="#FFE27A" ${sw}/><rect x="18" y="35" width="12" height="7" rx="2" fill="#B7C0CC" ${sw}/>
    ${eyes(19.5, 28.5, 18, 1.6)}${smile(24, 21.5, 2)}${hl(17, 11, 1.8, 3.6, 20)}<path d="M5 18h-3M43 18h3M9 6l-2-2M39 6l2-2" stroke="#FFC928" stroke-width="2" stroke-linecap="round"/>`),
      coin: S(`<circle cx="24" cy="24" r="19" fill="#FFC928" ${sw}/><circle cx="24" cy="24" r="14" fill="#FFDD55" stroke="#E0A92A" stroke-width="1.8"/>
    <path d="M24 14l2.8 6 6.4.6-4.8 4.3 1.4 6.4-5.8-3.3-5.8 3.3 1.4-6.4-4.8-4.3 6.4-.6z" fill="#FFF3B0" stroke="#E0A92A" stroke-width="1.2" stroke-linejoin="round"/>${hl(15, 14, 2, 4, 40)}`),
      shop: S(`<path d="M14 18c0-10 20-10 20 0" stroke="${K}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M5 18h38l-4 22c-1 3-3 4-6 4H15c-3 0-5-1-6-4z" fill="#FFB46B" ${sw}/>
    <path d="M8 25h32M10 32h28" stroke="#E0883E" stroke-width="1.6"/><path d="M17 18v24M24 18v26M31 18v24" stroke="#E0883E" stroke-width="1.6"/><path d="M24 30c-4-3-5-6-3-7.4 1.4-1 2.6 0 3 1 .4-1 1.6-2 3-1 2 1.4 1 4.4-3 7.4z" fill="#FF6FA8"/>`),
      book: S(`<path d="M6 10c6-3 12-3 18 1v31c-6-4-12-4-18-1z" fill="#8FD3F4" ${sw}/><path d="M42 10c-6-3-12-3-18 1v31c6-4 12-4 18-1z" fill="#C3E9FB" ${sw}/>
    <path d="M10 17c3-1 7-1 10 1M10 23c3-1 7-1 10 1M28 18c3-2 7-2 10-1M28 24c3-2 7-2 10-1" stroke="#fff" stroke-width="2" stroke-linecap="round"/><path d="M33 30l1.6 3.4 3.6.4-2.7 2.4.8 3.6-3.3-1.9-3.3 1.9.8-3.6-2.7-2.4 3.6-.4z" fill="#FFD23F"/>`),
      zz: S(`<path d="M10 22h12L10 36h12" stroke="#8E7CE6" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 10h9l-9 10h9" stroke="#B3A6F2" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`),
      yawn: S(`<circle cx="24" cy="25" r="17" fill="#FFE7A8" ${sw}/><path d="M14 22q3 2 6 0M28 22q3 2 6 0" stroke="#3B2316" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <ellipse cx="24" cy="32" rx="4" ry="5" fill="#B5485F" stroke="#3B2316" stroke-width="1.4"/>${blush(13, 35, 28)}<path d="M38 18c1.6 2 2.4 3.4 2.4 4.4a2.4 2.4 0 0 1-4.8 0c0-1 .8-2.4 2.4-4.4z" fill="#8FD3F4"/>`),
      sun: S(`<g stroke="#FFB020" stroke-width="3" stroke-linecap="round">${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<line x1="24" y1="3" x2="24" y2="8" transform="rotate(${a} 24 24)"/>`).join('')}</g>
<circle cx="24" cy="24" r="12.5" fill="#FFD23F" ${sw}/>${eyes(19.5, 28.5, 22.5, 1.5)}${blush(15.5, 32.5, 27)}${smile(24, 26.5, 2)}`),
    note: S(`<path d="M18 36V13l20-6v23" stroke="${K}" stroke-width="2.6" fill="none" stroke-linejoin="round"/><path d="M18 17l20-6" stroke="${K}" stroke-width="4.4"/>
<ellipse cx="13.5" cy="36" rx="6.2" ry="4.8" fill="#FF7EB6" ${sw}/><ellipse cx="33.5" cy="30" rx="6.2" ry="4.8" fill="#8FA8FF" ${sw}/>${hl(11.5, 34.5, 1.6, 1, -20)}${hl(31.5, 28.5, 1.6, 1, -20)}`),
    sound: S(`<path d="M7 19h7l11-9v28l-11-9H7z" fill="#FFD23F" ${sw}/><path d="M31 18c3 3 3 9 0 12M36 13c6 5 6 17 0 22" stroke="${K}" stroke-width="2.6" fill="none" stroke-linecap="round"/>${hl(11, 22, 1.4, 2.4, 0)}`),
    mute: S(`<path d="M7 19h7l11-9v28l-11-9H7z" fill="#D7DEE6" ${sw}/><path d="M31 19l10 10M41 19L31 29" stroke="#FF6B6B" stroke-width="3.4" stroke-linecap="round"/>`),
    help: S(`<path d="M24 5c11 0 19 7 19 16s-8 16-19 16c-2 0-4 0-6-1l-8 6 2-8c-4-3-7-8-7-13 0-9 8-16 19-16z" fill="#8FD3F4" ${sw}/>
<path d="M19 17c0-4 3-6 6-6s6 2 6 5c0 4-6 4-6 8" stroke="#fff" stroke-width="3.6" fill="none" stroke-linecap="round"/><circle cx="25" cy="29.5" r="2.3" fill="#fff"/>`),
    pokeball: S(`<circle cx="24" cy="24" r="19" fill="#fff" ${sw}/><path d="M5 24a19 19 0 0 1 38 0z" fill="#FF5A5A" ${sw}/><path d="M5 24h38" stroke="${K}" stroke-width="3.4"/>
<circle cx="24" cy="24" r="6.2" fill="#fff" ${sw}/><circle cx="24" cy="24" r="2.6" fill="#F1EDE6" stroke="${K}" stroke-width="1.2"/>${hl(15, 13, 3, 5.5, 40)}`),
    strawberry: S(`<path d="M24 44C10 38 6 26 9 19c3-6 10-5 15-3 5-2 12-3 15 3 3 7-1 19-15 25z" fill="#FF5A6E" ${sw}/>
    ${[[16, 24], [24, 22], [32, 24], [20, 31], [28, 31], [24, 38]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1" ry="1.5" fill="#FFE27A"/>`).join('')}
    <path d="M24 17l-7-6 5 1-1-6 3 5 3-5-1 6 5-1z" fill="#5CBF6E" stroke="#2E8A44" stroke-width="1.6" stroke-linejoin="round"/>${hl(14, 25, 2, 4, 20)}`),
      apple: S(`<path d="M24 15c-4-3-14-4-16 6-2 11 6 23 12 22 2 0 3-1 4-1s2 1 4 1c6 1 14-11 12-22-2-10-12-9-16-6z" fill="#FF5A5A" ${sw}/>
    <path d="M24 15c0-4 1-7 3-9" stroke="${K}" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M26 10c3-5 9-5 12-3-2 4-8 6-12 3z" fill="#5CBF6E" stroke="#2E8A44" stroke-width="1.6"/>${hl(14, 24, 2.4, 5, 15)}`),
      blueberry: S(`<circle cx="16" cy="30" r="10" fill="#6F7FE8" ${sw}/><circle cx="32" cy="30" r="10" fill="#5B6BD6" ${sw}/><circle cx="24" cy="18" r="10" fill="#7F8EF0" ${sw}/>
    <path d="M21 16l3-3 3 3M13 28l3-3 3 3M29 28l3-3 3 3" stroke="#3B3F8F" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>${hl(20, 14, 1.6, 3, 30)}${hl(12, 27, 1.4, 2.6, 30)}<path d="M28 9c2-4 6-5 9-4-1 3-5 5-9 4z" fill="#5CBF6E" stroke="#2E8A44" stroke-width="1.4"/>`),
      banana: S(`<path d="M8 14c0 18 10 28 28 26 4 0 6-3 4-5-14 2-24-6-26-20-1-3-6-4-6-1z" fill="#FFE04D" ${sw}/><path d="M12 17c2 12 10 19 22 19" stroke="#F0B90B" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M8 14l-1-5 4 1z" fill="#8A6A3A" stroke="${K}" stroke-width="1.6" stroke-linejoin="round"/><path d="M39 37l3 1" stroke="#5A3A22" stroke-width="2.4" stroke-linecap="round"/>${hl(13, 22, 1.4, 4, -25)}`),
      pepper: S(`<path d="M20 14c-8 2-10 12-6 20 4 9 16 12 24 10 2-1 2-3 0-4-8-1-12-6-11-16 0-6-3-11-7-10z" fill="#FF4D3D" ${sw}/>
    <path d="M20 14c-1-4 1-8 5-9" stroke="#2E8A44" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M15 15c3-3 9-3 11 0-3 2-8 2-11 0z" fill="#5CBF6E" stroke="#2E8A44" stroke-width="1.6"/>${hl(15, 24, 1.6, 4.4, 10)}`),
    };
  })();
  const HOME_MAX = 6, EGG_NEED = 5;
  const BERRY = Object.fromEntries(FS.BERRIES.map((b) => [b[0], b]));
  const jong = (w) => { const c = w.charCodeAt(w.length - 1) - 0xAC00; return c >= 0 && c < 11172 ? c % 28 : 0; };
  const rang = (w) => w + (jong(w) ? '이랑' : '랑');
  const iga = (w) => w + (jong(w) ? '이' : '가'), euro = (w) => w + (jong(w) && jong(w) !== 8 ? '으로' : '로');
  const T = {
    ko: {
      pickTitle: '🥚 알을 하나 골라요!', pickSub: '열매를 먹이면 알에서 포켓몬이 나와요', shop: '가게', close: '닫기',
      noBerry: (b) => `${iga(b)} 없어요. 오늘 미션을 하면 받아요`, feedHint: (b) => `${b} 줄 친구를 눌러요`, pickBerry: '열매를 고르고 친구를 눌러서 먹여요',
      ate: (n) => `냠냠! ${n}`, fav: '좋아해요! 💖💖', hatched: (n) => `펑! ${iga(n)} 태어났어요!`, shinyHatch: (n) => `✨ 반짝이 ${iga(n)} 태어났어요!!`,
      evolved: (a, b) => `${iga(a)} ${euro(b)} 진화했어요!`, eggInfo: (n) => `🥚 열매 ${n}개 더 먹으면 태어나요`, toEvo: (n) => `진화까지 하트 ${n}개`, likes: (b) => `좋아하는 열매 ${b}`,
      shopHead: (c) => `코인 ${c}개`, eggs: '🥚 알', furn: '🪑 가구', bgHead: '🖼️ 장소 바꾸기', bgTip: '산 장소는 눌러서 언제든 바꿔요', bgOn: '사용 중', needCoin: (n) => `코인이 ${n}개 더 필요해요`, again: '한 번 더 누르면 사요',
      eggCame: (n) => `🥚 ${iga(n)} 왔어요!`, whoHead: '👑 로미와 친구들', whoTip: '알에서는 안 나와요. 가게에서 데려와요. 로미는 하트 10개마다 새 모습으로 변신해요!', whoCame: (n) => `👑 ${iga(n)} 놀러 왔어요!`, whoHave: (n) => `${iga(n)} 벌써 우리 방에 있어요`, forms: '모습 고르기', decoTip: '산 가구는 눌러서 놓거나 치워요. 방에서 끌어서 옮겨요.',
      homeHead: (n) => `방에 나온 친구 ${n} / ${HOME_MAX} — 눌러서 넣고 빼요`, homeFull: `방에는 ${HOME_MAX}마리까지 나올 수 있어요`, dexHead: (n, N) => `도감 ${n} / ${N}`,
      tapEgg: '🥚 알을 톡 눌러 봐요! 바로 깨어나요', goldBonus: '🏅 황금 스티커 보너스! 🪙 코인 3개', goldEgg: '🌟 황금 알이 생겼어요! 전설의 포켓몬이 들어 있대요', sleep: '쿨쿨… 밤이라 자고 있어요',
      rice: '밥', riceHint: '🍚 밥 줄 친구를 눌러요', full: (n) => `${n}: 배불러요 😋`, yum: '냠냠! 맛있어요 😋', eggRice: '알은 열매만 먹어요',
      lightOff: '불 끄기', lightOn: '불 켜기', sleepy: '하암… 졸려요. 🌙 불을 꺼 주세요', night: '잘 자! 💤', morning: '☀️ 좋은 아침! 잘 잤어요?', hello: '👋 반가워요! 같이 놀아요', missed: '🥹 보고 싶었어요!',
      hungry: '🍚 배고픈 친구가 있어요. 밥을 줘요', petMe: '🤚 친구를 꾹 누른 채 문지르면 쓰다듬어요', poo: '💩 똥을 톡 눌러서 치워 줘요', cleaned: '✨ 깨끗해졌어요!', careBonus: (n) => `💕 잘 돌봐 줘서 ${iga(n)} 하트를 1개 더 받았어요!`, oneBerry: (n, b) => `${n}: 오늘 열매는 벌써 먹었어요. 좋아하는 ${b} 는 또 먹을 수 있어요!`,
      evoStart: (n) => `어라…? ${n}의 모습이…!`, evoStartP: (n) => `어머…? ${iga(n)} 반짝반짝 빛나요…!`, evoDone: (a, b) => `🎉 축하해요! ${iga(a)} ${euro(b)} 진화했어요!`,
      evoDoneP: (a, b) => `✨ 짜잔! ${iga(a)} ${euro(b)} 변신했어요!`, evoOk: '와! 좋아요',
      hatchStart: '어…? 알이 움직여요…!', hatchStartP: '어…? 하트가 두근두근 뛰어요…!', hatchMid: '조금만 더…! 💥', hatchOk: '반가워!',
      hatchDone: (n, sh) => (sh ? `✨ 와아! 반짝이 ${iga(n)} 태어났어요!` : `🎉 펑! ${iga(n)} 태어났어요!`), petted: (n) => `${n} 💕`,
      soap: '목욕', ball: '공놀이', pill: '약', scrub: '뽀글뽀글 🫧', bathed: '뽀득뽀득! 깨끗해졌어요 ✨', bathIn: '첨벙! 욕조에 쏙 🫧', eggClean: '알은 반짝반짝 깨끗해요',
      soapHint: '🧼 씻길 친구를 톡톡톡 눌러요', ballHint: '⚽ 방바닥을 누르면 공을 던져요', pillHint: '💊 아픈 친구를 누르면 약을 줘요 (🪙 1개)', noPill: '💊 약이 없어요', noCoinPill: '🪙 코인이 1개 있어야 약을 줄 수 있어요. 푹 쉬면 이틀 뒤에 나아요',
      notSick: '안 아파요! 약은 아껴 둬요', cured: (n) => `💊 ${iga(n)} 다 나았어요! 고마워요`, sick: '🤒 아픈 친구가 있어요. 💊 약을 줘요', sickSay: (n) => `🤒 ${iga(n)} 감기에 걸렸어요… 💊 약을 주세요`,
      caught: (n) => `🤧 ${iga(n)} 감기에 걸렸어요! 💊 약을 주세요`, achoo: '에취! 🤧', dirty: '🛁 목욕할 친구가 있어요. 🧼 비누로 씻겨 줘요',
      wishPlay: (n) => `💭 ${iga(n)} ⚽ 공놀이 하고 싶대요!`, wishBerry: (n, b) => `💭 ${iga(n)} ${b} 먹고 싶대요!`, wishHint: '💭 소원이 있는 친구가 있어요. 눌러 봐요', wishDone: (n) => `🌟 ${n}의 소원을 들어줬어요! 하트 +1`,
      age: (d) => (d ? `🎂 태어난 지 ${d}일` : '🎂 오늘 태어났어요'), party: (n, d, c) => `🎂 ${iga(n)} 태어난 지 ${d}일! 축하 선물 🪙 ${c}`, cheer: (ic, t) => `${ic} ${t} 했어?`,
      yay: '미션 다 했어! 최고! 🎉', allDone: '🎉 오늘 미션 다 했어요! 친구들이 신났어요', pills: '💊 약', pillTip: '아픈 친구에게 주면 바로 나아요', bought: '💊 약을 샀어요',
    },
    de: {
      pickTitle: '🥚 Such dir ein Ei aus!', pickSub: 'Füttere es mit Beeren, dann schlüpft ein Pokémon', shop: 'Laden', close: 'Schließen',
      noBerry: (b) => `Keine ${b}. Schaffe deine Tagesmission!`, feedHint: (b) => `Tippe ein Pokémon an, um ${b} zu geben`, pickBerry: 'Beere wählen, dann Pokémon antippen',
      ate: (n) => `Mampf! ${n}`, fav: 'Lecker! 💖💖', hatched: (n) => `Plopp! ${n} ist geschlüpft!`, shinyHatch: (n) => `✨ Ein schillerndes ${n} ist geschlüpft!!`,
      evolved: (a, b) => `${a} hat sich zu ${b} entwickelt!`, eggInfo: (n) => `🥚 Noch ${n} Beeren bis zum Schlüpfen`, toEvo: (n) => `Noch ${n} Herzen bis zur Entwicklung`, likes: (b) => `Lieblingsbeere ${b}`,
      shopHead: (c) => `${c} Münzen`, eggs: '🥚 Eier', furn: '🪑 Möbel', bgHead: '🖼️ Ort wechseln', bgTip: 'Gekaufte Orte jederzeit antippen zum Wechseln', bgOn: 'Aktiv', needCoin: (n) => `Dir fehlen noch ${n} Münzen`, again: 'Nochmal tippen zum Kaufen',
      eggCame: (n) => `🥚 Ein ${n} ist da!`, whoHead: '👑 Romi & Freunde', whoTip: 'Kommen nicht aus Eiern – hier abholen. Romi verwandelt sich alle 10 Herzen neu!', whoCame: (n) => `👑 ${n} ist zu Besuch!`, whoHave: (n) => `${n} ist schon da`, forms: 'Aussehen wählen', decoTip: 'Gekaufte Möbel antippen zum Aufstellen/Wegräumen. Im Zimmer verschieben.',
      homeHead: (n) => `Im Zimmer ${n} / ${HOME_MAX} – tippen zum Rein/Raus`, homeFull: `Höchstens ${HOME_MAX} im Zimmer`, dexHead: (n, N) => `Pokédex ${n} / ${N}`,
      tapEgg: '🥚 Tippe das Ei an – es schlüpft sofort!', goldBonus: '🏅 Goldsticker-Bonus! 🪙 3 Münzen', goldEgg: '🌟 Ein Gold-Ei! Darin steckt ein legendäres Pokémon', sleep: 'Zzz… nachts wird geschlafen',
      rice: 'Futter', riceHint: '🍚 Tippe an, wen du füttern willst', full: (n) => `${n}: Satt 😋`, yum: 'Mampf! Lecker 😋', eggRice: 'Eier fressen nur Beeren',
      lightOff: 'Licht aus', lightOn: 'Licht an', sleepy: 'Gähn… müde. 🌙 Mach das Licht aus', night: 'Gute Nacht! 💤', morning: '☀️ Guten Morgen! Gut geschlafen?', hello: '👋 Hallo! Spiel mit mir', missed: '🥹 Ich hab dich vermisst!',
      hungry: '🍚 Jemand hat Hunger. Gib Futter', petMe: '🤚 Gedrückt halten und reiben = streicheln', poo: '💩 Tippe auf den Haufen zum Saubermachen', cleaned: '✨ Alles sauber!', careBonus: (n) => `💕 Gut gepflegt – ${n} bekommt 1 Herz extra!`, oneBerry: (n, b) => `${n} hatte heute schon eine Beere. Die Lieblingsbeere ${b} geht immer!`,
      evoStart: (n) => `Nanu…? ${n} verändert sich…!`, evoStartP: (n) => `Oh…? ${n} glitzert…!`, evoDone: (a, b) => `🎉 Glückwunsch! ${a} hat sich zu ${b} entwickelt!`,
      evoDoneP: (a, b) => `✨ Tadaa! ${a} hat sich in ${b} verwandelt!`, evoOk: 'Juhu!',
      hatchStart: 'Huch…? Das Ei wackelt…!', hatchStartP: 'Oh…? Das Herz pocht…!', hatchMid: 'Gleich…! 💥', hatchOk: 'Hallo!',
      hatchDone: (n, sh) => (sh ? `✨ Wow! Ein schillerndes ${n} ist geschlüpft!` : `🎉 Plopp! ${n} ist geschlüpft!`), petted: (n) => `${n} 💕`,
      soap: 'Baden', ball: 'Ball', pill: 'Medizin', scrub: 'Schrubb 🫧', bathed: 'Blitzsauber! ✨', bathIn: 'Platsch! Ab in die Wanne 🫧', eggClean: 'Eier sind schon sauber',
      soapHint: '🧼 Tippe 3× auf wen du baden willst', ballHint: '⚽ Tippe auf den Boden zum Werfen', pillHint: '💊 Tippe auf den Kranken (kostet 🪙 1)', noPill: '💊 Keine Medizin', noCoinPill: '🪙 Medizin kostet 1 Münze. Nach 2 Tagen Ruhe wird es auch so gesund',
      notSick: 'Nicht krank! Heb die Medizin auf', cured: (n) => `💊 ${n} ist wieder gesund! Danke`, sick: '🤒 Jemand ist krank. Gib 💊 Medizin', sickSay: (n) => `🤒 ${n} ist erkältet… gib 💊 Medizin`,
      caught: (n) => `🤧 ${n} hat sich erkältet! Gib 💊 Medizin`, achoo: 'Hatschi! 🤧', dirty: '🛁 Jemand muss baden. Nimm die 🧼 Seife',
      wishPlay: (n) => `💭 ${n} will ⚽ Ball spielen!`, wishBerry: (n, b) => `💭 ${n} möchte ${b}!`, wishHint: '💭 Jemand hat einen Wunsch. Tipp es an', wishDone: (n) => `🌟 Wunsch von ${n} erfüllt! +1 Herz`,
      age: (d) => (d ? `🎂 ${d} Tage alt` : '🎂 Heute geschlüpft'), party: (n, d, c) => `🎂 ${n} ist ${d} Tage alt! Geschenk 🪙 ${c}`, cheer: (ic, t) => `${ic} ${t} schon gemacht?`,
      yay: 'Mission geschafft! Super! 🎉', allDone: '🎉 Heute alle Missionen geschafft! Alle freuen sich', pills: '💊 Medizin', pillTip: 'Macht Kranke sofort gesund', bought: '💊 Medizin gekauft',
    },
  };
  // 💖 티니핑 방(아린)에서 바뀌는 글
  const TP = {
    ko: { eggInfo: (n) => `💖 열매 ${n}개 더 먹으면 티니핑이 나와요`, goldEgg: '👑 황금 하트가 생겼어요! 특별한 티니핑이 들어 있대요', eggCame: (n) => `💖 ${iga(n)} 왔어요!`,
      eggs: '💖 하트 알', toEvo: (n) => `변신까지 하트 ${n}개`, changed: (n) => `✨ ${n} 모습으로 변신했어요!`,
      tapEgg: '💖 하트를 톡 눌러 봐요! 바로 깨어나요', toGift: (n) => `선물까지 하트 ${n}개`,
      refund: (c) => `🪑 가구가 바뀌어서 🪙 코인 ${c}개를 돌려받았어요`, closer: (n, lv) => `💗 ${rang(n)} 더 친해졌어요! 💗${lv}`, bff: (n) => `✨ ${rang(n)} 단짝이 됐어요! 반짝반짝` },
    de: { eggInfo: (n) => `💖 Noch ${n} Beeren, dann kommt ein Teenieping`, goldEgg: '👑 Ein Goldherz! Darin steckt ein besonderes Teenieping', eggCame: (n) => `💖 ${n} ist da!`,
      eggs: '💖 Herz-Eier', toEvo: (n) => `Noch ${n} Herzen bis zur Verwandlung`, changed: (n) => `✨ Verwandelt in ${n}!`,
      tapEgg: '💖 Tippe das Herz an – es schlüpft sofort!', dexHead: (n, N) => `Sammlung ${n} / ${N}`, toGift: (n) => `Noch ${n} Herzen bis zum Geschenk`,
      refund: (c) => `🪑 Neue Möbel – 🪙 ${c} Münzen zurück`, closer: (n, lv) => `💗 Du und ${n} seid jetzt noch engere Freunde! 💗${lv}`, bff: (n) => `✨ ${n} ist jetzt deine beste Freundin! Glitzer!` },
  };
  // 가구 (2026-11-16 이모지 → 직접 그린 그림 poke/deco/{그림}.svg, 캐릭터 키에 맞춘 크기)
  //   [그림, 기본 x, 기본 y(밑동, %), 벽(1), 너비(방 300px 기준), 값(코인), 이름, 독일어 이름]
  //   포켓몬 방: 나무 · 몬스터볼 무늬 + PokeAPI 도구 그림 (몬스터볼 · 나무열매 · 상처약)
  const DECO = {
    rug: ['pk-rug', 50, 80, 0, 110, 3, '몬스터볼 러그', 'Pokéball-Teppich'], plant: ['pk-plant', 6, 64, 0, 32, 3, '화분', 'Topfpflanze'],
    teddy: ['pk-pikadoll', 30, 93, 0, 32, 3, '피카츄 인형', 'Pikachu-Puppe'], ball: ['pk-ballstand', 56, 95, 0, 42, 2, '몬스터볼 받침대', 'Ball-Regal'],
    cake: ['pk-basket', 50, 75, 0, 38, 2, '나무열매 바구니', 'Beerenkorb'], balloon: ['pk-balloon', 95, 50, 1, 20, 2, '몬스터볼 풍선', 'Pokéball-Ballon'],
    frame: ['pk-poster', 72, 40, 1, 34, 3, '피카츄 포스터', 'Pikachu-Poster'], books: ['pk-shelf', 91, 64, 0, 50, 3, '책장', 'Bücherregal'],
    clock: ['pk-clock', 30, 22, 1, 28, 4, '몬스터볼 시계', 'Pokéball-Uhr'], kite: ['pk-badges', 85, 27, 1, 46, 4, '배지 액자', 'Orden-Rahmen'],
    rainbow: ['pk-map', 16, 40, 1, 54, 5, '타운맵', 'Stadtplan'], bed: ['pk-bed', 16, 74, 0, 96, 6, '몬스터볼 침대', 'Pokéball-Bett'],
    sofa: ['pk-snorlax', 80, 74, 0, 66, 6, '잠만보 쿠션', 'Relaxo-Kissen'], piano: ['pk-pc', 64, 63, 0, 60, 8, '포켓몬 PC', 'Pokémon-PC'],
    tent: ['pk-heal', 37, 63, 0, 58, 8, '회복 머신', 'Heilmaschine'], slide: ['pk-bike', 78, 96, 0, 56, 8, '자전거', 'Fahrrad'],
  };
  // 👑 공주방 가구 (아린)
  // (티니핑이 몸에 하는 것처럼 보이는 리본 · 왕관 · 드레스 · 발레 슈즈 · 요술봉 · 보석은 2026-11-15 뺌 — 진짜 방 가구만)
  const DECO_P = { // 💖 이모션 왕국 공주방: 파스텔 · 금색 테두리 · 하트 (몸에 하는 것처럼 보이는 물건은 넣지 않음)
    rug: ['pp-rug', 50, 80, 0, 110, 3, '하트 러그', 'Herzteppich'], flowers: ['pp-roses', 6, 64, 0, 28, 3, '장미 꽃병', 'Rosenvase'],
    tulip: ['pp-topiary', 95, 64, 0, 30, 2, '하트 나무 화분', 'Herzbäumchen'], mirror: ['pp-vanity', 82, 62, 0, 52, 4, '하트 화장대', 'Herz-Frisiertisch'],
    frame: ['pp-portrait', 18, 43, 1, 36, 3, '하츄핑 초상화', 'Heartsping-Bild'], clock: ['pp-clock', 82, 22, 1, 30, 4, '별 시계', 'Sternuhr'],
    disco: ['pp-chandelier', 50, 24, 1, 54, 5, '샹들리에', 'Kronleuchter'], rainbow: ['pp-rainbow', 18, 21, 1, 60, 5, '무지개 구름', 'Regenbogen'],
    cupcake: ['pp-cupcakes', 44, 79, 0, 30, 2, '컵케이크 탑', 'Cupcake-Turm'], teapot: ['pp-teatable', 57, 77, 0, 54, 3, '티 테이블', 'Teetisch'],
    cake: ['pp-cake', 36, 76, 0, 32, 3, '3단 케이크', 'Torte'], books: ['pp-bookshelf', 68, 62, 0, 52, 3, '하트 책장', 'Herz-Bücherregal'],
    teddy: ['pp-teddy', 26, 93, 0, 32, 3, '곰 인형', 'Teddybär'], unicorn: ['pp-unicorn', 74, 94, 0, 56, 5, '유니콘 흔들 목마', 'Schaukel-Einhorn'],
    sofa: ['pp-sofa', 84, 76, 0, 80, 6, '하트 소파', 'Herzsofa'], bed: ['pp-bed', 16, 76, 0, 96, 6, '캐노피 침대', 'Himmelbett'],
    piano: ['pp-piano', 62, 66, 0, 80, 8, '하얀 피아노', 'Weißer Flügel'], fountain: ['pp-fountain', 50, 68, 0, 66, 8, '하트 분수', 'Herzbrunnen'],
    carousel: ['pp-carousel', 86, 72, 0, 66, 8, '회전목마', 'Karussell'], castle: ['pp-castle', 30, 66, 0, 72, 8, '이모션 왕국 성', 'Gefühle-Schloss'],
  };
  const DECO_GONE = { ribbon: 2, crown: 4, dress: 4, ballet: 3, wand: 2, gem: 3 }; // 뺀 가구: 이미 샀으면 코인 돌려줌
  const css = `
.pr { --pr-s: 1; position: relative; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
.pr-room { position: relative; width: 100%; aspect-ratio: 4 / 3; border-radius: 18px; overflow: hidden; touch-action: pan-y; /* 방 빈 곳을 밀면 창이 스크롤됨 (포켓몬·가구는 touch-action: none 이라 그대로 끌림) */
  background: linear-gradient(#FFF4E0 0 52%, #E8B27A 52% 53.2%, #D9A066 53.2%); box-shadow: inset 0 0 0 3px rgba(0,0,0,.06); }
.pr-room::before { content: ''; position: absolute; inset: 53.2% 0 0; background: repeating-linear-gradient(90deg, transparent 0 11.5%, rgba(120,70,30,.18) 11.5% 12%), repeating-linear-gradient(0deg, transparent 0 24%, rgba(120,70,30,.10) 24% 25%); }
.pr-room::after { content: ''; position: absolute; inset: 0 0 48%; background: radial-gradient(circle at 12px 12px, rgba(255,180,120,.22) 3px, transparent 3.5px) 0 0 / 28px 28px; pointer-events: none; }
.pr-win { position: absolute; left: 38%; top: 9%; width: 24%; height: 30%; border-radius: 10px 10px 4px 4px; border: 5px solid #fff; box-shadow: 0 2px 0 rgba(0,0,0,.08);
  background: linear-gradient(#8ED6FF, #D6F1FF); overflow: hidden; z-index: 1; }
.pr-win::before { content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 4px; margin-left: -2px; background: #fff; }
.pr-win::after { content: ''; position: absolute; left: 0; right: 0; top: 50%; height: 4px; margin-top: -2px; background: #fff; }
.pr-win i { position: absolute; left: 14%; top: 16%; width: 26%; aspect-ratio: 1; border-radius: 50%; background: #FFE066; box-shadow: 0 0 12px #FFE066; }
.pr-win b { position: absolute; right: 8%; top: 52%; width: 40%; height: 18%; border-radius: 20px; background: #fff; opacity: .9; }
.pr.night > .pr-room { background: linear-gradient(#4B4E7A 0 52%, #3A3550 52% 53.2%, #5C4A63 53.2%); }
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
.pr-mon .egw, .pr-evo .egw { position: relative; display: block; transform-origin: 50% 92%; }
.pr-mon.egg > .egw { animation: pr-wob 3.2s ease-in-out infinite; animation-delay: var(--wd, 0s); }
.pr-mon.egg.crack > .egw { animation-duration: 1.4s; }
.egw .ck { position: absolute; left: 16%; top: 36%; width: 68%; pointer-events: none; } .egw .pg-heart ~ .ck { left: 18%; top: 28%; width: 64%; }
.egw .ck.k2 { left: 26%; top: 56%; width: 50%; } .egw .pg-heart ~ .ck.k2 { left: 28%; top: 50%; width: 44%; }
@keyframes pr-wob { 0%, 70%, 100% { transform: rotate(0); } 76% { transform: rotate(-9deg); } 84% { transform: rotate(8deg); } 92% { transform: rotate(-4deg); } }
.pr-mon.jump > img { animation: pr-jump .5s ease-out; }
.pr-mon.flip.jump > img { animation-name: pr-jumpf; }
@keyframes pr-jump { 40% { transform: translateY(-28%) scaleY(1.05); } 70% { transform: translateY(0) scaleY(.9); } }
@keyframes pr-jumpf { 40% { transform: scaleX(-1) translateY(-28%) scaleY(1.05); } 70% { transform: scaleX(-1) translateY(0) scaleY(.9); } }
.pr-mon.evo > img { animation: pr-evo 1.4s ease-in-out; }
@keyframes pr-evo { 0%, 100% { filter: none; } 20%, 60% { filter: brightness(0) invert(1); transform: scale(1.15); } 40%, 80% { filter: none; } }
.pr-mon.egg.hatch > .egw { animation: pr-hatch 1.3s ease-in-out forwards; }
@keyframes pr-hatch { 0% { transform: rotate(0); } 10%, 30%, 50% { transform: rotate(-14deg); } 20%, 40%, 60% { transform: rotate(14deg); } 85% { transform: scale(1.3); filter: brightness(0) invert(1); } 100% { transform: scale(1.4); filter: brightness(0) invert(1); opacity: .6; } }
.pr.smooth .pr-mon img { image-rendering: auto; filter: drop-shadow(0 2px 2px rgba(0,0,0,.12)); }
.pr-body { position: relative; display: block; transform-origin: 50% 100%; pointer-events: none; }
.pr.smooth .pr-mon.flip img { transform: none; }
.pr.smooth .pr-mon.flip > .pr-body { transform: scaleX(-1); }
.pr.smooth .pr-mon.jump > .pr-body { animation: pr-jump .5s ease-out; }
.pr.smooth .pr-mon.flip.jump > .pr-body { animation-name: pr-jumpf; }
.pr.smooth .pr-mon.evo > .pr-body { animation: pr-evo 1.4s ease-in-out; }
.pr.smooth .pr-mon:not(.egg):not(.walk):not(.jump):not(.evo):not(.dance):not(.pet) > .pr-body { animation: pr-idle 2.6s ease-in-out infinite; animation-delay: var(--wd, 0s); }
.pr.smooth.night .pr-mon:not(.egg):not(.walk):not(.jump):not(.evo):not(.dance):not(.pet) > .pr-body { animation-duration: 4.5s; }
/* 💗3 단짝: 몸 둘레에 은은한 반짝 빛, 가끔 춤 */
.pr.smooth .pr-mon.glow img { animation: pr-glow 2.4s ease-in-out infinite; }
@keyframes pr-glow { 0%, 100% { filter: drop-shadow(0 0 3px #fff) drop-shadow(0 0 7px rgba(255,130,200,.55)); } 50% { filter: drop-shadow(0 0 5px #fff) drop-shadow(0 0 14px rgba(255,110,190,.95)); } }
.pr.smooth .pr-mon.dance > .pr-body { animation: pr-dance 1.4s ease-in-out; }
@keyframes pr-dance { 0%, 100% { translate: 0 0; rotate: 0deg; scale: 1 1; } 15% { translate: 0 -14%; rotate: -14deg; } 30% { translate: 0 0; rotate: 0deg; scale: 1.06 .94; } 45% { translate: 0 -14%; rotate: 14deg; } 60% { translate: 0 0; rotate: 0deg; scale: 1.06 .94; } 80% { translate: 0 -8%; scale: .96 1.05; } }
@keyframes pr-idle { 0%, 100% { scale: 1 1; rotate: 0deg; } 25% { rotate: -3deg; } 50% { scale: 1.04 .96; } 75% { rotate: 3deg; } }
.pr.smooth .pr-mon.walk:not(.jump):not(.evo):not(.dance) > .pr-body { animation: pr-bob .42s ease-in-out infinite alternate; }
@keyframes pr-bob { from { translate: 0 0; rotate: -3deg; } to { translate: 0 -6%; rotate: 3deg; } }
.pr.princess .pr-room { background: linear-gradient(#FFE6F3 0 52%, #F4A9CB 52% 53.2%, #FAD4E6 53.2%); box-shadow: inset 0 0 0 3px rgba(240,120,170,.25); }
.pr.princess .pr-room::before { background: conic-gradient(#FFF7FB 25%, #F9C9DE 0 50%, #FFF7FB 0 75%, #F9C9DE 0) 0 0 / 12.5% 25%; opacity: .95; }
.pr.princess .pr-room::after { background: repeating-linear-gradient(90deg, rgba(255,255,255,.55) 0 14px, transparent 14px 34px), radial-gradient(circle at 17px 14px, rgba(246,200,107,.8) 2px, transparent 2.6px) 0 0 / 34px 30px; }
.pr.princess .pr-win { border-color: #F6C86B; border-radius: 50% 50% 6px 6px / 40% 40% 6px 6px; background: linear-gradient(#B9C8FF, #FFD9EE); }
.pr.princess .pr-win::before, .pr.princess .pr-win::after { background: #F6C86B; }
.pr-cur { position: absolute; top: 6%; width: 9%; height: 40%; z-index: 2; pointer-events: none; background: repeating-linear-gradient(90deg, #FF8FC0 0 6px, #FFB3D5 6px 12px); box-shadow: 0 2px 0 rgba(0,0,0,.08); }
.pr-cur.l { left: 32%; border-radius: 0 0 90% 30%; } .pr-cur.r { right: 32%; border-radius: 0 0 30% 90%; }
.pr-cur::before { content: ''; position: absolute; left: -12%; right: -12%; top: -6px; height: 10px; border-radius: 6px; background: #F6C86B; }
.pr.princess.night > .pr-room { background: linear-gradient(#5A3E7A 0 52%, #46305E 52% 53.2%, #6A4C82 53.2%); }
.pr.princess.night > .pr-room::before { opacity: .3; }
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
.pr-deco { width: calc(var(--w) * var(--pr-k, 1) * 1px); line-height: 0; }
.pr-deco img { display: block; width: 100%; height: auto; pointer-events: none; -webkit-user-drag: none; }
.pr-deco.rug { transform: translate(-50%, -50%); }
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
.pr-berries button .e { font-size: calc(25px * var(--pr-s)); }
.pr-berries button.zero { opacity: .45; }
.pr-tools { display: grid; grid-template-columns: repeat(var(--n, 4), minmax(0, 1fr)); gap: 6px; margin-top: 10px; }
.pr-tools[hidden] { display: none; }
.pr-tools button { border: 0; border-radius: 14px; padding: calc(6px * var(--pr-s)) 2px; font: inherit; font-weight: 800; font-size: calc(13px * var(--pr-s)); background: #E6F3FF; color: #2A5A8A; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 4px; white-space: nowrap; }
.pr-tools button .e { font-size: calc(26px * var(--pr-s)); }
.pr-tools button.pill { background: #FFE3EE; color: #B4285E; animation: pr-wob 2.4s ease-in-out infinite; }
.pr-tools button small { display: inline-flex; align-items: center; gap: 1px; font-size: .82em; opacity: .85; }
.pr-tools button[aria-pressed="true"] { background: #3D8BFF; color: #fff; box-shadow: 0 0 0 3px #BFD8FF; }
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
.pr-grid button .dk { width: calc(var(--iw) * var(--pr-s) * 1px); max-width: 92%; height: calc(46px * var(--pr-s)); margin: 4px 0 2px; display: flex; align-items: flex-end; justify-content: center; }
.pr-grid button .dk img { max-width: 100%; max-height: 100%; }
.pr-bar button[hidden] { display: none; }
/* 🍚 💩 🤚 🌙 돌보기 */
.pr-mon .need { position: absolute; left: 50%; bottom: 100%; margin-bottom: 4px; transform: translateX(-50%); background: #fff; border-radius: 999px; padding: .15em .35em; line-height: 1.1;
  font-size: calc(15px * var(--pr-s)); box-shadow: 0 2px 6px rgba(0,0,0,.18); pointer-events: none; animation: pr-need 1.6s ease-in-out infinite; z-index: 2; }
@keyframes pr-need { 0%, 100% { translate: 0 0; } 50% { translate: 0 -4px; } }
.pr-mon.pet > img, .pr.smooth .pr-mon.pet > .pr-body { animation: pr-pet .35s ease-in-out infinite alternate; }
@keyframes pr-pet { from { scale: 1 1; } to { scale: 1.07 .93; } }
.pr-hand { position: absolute; z-index: 997; pointer-events: none; font-size: calc(28px * var(--pr-s)); transform: translate(-50%, -50%); animation: pr-rub .3s ease-in-out infinite alternate; }
@keyframes pr-rub { from { rotate: -18deg; translate: -6px 0; } to { rotate: 18deg; translate: 6px 0; } }
.pr-poo { position: absolute; transform: translate(-50%, -100%); border: 0; background: none; padding: 0; margin: 0; line-height: 1; cursor: pointer; font-size: calc(26px * var(--pr-s));
  filter: drop-shadow(0 2px 0 rgba(0,0,0,.15)); -webkit-tap-highlight-color: transparent; animation: pr-plop .5s cubic-bezier(.2, 1.6, .4, 1); }
.pr-poo::before { content: '〰'; position: absolute; left: 50%; top: -60%; translate: -50% 0; font-size: .55em; color: #8BAA5A; animation: pr-stink 1.8s ease-in-out infinite; }
@keyframes pr-stink { 0%, 100% { translate: -50% 0; opacity: .3; } 50% { translate: -50% -5px; opacity: .9; } }
@keyframes pr-plop { from { scale: .2; } to { scale: 1; } }
.pr-poo.gone { animation: pr-gone .5s ease-in forwards; pointer-events: none; }
@keyframes pr-gone { to { scale: 0; rotate: 90deg; opacity: 0; } }
.pr-dim { position: absolute; inset: 0; z-index: 900; pointer-events: none; background: radial-gradient(circle at 50% 24%, rgba(40,40,90,.25), rgba(8,8,30,.62)); }
.pr-mon .foam { position: absolute; pointer-events: none; font-size: calc(15px * var(--pr-s)); animation: pr-foam .9s ease-in-out infinite alternate; z-index: 3; }
@keyframes pr-foam { from { scale: .8; } to { scale: 1.15; } }
.pr-shower { position: absolute; z-index: 996; pointer-events: none; transform: translate(-50%, -100%); font-size: calc(30px * var(--pr-s)); animation: pr-shower 1s ease-in-out; }
@keyframes pr-shower { 0% { opacity: 0; translate: 0 -10px; } 20%, 80% { opacity: 1; translate: 0 0; } 100% { opacity: 0; } }
.pr-ball { position: absolute; pointer-events: none; transform: translate(-50%, -100%); font-size: calc(22px * var(--pr-s)); line-height: 1;
  transition: left .65s cubic-bezier(.2, .8, .3, 1), top .65s cubic-bezier(.2, .8, .3, 1), rotate .65s, opacity .5s; animation: pr-plop .4s cubic-bezier(.2, 1.6, .4, 1); }
.pr-mon.sick img { filter: saturate(.45) brightness(.97); }
.pr.smooth .pr-mon.sick img { animation: none; }
.pr-mon.dirty img { filter: sepia(.4) brightness(.93); }
.pr-mon.dirty::before { content: '〰'; position: absolute; left: 50%; top: 20%; translate: -50% 0; color: #8BAA5A; font-size: calc(12px * var(--pr-s)); pointer-events: none; animation: pr-stink 1.8s ease-in-out infinite; z-index: 2; }
.pr-cake { position: absolute; z-index: 996; pointer-events: none; transform: translate(-50%, -100%); font-size: calc(30px * var(--pr-s)); animation: pr-plop .5s cubic-bezier(.2, 1.6, .4, 1); }
.pi { width: 1em; height: 1em; display: inline-block; vertical-align: -.16em; overflow: visible; }
.pi-w { display: inline-flex; vertical-align: middle; }
.pr-heart .pi, .pr-poo .pi, .pr-shower .pi, .pr-ball .pi, .pr-hand .pi, .pr-cake .pi, .pr-mon .foam .pi, .pr-mon .zz .pi { display: block; }
.pr-mon .need { padding: .2em .3em; } .pr-mon .need .pi { width: 1.3em; height: 1.3em; display: block; }
.pr-mon .need.wish::before, .pr-mon .need.wish::after { content: ''; position: absolute; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.15); }
.pr-mon .need.wish::before { width: 7px; height: 7px; left: 18%; bottom: -6px; } .pr-mon .need.wish::after { width: 4px; height: 4px; left: 8%; bottom: -11px; }
.pr-bar button .pi-w, .pr-bar span .pi-w, .pr-panel .pi-w { margin-right: 2px; }
.pr-mute { position: absolute; right: 2%; top: 3%; z-index: 1002; width: calc(34px * var(--pr-s)); height: calc(34px * var(--pr-s)); padding: 0; border: 0; border-radius: 50%;
  background: rgba(255,255,255,.8); box-shadow: 0 2px 6px rgba(0,0,0,.15); font-size: calc(22px * var(--pr-s)); display: grid; place-items: center; cursor: pointer; }
.pr-mute .pi { display: block; }
.pr-help { position: absolute; left: 2%; top: 3%; z-index: 1002; width: calc(34px * var(--pr-s)); height: calc(34px * var(--pr-s)); padding: 0; border: 0; border-radius: 50%;
  background: rgba(255,255,255,.8); box-shadow: 0 2px 6px rgba(0,0,0,.15); font-size: calc(24px * var(--pr-s)); display: grid; place-items: center; cursor: pointer; }
.pr-help .pi { display: block; }
.pr-hrow { display: flex; gap: 10px; align-items: flex-start; margin: 0 0 10px; font-size: calc(13px * var(--pr-s)); color: #6B3E12; line-height: 1.45; }
.pr-hrow > .pi-w { font-size: calc(28px * var(--pr-s)); flex: none; } .pr-hrow b { display: block; font-size: 1.08em; margin-bottom: 1px; }
.pr-legend { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
.pr-legend span { display: inline-flex; gap: 4px; align-items: center; font-size: calc(12px * var(--pr-s)); background: #fff; border-radius: 99px; padding: 2px 9px 2px 4px; color: #6B3E12; }
.pr-legend .pi-w { font-size: 1.6em; }
.pr-fav { display: flex; flex-direction: column; align-items: center; gap: 2px; background: #fff; border-radius: 12px; padding: 4px 2px; font-size: calc(10.5px * var(--pr-s)); color: #6B3E12; }
.pr-fav img { width: 76%; aspect-ratio: 1; object-fit: contain; } .pr-fav .pi-w { font-size: calc(22px * var(--pr-s)); }
.pr-fav .n { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; }
/* 🃏 상태 카드 */
.pr-card { position: absolute; left: 50%; bottom: 3%; transform: translateX(-50%); z-index: 1003; width: min(94%, calc(340px * var(--pr-s))); display: flex; gap: 10px; align-items: stretch;
  padding: 10px 12px 10px 10px; border-radius: 18px; background: #FFFDF8; border: 3px solid var(--c1); box-shadow: 0 10px 24px rgba(0,0,0,.25), inset 0 0 0 2px #fff;
  font-size: calc(12.5px * var(--pr-s)); color: #5A3A22; animation: pr-card .35s cubic-bezier(.2, 1.5, .4, 1); }
@keyframes pr-card { from { transform: translate(-50%, 25%) scale(.9); opacity: 0; } to { transform: translateX(-50%); opacity: 1; } }
.pr-card .pc-pic { position: relative; flex: none; width: calc(78px * var(--pr-s)); border-radius: 14px; background: radial-gradient(circle at 50% 42%, #fff 0 30%, var(--c2)); display: grid; place-items: center; overflow: hidden; }
.pr-card .pc-pic img { width: 94%; aspect-ratio: 1; object-fit: contain; } .pr-card .pc-pic .pk-egg { width: 58%; }
.pr-card .pc-pic .pc-shiny { position: absolute; right: 3px; top: 3px; font-size: 1.4em; }
.pr-card .pc-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.pr-card .pc-nm { display: flex; align-items: center; gap: 6px; font-size: 1.28em; font-weight: 800; padding-right: 18px; }
.pr-card .pc-tag { flex: none; font-size: .62em; padding: 1px 8px; border-radius: 99px; background: var(--c1); color: #fff; font-weight: 800; }
.pr-card .pc-sub { display: flex; align-items: center; gap: 4px 10px; color: #9A7A5A; flex-wrap: wrap; } .pr-card .pc-sub .pi-w { font-size: 1.35em; }
.pr-card .pc-lb { display: flex; justify-content: space-between; align-items: center; font-weight: 800; } .pr-card .pc-lb .pi-w { font-size: 1.2em; }
.pr-card .pc-bar { position: relative; height: calc(15px * var(--pr-s)); border-radius: 99px; background: #F1E4D2; overflow: hidden; box-shadow: inset 0 1px 2px rgba(0,0,0,.12); }
.pr-card .pc-bar i { position: absolute; inset: 0 auto 0 0; width: var(--p); border-radius: 99px; background: linear-gradient(90deg, #FFA3C6, #FF5F9E); box-shadow: inset 0 -3px 0 rgba(0,0,0,.08), inset 0 3px 0 rgba(255,255,255,.35); transition: width .6s; }
.pr-card .pc-bar b { position: absolute; inset: 0; display: grid; place-items: center; font-size: .78em; color: #fff; text-shadow: 0 1px 1px rgba(0,0,0,.4); }
.pr-card .pc-nx { display: flex; align-items: center; gap: 2px; } .pr-card .pc-nx img { width: calc(28px * var(--pr-s)); height: calc(28px * var(--pr-s)); object-fit: contain; filter: brightness(0); opacity: .28; }
.pr-card .pc-nx img.pc-seen { filter: none; opacity: 1; }
.pr-card .pc-st { display: flex; gap: 4px; flex-wrap: wrap; }
.pr-card .pc-st span { display: inline-flex; align-items: center; gap: 2px; padding: 1px 8px 1px 2px; border-radius: 99px; background: #EAF8F0; color: #2E7D3A; font-size: .86em; font-weight: 700; }
.pr-card .pc-st span.pc-no { background: #FFE8EC; color: #C0392B; } .pr-card .pc-st .pi-w { font-size: 1.35em; }
.pr-card .pc-forms { display: flex; gap: 4px; flex-wrap: wrap; align-items: center; } .pr-card .pc-forms span { margin-right: 2px; }
.pr-card .pc-forms button { border: 0; background: #fff; border-radius: 10px; padding: 2px; box-shadow: 0 0 0 2px #F3E3CC; cursor: pointer; } .pr-card .pc-forms button.on { box-shadow: 0 0 0 3px var(--c1); }
.pr-card .pc-forms img { display: block; width: calc(30px * var(--pr-s)); height: calc(30px * var(--pr-s)); object-fit: contain; }
.pr-card .pc-x { position: absolute; right: 6px; top: 3px; border: 0; background: none; font-size: 1.25em; color: #B07040; cursor: pointer; padding: 2px 4px; }
/* 🖼️ 장소 배경: 방 전체가 그 장소 그림 (창문 · 커튼 · 벽지 무늬는 숨김), 밤엔 어둡게 */
.pr.th-pkcenter > .pr-room { background: url(${BASE}poke/deco/scene-pkcenter.svg) center / 100% 100% no-repeat; }
.pr.th-bakery > .pr-room { background: url(${BASE}poke/deco/scene-bakery.svg) center / 100% 100% no-repeat; }
.pr.th-gym > .pr-room { background: url(${BASE}poke/deco/scene-gym.svg) center / 100% 100% no-repeat; }
.pr.th-beach > .pr-room { background: url(${BASE}poke/deco/scene-beach.svg) center / 100% 100% no-repeat; }
.pr.th-garden > .pr-room { background: url(${BASE}poke/deco/scene-garden.svg) center / 100% 100% no-repeat; }
.pr.night.th-gym > .pr-room { background: linear-gradient(rgba(10,14,46,.45), rgba(10,14,46,.45)), url(${BASE}poke/deco/scene-gym.svg) center / 100% 100% no-repeat; }
.pr.night.th-beach > .pr-room { background: linear-gradient(rgba(10,20,60,.55), rgba(10,20,60,.55)), url(${BASE}poke/deco/scene-beach.svg) center / 100% 100% no-repeat; }
.pr.night.th-garden > .pr-room { background: linear-gradient(rgba(40,14,60,.5), rgba(40,14,60,.5)), url(${BASE}poke/deco/scene-garden.svg) center / 100% 100% no-repeat; }
.pr.night.th-pkcenter > .pr-room { background: linear-gradient(rgba(14,18,56,.5), rgba(14,18,56,.5)), url(${BASE}poke/deco/scene-pkcenter.svg) center / 100% 100% no-repeat; }
.pr.night.th-bakery > .pr-room { background: linear-gradient(rgba(44,12,40,.45), rgba(44,12,40,.45)), url(${BASE}poke/deco/scene-bakery.svg) center / 100% 100% no-repeat; }
.pr[class*=" th-"] > .pr-room::before, .pr[class*=" th-"] > .pr-room::after { display: none; }
.pr[class*=" th-"] > .pr-room > .pr-win, .pr[class*=" th-"] > .pr-room > .pr-cur { display: none; }
.pr-grid button .bgpv { display: block; width: 92%; margin: 3px 0 2px; pointer-events: none; }
.pr-grid button .bgpv .pr-room { display: block; border-radius: 8px; box-shadow: inset 0 0 0 2px rgba(0,0,0,.06); }
/* ✨ 진화 · 변신 장면 (화면 전체) */
.pr-evo { position: fixed; inset: 0; z-index: 2000; display: grid; place-items: center; overflow: hidden; touch-action: none; user-select: none; -webkit-user-select: none;
  background: radial-gradient(circle at 50% 42%, #3B2F78, #0E0A24 72%); animation: pr-evo-in .5s ease-out; transition: opacity .35s; }
.pr-evo.ping { background: radial-gradient(circle at 50% 42%, #8A3A78, #26081F 72%); }
.pr-evo.out { opacity: 0; }
@keyframes pr-evo-in { from { opacity: 0; } }
.pr-evo .ev-rays { position: absolute; left: 50%; top: 42%; width: 200vmax; height: 200vmax; translate: -50% -50%; opacity: 0; transition: opacity .8s;
  background: repeating-conic-gradient(rgba(255,255,255,.13) 0 7deg, transparent 7deg 18deg); animation: pr-spin 16s linear infinite; }
.pr-evo.done .ev-rays { opacity: 1; }
@keyframes pr-spin { to { rotate: 360deg; } }
.pr-evo .ev-stage { position: relative; width: min(60vw, 46vh, 360px); aspect-ratio: 1; margin-bottom: 22vh; }
.pr-evo .ev-stage img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; }
.pr-evo .ev-stage img.ev-b { opacity: 0; }
.pr-evo.white .ev-stage img { filter: brightness(0) invert(1) drop-shadow(0 0 14px #fff) drop-shadow(0 0 36px #8FD3FF); }
.pr-evo.ping.white .ev-stage img { filter: brightness(0) invert(1) drop-shadow(0 0 14px #fff) drop-shadow(0 0 36px #FF9EC7); }
.pr-evo.show-b .ev-stage img.ev-a { opacity: 0; } .pr-evo.show-b .ev-stage img.ev-b { opacity: 1; }
.pr-evo .ev-stage.glow::before { content: ''; position: absolute; inset: -18%; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,.55), transparent 62%); animation: pr-pulse .5s ease-in-out infinite alternate; }
@keyframes pr-pulse { from { scale: .8; opacity: .45; } to { scale: 1.1; opacity: 1; } }
.pr-evo.done .ev-stage img.ev-b { animation: pr-evopop .9s cubic-bezier(.2, 1.6, .4, 1); }
@keyframes pr-evopop { 0% { scale: .5; } 60% { scale: 1.15; } 100% { scale: 1; } }
.pr-evo .ev-flash { position: absolute; inset: 0; background: #fff; opacity: 0; pointer-events: none; }
.pr-evo.flashing .ev-flash { animation: pr-flash 1s ease-out; }
@keyframes pr-flash { 0% { opacity: 0; } 12% { opacity: 1; } 100% { opacity: 0; } }
.pr-evo .ev-txt { position: absolute; left: 50%; bottom: max(6vh, 24px); translate: -50% 0; width: min(92vw, 560px); padding: 14px 18px 16px; border-radius: 18px; background: #fff; color: #3B2716;
  font-size: clamp(18px, 4.8vw, 28px); font-weight: 800; line-height: 1.35; text-align: center; border: 5px solid #FFD23F; box-shadow: 0 0 0 4px #3B2716, 0 12px 34px rgba(0,0,0,.45); }
.pr-evo.ping .ev-txt { border-color: #FF9EC7; }
.pr-evo .ev-txt .pi { width: 1.1em; height: 1.1em; }
.pr-evo .ev-res { display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 8px; }
.pr-evo .ev-res img { width: clamp(52px, 14vw, 84px); height: clamp(52px, 14vw, 84px); object-fit: contain; }
.pr-evo .ev-res span { font-size: 1.5em; color: #FF8A3D; }
.pr-evo .ev-ok { margin-top: 8px; border: 0; border-radius: 14px; padding: 10px 26px; font: inherit; font-size: .8em; font-weight: 800; background: linear-gradient(140deg, #FFE08A, #FFB46B); color: #3B2716; cursor: pointer; animation: pr-wob 1.6s infinite; }
.pr-evo .ev-sp { position: absolute; left: 50%; top: 40%; width: clamp(18px, 5vw, 34px); height: clamp(18px, 5vw, 34px); pointer-events: none; animation: pr-sp 1.7s ease-out forwards; }
.pr-evo .ev-sp .pi { width: 100%; height: 100%; display: block; }
@keyframes pr-sp { 0% { translate: -50% -50%; scale: .2; opacity: 1; } 100% { translate: calc(-50% + var(--dx)) calc(-50% + var(--dy)); scale: 1.2; rotate: var(--r); opacity: 0; } }
/* 🐣 알에서 태어나는 장면 (진화 장면과 같은 무대) */
.pr-evo .ev-stage .ev-egg { position: absolute; inset: 6%; display: grid; place-items: center; transform-origin: 50% 90%; transition: opacity .25s, scale .25s; }
.pr-evo .ev-stage .ev-egg .egw { width: 88%; } .pr-evo .ev-stage .ev-egg .pk-egg, .pr-evo .ev-stage .ev-egg img { position: static; display: block; width: 100%; height: auto; }
.pr-evo .ev-egg .ck { opacity: 0; transition: opacity .15s; } .pr-evo .ev-egg.c1 .ck:not(.k2), .pr-evo .ev-egg.c2 .ck.k2 { opacity: 1; }
.pr-evo .ev-egg.w1 { animation: pr-wob 1.8s ease-in-out infinite; } .pr-evo .ev-egg.w2 { animation: pr-wob .7s ease-in-out infinite; } .pr-evo .ev-egg.w3 { animation: pr-shake .16s linear infinite; }
@keyframes pr-shake { 0%, 100% { rotate: -7deg; } 50% { rotate: 7deg; } }
.pr-evo.white .ev-egg { filter: brightness(0) invert(1) drop-shadow(0 0 14px #fff) drop-shadow(0 0 36px #FFE27A); }
.pr-evo.hatched .ev-egg { opacity: 0; scale: 1.6; }
.pr-evo .ev-nm { font-size: .9em; }
/* 🛁 목욕 욕조 */
.pr-tub { position: absolute; transform: translate(-50%, -100%); pointer-events: none; animation: pr-tubin .5s cubic-bezier(.2, 1.6, .4, 1); }
.pr-tub svg { display: block; width: 100%; height: auto; }
.pr-tub.out { animation: pr-tubout .5s ease-in forwards; }
@keyframes pr-tubin { from { scale: .3; opacity: 0; } }
@keyframes pr-tubout { to { scale: .6; opacity: 0; translate: 0 10%; } }
.pr-tub .tb-water { stroke-dasharray: 6 5; animation: pr-pour .3s linear infinite, pr-streamoff 1.9s forwards; }
@keyframes pr-pour { to { stroke-dashoffset: -11; } }
@keyframes pr-streamoff { 0%, 80% { opacity: 1; } 100% { opacity: 0; } }
.pr-tub .tb-bub { transform-box: fill-box; transform-origin: center; animation: pr-tbub 1s ease-in-out infinite alternate; }
@keyframes pr-tbub { from { scale: .55; } to { scale: 1.12; } }
.pr-mon.inbath { animation: pr-bathwob 1s ease-in-out infinite; transform-origin: 50% 100%; }
@keyframes pr-bathwob { 0%, 100% { rotate: -4deg; } 50% { rotate: 4deg; } }
.pr-hand.ghost { opacity: 0; animation: pr-rub .32s ease-in-out infinite alternate, pr-ghost 2.4s ease-in-out forwards; }
@keyframes pr-ghost { 0% { opacity: 0; } 15%, 80% { opacity: .9; } 100% { opacity: 0; } }
.pr-poo { padding: .28em; }
.pr-grid button .new { position: absolute; left: 3px; top: 3px; padding: 0 4px; border-radius: 6px; background: #FF5FA2; color: #fff; font-size: calc(9px * var(--pr-s)); font-weight: 800; line-height: 1.5; }
.pr-bub .st { margin-left: .4em; } .pr-bub .st i { font-style: normal; } .pr-bub .st i.off { opacity: .25; filter: grayscale(1); }
`;
  // 알에 간 금: 알 그림과 한 덩어리(.egw)로 같이 흔들림. k2 = 장면에서 두 번째 금
  const CRACK = '<svg class="ck" viewBox="0 0 60 30" aria-hidden="true"><path d="M3 15l7-6 6 9 8-10 7 10 8-8 7 9 6-6 5 4" stroke="#4A2E1A" stroke-width="3.4" fill="none" stroke-linejoin="round" stroke-linecap="round"/>'
    + '<path d="M24 9l2-6M38 19l3 7" stroke="#4A2E1A" stroke-width="2.4" stroke-linecap="round"/><path d="M3 17l7-6 6 9 8-10 7 10 8-8 7 9 6-6 5 4" stroke="#fff" stroke-width="1.2" fill="none" opacity=".55"/></svg>';
  const CRACK2 = '<svg class="ck k2" viewBox="0 0 60 30" aria-hidden="true"><path d="M4 12l9 6 8-8 9 9 9-7 9 8 8-5" stroke="#4A2E1A" stroke-width="3.4" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="M30 19l-2 8" stroke="#4A2E1A" stroke-width="2.4" stroke-linecap="round"/></svg>';
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
  const icon = (k) => { const s = el('span', { class: 'pi-w' }); if (ICON[k]) s.innerHTML = ICON[k]; else s.textContent = k; return s; };
  // 글 속 이모지 → 그린 아이콘 (알림 · 말풍선 · 안내 줄, 미션판 선물 상자 글도 PokeRoom.rich 로)
  const EMO = { '🍚': 'rice', '🧼': 'soap', '⚽': 'ball', '💊': 'pill', '🤚': 'hand', '👋': 'hand', '🛁': 'bath', '🤒': 'sick', '🤧': 'sick', '💩': 'poop', '✨': 'sparkle', '🌟': 'star',
    '💖': 'heart', '💕': 'heart', '💗': 'heart', '🪙': 'coin', '🎂': 'cake', '🎉': 'party', '🫧': 'bubbles', '🚿': 'shower', '💧': 'drop', '💤': 'zz', '🌙': 'moon', '💡': 'bulb',
    '🛒': 'shop', '📖': 'book', '☀️': 'sun', '☀': 'sun', '🍓': 'strawberry', '🍎': 'apple', '🫐': 'blueberry', '🍌': 'banana', '🌶️': 'pepper', '🌶': 'pepper' };
  const EMO_RE = new RegExp(`(${Object.keys(EMO).sort((a, b) => b.length - a.length).join('|')})`, 'u');
  function rich(t) { addCss(); return String(t == null ? '' : t).split(EMO_RE).filter(Boolean).map((p) => (EMO[p] ? icon(EMO[p]) : p)); }
  // 행동마다 다른 소리 (냠냠 · 뽀글 · 뿅 · 뻥 · 에취 …)
  let ax = null;
  function beep(notes) {
    try {
      ax = ax || new (window.AudioContext || window.webkitAudioContext)();
      if (ax.state === 'suspended') ax.resume();
      const t0 = ax.currentTime;
      for (const [f, t, d, type, f2] of notes) {
        const os = ax.createOscillator(), g = ax.createGain();
        os.type = type || 'sine'; os.frequency.setValueAtTime(f, t0 + t);
        if (f2) os.frequency.exponentialRampToValueAtTime(f2, t0 + t + d);
        g.gain.setValueAtTime(0.0001, t0 + t); g.gain.exponentialRampToValueAtTime(0.18, t0 + t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t0 + t + d);
        os.connect(g).connect(ax.destination); os.start(t0 + t); os.stop(t0 + t + d + 0.03);
      }
    } catch {}
  }
  const SFX = {
    yum: [[620, 0, 0.08, 'triangle', 760], [620, 0.12, 0.08, 'triangle', 820], [700, 0.24, 0.14, 'triangle', 980]],
    bubble: [[500, 0, 0.07, 'sine', 900], [700, 0.07, 0.07, 'sine', 1200], [900, 0.14, 0.09, 'sine', 1500]],
    shower: [[1800, 0, 0.05], [1500, 0.06, 0.05], [2000, 0.12, 0.05], [1600, 0.18, 0.05], [2100, 0.24, 0.08]],
    pop: [[400, 0, 0.09, 'square', 1400]], kick: [[180, 0, 0.14, 'triangle', 70]],
    achoo: [[900, 0, 0.1, 'sawtooth', 600], [700, 0.14, 0.28, 'sawtooth', 160]], pill: [[784, 0, 0.1], [988, 0.1, 0.1], [1319, 0.2, 0.26]], pet: [[440, 0, 0.14, 'sine', 520]],
  };
  // 🔊 포켓몬 울음소리: 한 번 받으면 기억 (오디오는 탭할 때 깨워 둔 같은 소리 상자로)
  // 🛁 목욕 욕조: 수도꼭지에서 물이 쪼르륵 → 거품 → 쏙 빠짐 (앞면이 친구 아랫부분을 가려서 욕조 안에 앉은 것처럼)
  const TUB = `<svg viewBox="0 0 120 92" aria-hidden="true" overflow="visible">
<g class="tb-stream"><path d="M4 4h22v9h-5" fill="none" stroke="#C9962E" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 4h22v9h-5" fill="none" stroke="#F6CF6A" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
<path class="tb-water" d="M21 16q1 14 6 26" stroke="#8FD3F4" stroke-width="5" fill="none" stroke-linecap="round"/></g>
<ellipse cx="60" cy="44" rx="53" ry="8" fill="#8FD3F4" opacity=".9"/><ellipse cx="60" cy="43" rx="44" ry="4" fill="#fff" opacity=".35"/>
<rect x="2" y="38" width="116" height="10" rx="5" fill="#fff" stroke="#6B3E26" stroke-width="2.6"/>
<path d="M6 46H114V60C114 75 101 82 86 82H34C19 82 6 75 6 60Z" fill="#fff" stroke="#6B3E26" stroke-width="2.6" stroke-linejoin="round"/>
<path d="M12 60H108" stroke="#FF9EC7" stroke-width="4" stroke-linecap="round"/><path d="M60 72c-6-4-8-8-5-10 2-1 4 0 5 2 1-2 3-3 5-2 3 2 1 6-5 10z" fill="#FF8FB8"/>
<circle cx="26" cy="85" r="4.5" fill="#F6CF6A" stroke="#6B3E26" stroke-width="1.8"/><circle cx="94" cy="85" r="4.5" fill="#F6CF6A" stroke="#6B3E26" stroke-width="1.8"/>
${[[14, 38, 7], [28, 32, 9], [44, 36, 6], [72, 34, 8], [88, 31, 10], [104, 37, 7], [58, 30, 6]].map(([x, y, r], i) => `<circle class="tb-bub" style="animation-delay:${(i * 0.13).toFixed(2)}s" cx="${x}" cy="${y}" r="${r}" fill="#F3FAFF" stroke="#8EC9EA" stroke-width="1.6"/><circle cx="${x - r * .35}" cy="${y - r * .35}" r="${r * .28}" fill="#fff"/>`).join('')}
</svg>`;
  // 물 쪼르륵: 물줄기 소리(점점 높아짐) + 퐁퐁 거품
  function pourSound() {
    try {
      ax = ax || new (window.AudioContext || window.webkitAudioContext)();
      if (ax.state === 'suspended') ax.resume();
      const t0 = ax.currentTime, len = 1.5, sr = ax.sampleRate, buf = ax.createBuffer(1, Math.floor(sr * len), sr), d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (0.55 + 0.45 * Math.sin((i / sr) * 2 * Math.PI * 23));
      const src = ax.createBufferSource(), bp = ax.createBiquadFilter(), g = ax.createGain();
      src.buffer = buf; bp.type = 'bandpass'; bp.Q.value = 4; bp.frequency.setValueAtTime(450, t0); bp.frequency.linearRampToValueAtTime(1300, t0 + len);
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.32, t0 + 0.06); g.gain.setValueAtTime(0.32, t0 + len - 0.35); g.gain.exponentialRampToValueAtTime(0.0001, t0 + len);
      src.connect(bp).connect(g).connect(ax.destination); src.start(t0); src.stop(t0 + len);
      for (let i = 0; i < 8; i++) {
        const tt = t0 + 0.25 + Math.random() * 1.4, f = 420 + Math.random() * 600, os = ax.createOscillator(), og = ax.createGain();
        os.type = 'sine'; os.frequency.setValueAtTime(f, tt); os.frequency.exponentialRampToValueAtTime(f * 1.9, tt + 0.07);
        og.gain.setValueAtTime(0.0001, tt); og.gain.exponentialRampToValueAtTime(0.12, tt + 0.01); og.gain.exponentialRampToValueAtTime(0.0001, tt + 0.09);
        os.connect(og).connect(ax.destination); os.start(tt); os.stop(tt + 0.1);
      }
    } catch {}
  }
  const PRELOADED = new Set(); // 미리 받은 그림 묶음 (방을 다시 열어도 또 받지 않게)
  const cryBuf = new Map(); // 최근 24마리 울음소리만 기억 (메모리 아끼기)
  function playCry(id) {
    try {
      ax = ax || new (window.AudioContext || window.webkitAudioContext)();
      if (ax.state === 'suspended') ax.resume();
      const go = (b) => { const src = ax.createBufferSource(), g = ax.createGain(); g.gain.value = 0.5; src.buffer = b; src.connect(g).connect(ax.destination); src.start(); };
      if (cryBuf.has(id)) return go(cryBuf.get(id));
      fetch(`${BASE}poke/cry/${id}.m4a`).then((r) => (r.ok ? r.arrayBuffer() : null)).then((ab) => { if (ab) ax.decodeAudioData(ab, (b) => { cryBuf.set(id, b); if (cryBuf.size > 24) cryBuf.delete(cryBuf.keys().next().value); go(b); }, () => {}); }).catch(() => {});
    } catch {}
  }
  // 💖 티니핑: 친구마다 음높이가 다른 '핑♪' + 기기 목소리로 이름 (높은 목소리)
  const pingTone = (id) => { const f = [523, 587, 659, 784, 880, 988][Math.floor(hash(String(id)) * 6)]; beep([[f, 0, 0.09, 'triangle'], [f * 1.5, 0.08, 0.09, 'triangle'], [f * 2, 0.16, 0.24, 'sine', f * 2.25]]); };
  function sayName(text, lang) {
    try {
      const sp = window.speechSynthesis;
      if (!sp) return;
      const want = lang === 'de' ? 'de' : 'ko', v = sp.getVoices().find((x) => (x.lang || '').toLowerCase().startsWith(want));
      if (!v) return; // 그 말 목소리가 없는 기기면 '핑♪' 만
      sp.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.voice = v; u.lang = v.lang; u.pitch = 1.9; u.rate = 1.1; u.volume = 0.9;
      sp.speak(u);
    } catch {}
  }
  try { if (window.speechSynthesis) window.speechSynthesis.getVoices(); } catch {} // 목소리 목록 미리 불러 두기
  const isNight = () => { const h = new Date().getHours(); return h >= 20 || h < 7; };
  const pad = (n) => String(n).padStart(2, '0');
  const dayKey = (t) => { const x = new Date(t); return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`; };
  const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
    h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16; return (h >>> 0) / 4294967296; }; // 비슷한 글자도 고르게 흩어지게
  // 🍚 밥 때: 아침 7–12 · 점심 12–17 · 저녁 17–20 (밤엔 잠)
  function slotOf(t) { const d = new Date(t), h = d.getHours(); if (h < 7 || h >= 20) return null; const i = h < 12 ? 0 : h < 17 ? 1 : 2; d.setHours([7, 12, 17][i], 0, 0, 0); return { key: `${dayKey(t)}-${i}`, start: +d }; }
  const nightKey = () => dayKey(Date.now() - 7 * 3600e3); // 밤 20시~아침 7시 = 그 저녁 날짜
  const CARE_START = new Date(2026, 10, 17).getTime(); // 목욕은 이날부터 셈 (전부 한꺼번에 꼬질꼬질해지지 않게)
  const MILE = [[7, 1], [30, 3], [100, 5], [365, 10]]; // 🎂 [태어난 지 며칠, 🪙 선물]
  const TOOLS = ['rice', 'soap', 'ball', 'pill'];
  // 🖼️ 장소 배경 (가게에서 사서 바꿈 — 방이 그 장소로 바뀜, 그림 poke/deco/scene-*.svg): [값(코인), 이름, 독일어]. 그림은 CSS .pr.th-{이름} (낮 · 밤). room.bgs.{이름} = 1 (산 것), room.bg = 쓰는 것 (없으면 기본)
  const BGS = {
    pk: { base: [0, '내 방', 'Mein Zimmer'], pkcenter: [12, '포켓몬 센터 앞', 'Vor dem Pokémon-Center'], gym: [12, '포켓몬 체육관', 'Pokémon-Arena'], beach: [12, '바닷가', 'Strand'] },
    pp: { base: [0, '공주방', 'Prinzessinnenzimmer'], bakery: [12, '하트로즈 베이커리', 'Herzrosen-Bäckerei'], garden: [12, '이모션 왕국 성 정원', 'Schlossgarten'] },
  };
  // 🪑 장소마다 어울리는 가구 (그 장소에서만 보이고 · 가게에도 그 장소 것만): DECO 와 같은 꼴. 자료 room.pdeco.{장소}.{가구}
  const PDECO = {
    pkcenter: { c_heal: ['pk-heal', 22, 74, 0, 58, 8, '회복 머신', 'Heilmaschine'], c_vend: ['pc-vending', 88, 74, 0, 40, 6, '자판기', 'Getränkeautomat'], c_bench: ['pc-bench', 68, 90, 0, 52, 4, '벤치', 'Bank'],
      c_potion: ['pc-potions', 10, 94, 0, 44, 5, '상처약 진열대', 'Trank-Regal'], c_pball: ['pk-ballstand', 40, 96, 0, 42, 2, '몬스터볼 받침대', 'Ball-Regal'], c_plant: ['pk-plant', 94, 94, 0, 32, 3, '화분', 'Topfpflanze'] },
    gym: { g_board: ['gy-board', 84, 64, 0, 48, 6, '점수판', 'Anzeigetafel'], g_badges: ['pk-badges', 18, 41, 1, 40, 4, '배지 액자', 'Orden-Rahmen'], g_trophy: ['gy-trophy', 88, 74, 0, 30, 5, '트로피', 'Pokal'],
      g_podium: ['gy-podium', 24, 76, 0, 72, 6, '시상대', 'Siegertreppchen'], g_flag: ['gy-flag', 94, 96, 0, 26, 3, '응원 깃발', 'Fahne'], g_bag: ['gy-sandbag', 6, 96, 0, 32, 4, '샌드백', 'Sandsack'] },
    beach: { b_umbrella: ['bc-umbrella', 20, 82, 0, 62, 6, '파라솔', 'Sonnenschirm'], b_chair: ['bc-chair', 24, 94, 0, 48, 5, '비치 의자', 'Liegestuhl'], b_castle: ['bc-sandcastle', 70, 90, 0, 44, 4, '모래성', 'Sandburg'],
      b_float: ['bc-float', 50, 72, 0, 40, 3, '몬스터볼 튜브', 'Pokéball-Ring'], b_surf: ['bc-surf', 93, 82, 0, 22, 4, '서핑보드', 'Surfbrett'], b_shell: ['bc-shells', 84, 97, 0, 30, 2, '조개 · 불가사리', 'Muscheln'] },
    bakery: { k_oven: ['bk-oven', 8, 72, 0, 46, 6, '오븐', 'Ofen'], k_table: ['pp-teatable', 52, 86, 0, 54, 4, '티 테이블', 'Teetisch'], k_chair: ['bk-chair', 34, 88, 0, 28, 3, '카페 의자', 'Café-Stuhl'],
      k_cakes: ['pp-cupcakes', 92, 76, 0, 30, 3, '컵케이크 탑', 'Cupcake-Turm'], k_cake: ['pp-cake', 72, 94, 0, 32, 3, '3단 케이크', 'Torte'], k_basket: ['bk-breadbasket', 14, 96, 0, 36, 2, '빵 바구니', 'Brotkorb'] },
    garden: { r_arch: ['gd-rosearch', 50, 74, 0, 70, 7, '장미 아치', 'Rosenbogen'], r_fountain: ['pp-fountain', 50, 96, 0, 64, 8, '하트 분수', 'Herzbrunnen'], r_bench: ['gd-bench', 18, 88, 0, 56, 5, '정원 벤치', 'Gartenbank'],
      r_swing: ['gd-swing', 84, 82, 0, 50, 6, '꽃 그네', 'Blumenschaukel'], r_topiary: ['pp-topiary', 6, 76, 0, 30, 2, '하트 나무', 'Herzbäumchen'], r_lamp: ['gd-lamp', 96, 76, 0, 18, 3, '정원 등', 'Gartenlaterne'] },
  };
  // ❓ 도움말 (방 왼쪽 위): [아이콘, 제목, 설명] — 글 속 이모지는 rich() 로 그림이 됨. P = 티니핑 방
  const HELP = {
    ko: (P) => [
      ['star', '매일 미션', '🎯 오늘의 미션을 다 하면 🎁 선물 상자에서 열매 1개 + 🪙 코인 1개를 받아요.'],
      ['strawberry', '열매 주기', `아래 열매를 고르고 친구를 눌러요. ${P ? '하트 알' : '알'}은 열매 5개를 먹으면 깨어나요. 친구는 하트 1개, 좋아하는 열매면 하트 2개! 좋아하지 않는 열매는 하루에 한 개만 먹어요.`],
      ['heart', '하트가 모이면', P ? '💗 하트 5개마다 더 친해져요. 💗3이면 단짝이 돼서 반짝반짝 춤을 춰요. 변신하는 티니핑은 하트 10개에 변신해요.' : '진화해요! 첫 진화는 하트 10개, 다음 진화는 하트 15개.'],
      ['rice', '밥', '아침 · 점심 · 저녁마다 배고픈 친구 머리 위에 🍚 가 떠요. 🍚 밥을 누르고 그 친구를 눌러요.'],
      ['hand', '쓰다듬기', '친구를 꾹 누른 채 손가락으로 문질러요. 🤚 가 뜬 친구가 기다려요.'],
      ['soap', '목욕', '🛁 가 뜨면 🧼 목욕을 누르고 친구를 톡톡톡 세 번! 욕조에 쏙 들어가서 물이 쪼르륵 — 깨끗해져요.'],
      ['poop', '똥 치우기', '하루 두 번 💩 가 생겨요. 톡 누르면 치워져요.'],
      ['heart', '열매 보너스', '오늘 밥 · 쓰다듬기 · 목욕을 받은 친구가 미션 열매를 먹으면 하트 +1 (하루 한 번).'],
      ['ball', '소원', '하루에 한 친구가 💭 소원을 말해요 (⚽ 공놀이 또는 좋아하는 열매). 들어주면 하트 +1! 공놀이는 ⚽ 를 누르고 바닥을 눌러요.'],
      ...(P ? [['heart', '로미와 친구들', '👑 로미 · 마야 · 메리루 · 사라 · 이안 · 준 · 카일은 가게에서 데려와요. 로미는 하트 10개마다 새 프린세스 모습으로 변신하고, 로미를 누르면 나오는 카드에서 모습을 골라요.']] : []),
      ['sick', '감기', '오래 못 오거나 목욕을 너무 오래 안 하면 가끔 걸려요. 그때만 💊 약 버튼이 나와요 (🪙 1개). 이틀 지나면 저절로 나아요.'],
      ['moon', '밤', '밤 8시 ~ 아침 7시는 자는 시간. 🌙 불 끄기를 누르면 침대에서 쿨쿨 자요.'],
      ['coin', '코인', `미션마다 🪙 1개, 황금 스티커마다 🪙 3개, 🎂 태어난 지 7 · 30 · 100 · 365일에도 받아요. 🛒 가게에서 새 ${P ? '하트 알' : '알'} (🪙 10), 가구, 🖼️ 장소(${P ? '하트로즈 베이커리 · 이모션 왕국 성 정원' : '포켓몬 센터 앞 · 체육관 · 바닷가'})를 사요. 장소마다 어울리는 가구가 따로 있어요.`],
      ['star', P ? '황금 하트' : '황금 알', P ? '황금 스티커 4개마다 👑 황금 하트가 와요. 특별한 티니핑이 들어 있대요!' : '황금 스티커 4개마다 🌟 황금 알이 와요. 전설의 포켓몬이 들어 있대요!'],
      ['sound', '소리', '방 오른쪽 위 버튼으로 소리를 끄고 켜요. 친구를 누르면 상태 카드가 나와요.'],
    ],
    de: (P) => [
      ['star', 'Tagesmission', '🎯 Alle Missionen geschafft → im 🎁 Geschenk gibt es 1 Beere + 🪙 1 Münze.'],
      ['strawberry', 'Beeren geben', `Beere unten wählen, dann einen Freund antippen. ${P ? 'Herz-Eier' : 'Eier'} schlüpfen nach 5 Beeren. Sonst 1 Herz, Lieblingsbeere 2 Herzen! Andere Beeren nur eine pro Tag.`],
      ['heart', 'Viele Herzen', P ? '💗 Alle 5 Herzen werdet ihr engere Freunde. Ab 💗3 beste Freunde: Glitzer und Tanz. Verwandelnde Teenieping verwandeln sich bei 10 Herzen.' : 'Entwicklung! Die erste bei 10 Herzen, die nächste bei 15.'],
      ['rice', 'Futter', 'Morgens, mittags und abends zeigt ein hungriger Freund 🍚. 🍚 Futter wählen und ihn antippen.'],
      ['hand', 'Streicheln', 'Gedrückt halten und mit dem Finger reiben. Wer 🤚 zeigt, wartet darauf.'],
      ['soap', 'Baden', 'Bei 🛁: 🧼 Baden wählen und 3× antippen. Ab in die Wanne, Wasser plätschert – sauber!'],
      ['poop', 'Aufräumen', 'Zweimal am Tag gibt es 💩. Antippen = weg.'],
      ['heart', 'Pflege-Bonus', 'Wer heute Futter, Streicheln oder Baden bekam, kriegt bei der Missions-Beere +1 Herz (1× am Tag).'],
      ['ball', 'Wunsch', 'Jeden Tag hat ein Freund einen 💭 Wunsch (⚽ Ball oder Lieblingsbeere). Erfüllen = +1 Herz! Für den Ball ⚽ wählen und auf den Boden tippen.'],
      ...(P ? [['heart', 'Romi & Freunde', '👑 Romi, Maya, Merilu, Sara, Ian, Jun und Kyle holst du im Laden. Romi verwandelt sich alle 10 Herzen in eine neue Prinzessin – im Steckbrief kannst du das Aussehen wählen.']] : []),
      ['sick', 'Erkältung', 'Wenn lange keiner kommt oder lange nicht gebadet wird. Nur dann gibt es den 💊-Knopf (🪙 1). Nach 2 Tagen auch von selbst gesund.'],
      ['moon', 'Nacht', '20–7 Uhr ist Schlafenszeit. 🌙 Licht aus → alle schlafen im Bett.'],
      ['coin', 'Münzen', `Pro Mission 🪙 1, pro Goldsticker 🪙 3, und zum 🎂 7./30./100./365. Tag. Im 🛒 Laden: neue ${P ? 'Herz-Eier' : 'Eier'} (🪙 10), Möbel und 🖼️ Orte – jeder Ort hat eigene Möbel.`],
      ['star', P ? 'Goldherz' : 'Gold-Ei', P ? 'Alle 4 Goldsticker kommt ein 👑 Goldherz mit einem besonderen Teenieping!' : 'Alle 4 Goldsticker kommt ein 🌟 Gold-Ei mit einem legendären Pokémon!'],
      ['sound', 'Ton', 'Oben rechts im Zimmer Ton an/aus. Freund antippen = Steckbrief.'],
    ],
  };
  const LEGEND = { ko: [['rice', '배고파요'], ['hand', '쓰다듬어 줘요'], ['bath', '씻고 싶어요'], ['sick', '아파요'], ['ball', '소원'], ['yawn', '졸려요 (불 꺼 줘요)'], ['zz', '자요']],
    de: [['rice', 'Hunger'], ['hand', 'Streicheln'], ['bath', 'Baden'], ['sick', 'Krank'], ['ball', 'Wunsch'], ['yawn', 'Müde (Licht aus)'], ['zz', 'Schläft']] };
  // 🃏 상태 카드: 포켓몬은 타입 색, 티니핑은 분홍
  const TYPE_COL = { fire: ['#FF8A3D', '#FFD9B8'], water: ['#3DA5FF', '#C8E8FF'], grass: ['#4CBF5A', '#CFF2C9'], electric: ['#F5B700', '#FFF2BF'], bug: ['#8DB32A', '#E6F2C2'],
    poison: ['#A85FD6', '#EBD7F7'], normal: ['#B09A78', '#EFE8DA'], fighting: ['#D8553A', '#F6D2C8'], psychic: ['#FF6B9A', '#FFD6E3'], rock: ['#B39A55', '#EEE5C8'], ground: ['#D39A4F', '#F5E5C6'],
    ghost: ['#7B6BC4', '#E1DCF5'], ice: ['#4FC3D6', '#D5F5F8'], dragon: ['#6F5BE6', '#DCD6FB'], fairy: ['#FF8FC0', '#FFE1EE'], flying: ['#7F98F0', '#E0E7FF'], steel: ['#8A949E', '#E6EAEE'], dark: ['#6B5A4A', '#E0D9D2'] };
  const NEW_UNTIL = new Date(2026, 10, 30).getTime(); // 가게 'NEW' 표시 (새로 그린 가구)
  // 친구들이 가구를 써요: [떠오르는 아이콘, x 차이, y 차이 (%, 방 300px 기준 — 방 크기에 맞춰 늘림), 가구 앞에 올라앉기(1)]
  const USE = {
    pk: { sofa: ['heart', 0, -5, 1], rug: ['sparkle', 6, 4, 0], piano: ['star', 0, 2, 0], tent: ['heart', 0, 2, 0], books: ['book', 0, 2, 0], teddy: ['heart', 7, 1, 0],
      ball: ['ball', 0, 2, 0], cake: ['strawberry', 6, 1, 0], slide: ['star', 2, -2, 1],
      c_bench: ['heart', 0, -4, 1], c_vend: ['star', 0, 2, 0], c_heal: ['heart', 0, 2, 0], g_podium: ['star', 0, -9, 1], g_trophy: ['star', 5, 1, 0], g_bag: ['ball', 7, 1, 0], g_flag: ['star', 5, 1, 0],
      b_umbrella: ['sun', 0, 2, 0], b_chair: ['heart', 0, -3, 1], b_castle: ['star', 7, 1, 0], b_float: ['drop', 0, -2, 1], b_surf: ['drop', 6, 1, 0] },
    pp: { sofa: ['heart', 0, -5, 1], rug: ['heart', 6, 4, 0], piano: ['note', -16, 2, 0], fountain: ['drop', 0, 3, 0], carousel: ['sparkle', 0, -3, 1], teapot: ['cake', 8, 1, 0],
      cake: ['cake', 6, 1, 0], cupcake: ['cake', 5, 1, 0], books: ['book', 0, 2, 0], castle: ['star', 0, 2, 0], unicorn: ['heart', 0, -6, 1], mirror: ['sparkle', 0, 2, 0], teddy: ['heart', 6, 1, 0],
      k_oven: ['cake', 7, 2, 0], k_table: ['cake', 8, 1, 0], k_chair: ['heart', 0, -3, 1], k_cakes: ['cake', 5, 1, 0], k_cake: ['cake', 6, 1, 0],
      r_arch: ['heart', 0, 1, 0], r_fountain: ['drop', 0, 3, 0], r_bench: ['heart', 0, -4, 1], r_swing: ['sparkle', 0, -7, 1], r_topiary: ['heart', 5, 1, 0] },
  };
  const BED = { pk: [[-3, -11], [10, -11]], pp: [[-5, -9], [8, -9]] }; // 🌙 불 끄면 침대 위 두 자리

  function mount(root, o) {
    addCss();
    if (root._pr) root._pr.destroy(); // 같은 자리에 방이 이미 있으면 먼저 정리
    const lang = () => (o.lang() === 'de' ? 'de' : 'ko');
    const SET = FS.charSet(o.kid), DK0 = SET.room === 'princess' ? DECO_P : DECO; // 아린 = 💖 티니핑 공주방, 나머지 = 🥚 포켓몬
    let curPlace = 'base', DK = DK0; // 지금 장소의 가구 표 (장소를 바꾸면 renderRoom 에서 바뀜)
    const L = () => (SET.key === 'ping' ? { ...T[lang()], ...TP.ko, ...(lang() === 'de' ? TP.de : {}) } : T[lang()]);
    const name = (id) => SET.name(id, lang());
    const bName = (k) => BERRY[k][lang() === 'de' ? 3 : 2];
    const eggName = (egg) => SET.eggName(egg, lang());
    // 🔇 소리 끄기 (이 기기에 저장, 방 오른쪽 위 버튼)
    let muted = false;
    try { muted = localStorage.getItem('poke-room:mute') === '1'; } catch {}
    const snd = Object.fromEntries(Object.entries({ tap() {}, tada() {}, boing() {}, stick() {}, coin() {}, ...(o.snd || {}) }).map(([k, f]) => [k, (...a) => { if (!muted) f(...a); }]));
    const sfx = (k) => { if (!o.snd || muted) return; if (k === 'pour') pourSound(); else beep(SFX[k]); }; // 소리를 넘긴 앱에서만
    let sayAt = 0;
    function voice(m, big) { // 🔊 포켓몬 울음소리 / 티니핑 '핑♪' + 이름 (이름은 8초에 한 번, 태어날 때 · 친해질 때는 꼭)
      if (muted || !o.snd || !m || !hatched(m)) return;
      if (SET.key !== 'ping') { playCry(m.p); return; }
      pingTone(m.p);
      if (!big && Date.now() - sayAt < 8000) return;
      sayAt = Date.now();
      setTimeout(() => sayName(`${name(m.p).replace(/\s*\d+\s*(기)?$/, '')}!`, lang()), 300);
    }
    const roomEl = el('div', { class: 'pr-room' }, el('div', { class: 'pr-win', 'aria-hidden': 'true' }, el('i'), el('b')));
    const toolRow = el('div', { class: 'pr-tools' });
    const berryRow = el('div', { class: 'pr-berries' });
    const coinEl = el('span');
    const btnShop = el('button', { type: 'button', 'aria-pressed': 'false' });
    const btnDex = el('button', { type: 'button', 'aria-pressed': 'false' });
    const btnLight = el('button', { type: 'button', hidden: '' });
    const btnMute = el('button', { type: 'button', class: 'pr-mute' });
    const btnHelp = el('button', { type: 'button', class: 'pr-help', html: ICON.help });
    const msg = el('p', { class: 'pr-msg' });
    const panel = el('div', { class: 'pr-panel', hidden: '' });
    if (SET.room === 'princess') roomEl.append(el('div', { class: 'pr-cur l' }), el('div', { class: 'pr-cur r' }));
    const wrap = el('div', { class: 'pr' + (SET.room ? ` ${SET.room} smooth` : '') }, roomEl, toolRow, berryRow, el('div', { class: 'pr-bar' }, btnLight, coinEl, btnShop, btnDex), msg, panel);
    root.replaceChildren(wrap);
    let feeding = '', open = '', alive = true, scale = 1, armed = '', grantAt = 0, msgUntil = 0;
    const monEls = new Map(), decoEls = new Map(), pooEls = new Map();

    const W = (path, v) => o.write([FS.ROOM, ...path], v);
    const pk = () => (o.data() && o.data()[FS.ROOM]) || {};
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
    const nextOf = (m) => { const n = SET.next(m.p); return SET.romi && SET.romi.has(m.p) ? n.filter((q) => q !== m.p && !(m.forms || []).includes(q)) : n; }; // 👑 로미는 아직 못 본 모습만
    const need = (m) => (!hatched(m) ? EGG_NEED : nextOf(m).length ? SET.evoNeed(m.p) : 0);
    // 도감: 한 번 만난 친구는 계속 남음 (진화 · 변신해도 전 모습이 안 꺼짐). room.dex.{id} = 1 + 지금 방 친구
    const seenSet = () => new Set([...Object.keys(pk().dex || {}), ...mons().filter(hatched).map((m) => String(m.p))]);
    const meet = (...ids) => { const d = pk().dex || {}; for (const p of ids) if (p != null && !d[String(p)]) W(['dex', String(p)], 1); };
    const say = (t) => { msg.replaceChildren(...rich(t)); msgUntil = Date.now() + 3000; };
    // 💗 친해지기 (변신 없는 티니핑): 하트 5개마다 한 단계 — 축하만 (2026-11-16 엄마: 코인은 포켓몬 방과 같게, 고맙다는 🪙 은 없앰), 💗3부터 단짝(반짝 빛 · 춤)
    const FRIEND = 5;
    const lvOf = (m) => (SET.friend && hatched(m) && !nextOf(m).length ? Math.floor((m.f || 0) / FRIEND) : 0);
    function addHome(id) { const h = pk().home; if (Array.isArray(h) && h.length < HOME_MAX) W(['home'], [...h, id]); }

    // ── 🍚 💩 🤚 🌙 돌보기 (맨 위 설명) ──
    // 🖼️ 지금 장소 (산 장소만) · 그 장소의 가구 자료와 저장 위치
    const BGP = BGS[SET.room ? 'pp' : 'pk'];
    const placeNow = () => { const b = pk().bg; return b && BGP[b] && (pk().bgs || {})[b] ? b : 'base'; };
    const decoData = () => (curPlace === 'base' ? pk().deco : (pk().pdeco || {})[curPlace]) || {};
    const decoPath = (key) => (curPlace === 'base' ? ['deco', key] : ['pdeco', curPlace, key]);
    const local = { care: {}, pc: {}, wk: '', ch: null, lo: null, loAt: 0, bd: {}, wish: '' }; // 방금 쓴 것 (가족 문서가 돌아오기 전에도 바로 보이게)
    const care = (id) => { const s = (pk().care || {})[id] || {}, l = local.care[id] || {}, c = {}; for (const f of ['e', 'p', 'b', 's', 'm', 'k', 'j']) c[f] = Math.max(s[f] || 0, l[f] || 0); return c; };
    function setCare(id, patch) { const v = Object.fromEntries(Object.entries({ ...care(id), ...patch }).filter(([, t]) => t)); local.care[id] = v; W(['care', id], v); }
    const lightsOff = () => isNight() && (Date.now() - local.loAt < 8000 ? local.lo : pk().lo) === nightKey();
    const awake = () => mons().some((m) => hatched(m));
    // 이번 밥 때 원하는 게 있는 친구: 방에 나온 친구 중 1마리 (3마리 이상이면 2마리)
    function needy() {
      const s = slotOf(Date.now());
      if (!s) return new Set();
      const all = pk().mons || {}, ids = homeIds().filter((id) => all[id] && hatched(all[id]));
      ids.sort((a, b) => hash(a + s.key) - hash(b + s.key));
      return new Set(ids.slice(0, ids.length >= 3 ? 2 : 1));
    }
    function needOf(m, set) {
      const s = slotOf(Date.now());
      if (!s || !m || !hatched(m) || !(set || needy()).has(m.id)) return '';
      const c = care(m.id);
      if (c.e < s.start && Date.now() - c.e > 2 * 3600e3) return 'eat';
      if (c.p < s.start) return 'pet';
      return '';
    }
    // 💩 하루 두 번 (10~13시, 15~18시 사이 한 번씩). 어제 못 치운 것도 남음 (최대 3개)
    function poops() {
      if (!awake()) return [];
      const now = Date.now(), pc = pk().pc || {}, from = pk().start || 0, out = [];
      for (const back of [1, 0]) {
        const d0 = new Date(now - back * 864e5); d0.setHours(0, 0, 0, 0);
        const dk = dayKey(+d0);
        for (const i of [0, 1]) {
          const key = `${dk}-${i}`, t = +d0 + (i ? 15 : 10) * 3600e3 + hash(key) * 3 * 3600e3;
          if (t <= now && t >= from && !pc[key] && !local.pc[key]) out.push({ key, x: 8 + hash(key + 'x') * 84, y: 68 + hash(key + 'y') * 28 });
        }
      }
      return out.slice(-3);
    }
    function cleanPoo(p, e) {
      if (e._gone) return;
      e._gone = true; e.classList.add('gone'); pooEls.delete(p.key); setTimeout(() => e.remove(), 520);
      local.pc[p.key] = 1; sfx('pop'); hearts(p.x, p.y - 6, 2, 'sparkle');
      W(['pc', p.key], 1);
      const old = dayKey(Date.now() - 3 * 864e5);
      for (const k of Object.keys(pk().pc || {})) if (k < old) W(['pc', k], null);
      if (!poops().length) say(L().cleaned);
      setTimeout(renderBar, 60);
    }
    function happy(e) { const c = SET.room ? 'dance' : 'jump'; e.classList.remove(c); void e.offsetWidth; e.classList.add(c); setTimeout(() => e.classList.remove(c), 1450); }
    // 💕 열매 보너스: 오늘 밥 · 쓰다듬기 · 목욕을 받은 친구는 미션 열매를 먹을 때 하트 +1 (친구마다 하루 한 번)
    const todayNum = () => Number(dayKey(Date.now()).replace(/-/g, ''));
    function careBonus(m) {
      if (!hatched(m)) return 0;
      const c = care(m.id), t0 = new Date(); t0.setHours(0, 0, 0, 0);
      if (Math.max(c.e, c.p, c.b) < +t0 || c.k >= todayNum()) return 0;
      setCare(m.id, { k: todayNum() });
      return 1;
    }
    // 밥 · 쓰다듬기 뒤: 그 친구가 원하던 걸 다 했으면 폴짝 + 하트 (보이기만 — 하트는 미션 열매로)
    function afterCare(e, id, was) {
      if (!was || !was.has(id)) return;
      setTimeout(() => {
        const raw = (pk().mons || {})[id];
        if (!alive || !raw || needOf({ id, ...raw }, was)) return;
        happy(e);
        const x = parseFloat(e.style.left), y = parseFloat(e.style.top) - 14;
        hearts(x, y, 5);
      }, 700);
    }
    function eatRice(e, m, x, y) {
      if (!hatched(m)) { bubble(x, y, L().eggRice); snd.boing(); return; }
      const set = needy();
      if (needOf(m, set) !== 'eat') { bubble(x, y, L().full(name(m.p))); snd.boing(); return; }
      setCare(m.id, { e: Date.now() });
      hearts(x, y, 3, 'rice'); sfx('yum'); bubble(x, y, L().yum);
      afterCare(e, m.id, set);
      setTimeout(() => { renderRoom(); renderBar(); }, 60);
    }
    // 🤚 쓰다듬기: 꾹 누른 채 문지르기 (조금 문지르면 한 번 쓰다듬은 것)
    function pet(e, phase) {
      const x = parseFloat(e.style.left), y = parseFloat(e.style.top);
      if (phase === 'start') {
        const hand = el('span', { class: 'pr-hand', html: ICON[feeding === 'soap' ? 'soap' : 'hand'], style: `left:${x}%;top:${y - 8}%` });
        roomEl.append(hand); e.classList.add('pet'); e._pet = { hand, rubs: 0, done: false };
        hearts(x, y - 14, 1); snd.tap(1); return;
      }
      const p = e._pet;
      if (!p) return;
      if (phase === 'end') { p.hand.remove(); e.classList.remove('pet'); e._pet = null; e._rest = Date.now() + 2500; return; }
      p.rubs++;
      if (feeding === 'soap') { const raw = (pk().mons || {})[e._id]; if (raw && p.rubs % 2 === 0) scrub(e, { id: e._id, ...raw }, x, y - 14); return; } // 비누 들고 문지르기 = 씻기
      hearts(x, y - 14, 1);
      if (p.rubs % 2) sfx('pet');
      if (p.rubs < 4 || p.done) return;
      p.done = true;
      try { localStorage.setItem('poke-room:pet-tip', String(tipN() + 1)); } catch {} // 쓰다듬기 안내는 세 번 해 보면 그만
      const raw = (pk().mons || {})[e._id];
      if (!raw || !hatched(raw)) return;
      const m = { id: e._id, ...raw }, set = needy(), before = needOf(m, set);
      bubble(x, y - 14, L().petted(name(m.p)));
      if (before || Date.now() - care(m.id).p > 30 * 60e3) setCare(m.id, { p: Date.now() });
      if (before === 'pet') afterCare(e, m.id, set);
      setTimeout(() => { renderRoom(); renderBar(); }, 60);
    }
    // 아침 첫 인사 (방을 처음 열거나, 켜 둔 아이패드를 아침에 처음 만질 때). 이틀 넘게 못 봤으면 "보고 싶었어요"
    function greet() {
      if (!alive || isNight() || !root.offsetParent || !awake()) return;
      const t = dayKey(Date.now()), wk = [pk().wk || '', local.wk].sort().pop();
      if (wk >= t) return;
      local.wk = t; W(['wk'], t);
      news(wk && wk < dayKey(Date.now() - 864e5) ? L().missed : new Date().getHours() < 11 ? L().morning : L().hello);
      for (const e of monEls.values()) if (!e._egg) happy(e);
      const hi = homeMons().find((x) => hatched(x)); if (hi) setTimeout(() => voice(hi, true), 700); // 인사 목소리
      // 🤧 감기: 사흘 넘게 못 왔으면 (반반) 또는 목욕을 아주 오래 못 했으면 — 하루에 한 마리만
      const now = Date.now(), all = pk().mons || {}, ids = homeIds().filter((id) => all[id] && hatched(all[id]) && !sickOf({ id, ...all[id] }));
      const away = wk && wk < dayKey(now - 3 * 864e5) && hash(t + o.kid) < 0.5;
      const who = ids.find((id) => now > bathDue({ id, ...all[id] }) + 3 * 864e5) || (away ? [...ids].sort((a, b) => hash(a + t) - hash(b + t))[0] : '');
      if (who) { setCare(who, { s: now }); news(L().caught(name(all[who].p))); }
      setTimeout(party, 1500);
    }

    // ── 2단계: 🧼 목욕 · 🤒 감기 · 💊 약 · ⚽ 공놀이 · 💭 소원 ──
    const bathDue = (m) => Math.max(care(m.id).b, m.h || 0, CARE_START) + (3 + hash(m.id + 'b') * 2) * 864e5; // 3~5일마다 (친구마다 다르게)
    const dirtyOf = (m) => !!m && hatched(m) && Date.now() > bathDue(m);
    const sickOf = (m) => { if (!m || !hatched(m)) return false; const c = care(m.id); return !!c.s && c.m < c.s && Date.now() - c.s < 2 * 864e5; }; // 이틀 지나면 저절로 나음
    const homeMons = () => { const h = new Set(homeIds()); return mons().filter((m) => h.has(m.id)); };
    // 💭 오늘의 소원: 방 친구 한 마리, ⚽ 공놀이 또는 좋아하는 열매 (그 열매가 있을 때만)
    function wishOf() {
      if (isNight()) return null;
      const d = dayKey(Date.now());
      if (pk().wish === d || local.wish === d) return null;
      const ms = homeMons().filter((m) => hatched(m) && !sickOf(m)).sort((a, b) => hash(a.id + d + 'w') - hash(b.id + d + 'w'));
      if (!ms.length) return null;
      const m = ms[0], berry = SET.fav(m.p);
      return hash(d + 'k' + o.kid) < 0.5 && count(berry) ? { id: m.id, kind: 'berry', berry } : { id: m.id, kind: 'play' };
    }
    function wishDone(e, id, given) {
      const d = dayKey(Date.now());
      local.wish = d; W(['wish'], d);
      const raw = (pk().mons || {})[id];
      if (!raw) return;
      setTimeout(() => news(L().wishDone(name(raw.p))), 400);
      voice(raw, true);
      if (given) return; // 열매 소원: 하트는 먹을 때 같이
      const x = parseFloat(e.style.left), y = parseFloat(e.style.top) - 14;
      hearts(x, y, 5, 'star', true);
      grow(e, { id, ...raw }, 1, x, y, '💖 +1');
    }
    // 머리 위 말풍선: 🤒 > 🍚 > 🤚 > 💭 소원 > 🛁
    function wantOf(m, set, w) {
      if (!m || !hatched(m)) return '';
      if (sickOf(m)) return 'sick';
      const nd = needOf(m, set);
      if (nd) return nd === 'eat' ? 'rice' : 'hand';
      if (w && w.id === m.id) return `w:${w.kind === 'play' ? 'ball' : w.berry}`; // 💭 소원
      return dirtyOf(m) ? 'bath' : '';
    }
    function scrub(e, m, x, y) {
      if (!hatched(m)) { bubble(x, y, L().eggClean); snd.boing(); return; }
      if (e._shower) return;
      e._scrub = (e._scrub || 0) + 1; sfx('bubble');
      e.append(el('span', { class: 'foam', html: ICON.bubbles, style: `left:${rnd(0, 70).toFixed(0)}%;top:${rnd(5, 65).toFixed(0)}%` }));
      if (e._scrub < 3) { if (e._sb) e._sb.remove(); e._sb = bubble(x, y, L().scrub); return; }
      if (e._sb) { e._sb.remove(); e._sb = null; }
      e._scrub = 0; e._shower = true;
      // 🛁 욕조에 쏙: 친구 발밑에 욕조를 놓고 (친구보다 앞) 물 쪼르륵 → 거품 → 욕조가 쏙 빠지면 반짝
      // 욕조 가장자리가 친구 키의 아래쪽 40% 쯤에 오게 (윗몸은 보이게)
      const RH = roomEl.clientHeight || 1, mh = parseFloat(e._img && e._img.style.height) || (e.offsetHeight > 24 ? e.offsetHeight : 92 * scale), mw = Math.max(e.offsetWidth, mh * 0.9); // 그림이 아직 안 왔어도 보통 키로
      const tw = Math.max(mw * 1.4, 58 * scale), th = tw * 92 / 120;
      const bottom = parseFloat(e.style.top) + ((th * 54 / 92 - mh * 0.4) / RH) * 100;
      const tub = el('span', { class: 'pr-tub', html: TUB, style: `left:${x}%;top:${bottom.toFixed(2)}%;width:${tw.toFixed(0)}px;z-index:${(parseInt(e.style.zIndex, 10) || 50) + 1}` });
      roomEl.append(tub); e.classList.add('inbath'); bubble(x, y - 4, L().bathIn); sfx('pour');
      setTimeout(() => hearts(x, y + 2, 5, 'bubbles', true), 700);
      const was = dirtyOf(m);
      setTimeout(() => {
        tub.classList.add('out'); setTimeout(() => tub.remove(), 520);
        e.classList.remove('inbath'); for (const f of e.querySelectorAll('.foam')) f.remove(); e._shower = false;
        if (!alive) return;
        setCare(m.id, { b: Date.now() }); hearts(x, y, 4, 'sparkle', true); snd.stick(); happy(e); bubble(x, y, L().bathed);
        if (was) setTimeout(() => hearts(x, y, 4), 700);
        renderRoom(); renderBar();
      }, 2300);
    }
    function givePill(e, m, x, y) {
      if (!sickOf(m)) { bubble(x, y, L().notSick); snd.boing(); return; }
      const own = take('pill', 1)[0], pay = own ? '' : take('coin', 1)[0]; // 사 둔 약이 있으면 그것부터, 없으면 🪙 1개
      if (!own && !pay) { say(L().noCoinPill); snd.boing(); return; }
      W(['items', own || pay], null);
      setCare(m.id, { m: Date.now() }); hearts(x, y, 4, 'pill', true); sfx('pill'); happy(e);
      setTimeout(() => news(L().cured(name(m.p))), 300);
      setTimeout(() => { renderRoom(); renderBar(); }, 60);
    }
    // ⚽ 공놀이: 공이 떨어진 곳으로 가까운 친구가 쫓아가서 세 번 뻥
    let ball = null;
    function throwBall(x, y, who) {
      if (isNight()) return;
      if (ball) ball.el.remove();
      x = Math.min(92, Math.max(8, x)); y = Math.min(95, Math.max(62, y));
      const b = el('span', { class: 'pr-ball', html: ICON.ball, style: `left:${x}%;top:${y}%;z-index:${10 + Math.round(y)}` });
      roomEl.append(b); snd.boing();
      const me = ball = { el: b, x, y, kicks: 0 }, all = pk().mons || {};
      const ok = [...monEls.values()].filter((e) => !e._egg && !e._busy && !e._play && !e._pet && !e.classList.contains('drag') && all[e._id] && !sickOf({ id: e._id, ...all[e._id] }));
      const far = (e) => Math.hypot(parseFloat(e.style.left) - x, parseFloat(e.style.top) - y);
      const e = who && ok.includes(who) ? who : ok.sort((a, c) => far(a) - far(c))[0];
      if (!e) { setTimeout(() => { if (ball === me) endBall(); }, 2500); return; }
      chase(e, me);
    }
    function chase(e, me) {
      if (!alive || ball !== me) { e._play = false; return; }
      e._play = true; e._spot = null;
      const ox = parseFloat(e.style.left), oy = parseFloat(e.style.top), d = Math.max(0.5, Math.hypot(me.x - ox, (me.y - oy) * 0.75) / 16);
      placeMon(e, me.x + (ox < me.x ? -4 : 4), me.y + 1, d.toFixed(2));
      setTimeout(() => kick(e, me), d * 1000 + 50);
    }
    function kick(e, me) {
      if (!alive || ball !== me) { e._play = false; return; }
      e.classList.remove('jump'); void e.offsetWidth; e.classList.add('jump');
      sfx('kick'); hearts(me.x, me.y - 14, 2);
      if (++me.kicks >= 3) {
        e._play = false; e._rest = Date.now() + 2500; endBall();
        const w = wishOf();
        if (w && w.kind === 'play' && w.id === e._id) wishDone(e, e._id);
        return;
      }
      me.x = Math.min(92, Math.max(8, me.x + rnd(-35, 35))); me.y = Math.min(95, Math.max(62, me.y + rnd(-14, 14)));
      Object.assign(me.el.style, { left: `${me.x}%`, top: `${me.y}%`, rotate: `${me.kicks * 400}deg`, zIndex: String(10 + Math.round(me.y)) });
      setTimeout(() => chase(e, me), 650);
    }
    function endBall() { const b = ball; ball = null; if (!b) return; b.el.style.opacity = '0'; setTimeout(() => b.el.remove(), 600); }

    // ── 3단계: 🎂 태어난 날 세기 · 오늘 미션 응원 ──
    function party() {
      if (!alive || isNight() || !root.offsetParent) return;
      const all = pk().mons || {}, bd = pk().bd || {}, now = Date.now();
      for (const id of homeIds()) {
        const m = all[id];
        if (!m || !hatched(m) || !m.h) continue;
        const age = Math.floor((now - m.h) / 864e5), ms = MILE.filter(([d]) => age >= d).pop();
        if (!ms || Math.max(bd[id] || 0, local.bd[id] || 0) >= ms[0]) continue;
        local.bd[id] = ms[0]; W(['bd', id], ms[0]);
        for (let i = 0; i < ms[1]; i++) W(['items', uid('b')], 'coin');
        const e = monEls.get(id);
        if (e) {
          const x = parseFloat(e.style.left), y = parseFloat(e.style.top);
          const c = el('span', { class: 'pr-cake', html: ICON.cake, style: `left:${Math.min(94, x + 9)}%;top:${y}%` });
          roomEl.append(c); setTimeout(() => c.remove(), 6000); hearts(x, y - 14, 8, 'party'); happy(e);
        }
        news(L().party(name(m.p), ms[0], ms[1]));
        setTimeout(party, 4500); // 한 마리씩 차례로
        return;
      }
    }
    const missionNow = () => { try { return FS.missionState(o.data() || {}, o.kid, dayKey(Date.now())); } catch { return null; } };
    let cheerAt = Date.now() + 9000;
    function cheer() {
      cheerAt = Date.now() + rnd(40e3, 75e3);
      const M = missionNow();
      if (!M || !M.total || lightsOff()) return;
      const es = [...monEls.values()].filter((e) => !e._egg && !e._busy && !e._play && !e._pet && !e._shower);
      if (!es.length) return;
      const e = pick(es), x = parseFloat(e.style.left), y = parseFloat(e.style.top) - 14;
      if (M.all) { happy(e); bubble(x, y, L().yay); return; }
      const t = M.list.find((q) => !M.day[q.id]);
      if (t) bubble(x, y, L().cheer(FS.missionIcon(t), FS.missionLabel(t, lang())));
    }

    // ── 🃏 친구 상태 카드 (누르면): 나이 · 하트 게이지(진화/변신/친해지기) · 좋아하는 열매 · 다음 모습 · 배부름/기분/깨끗함/건강 ──
    let cardT = 0;
    const closeCard = () => { clearTimeout(cardT); for (const c of roomEl.querySelectorAll('.pr-card')) c.remove(); };
    function bar(cur, max, ic, label, right) {
      const p = Math.max(0, Math.min(1, max ? cur / max : 1));
      return [el('div', { class: 'pc-lb' }, el('span', {}, ...rich(label)), el('span', {}, ...(right ? rich(right) : [icon(ic), ` ${cur} / ${max}`]))),
        el('div', { class: 'pc-bar', style: `--p:${(p * 100).toFixed(0)}%` }, el('i'), el('b', { text: p >= 1 ? 'MAX' : '' }))];
    }
    function showCard(m) {
      closeCard();
      const de = lang() === 'de', egg = !hatched(m), f = m.f || 0, P = SET.key === 'ping';
      const col = P ? ['#FF7EB6', '#FFD6E8'] : TYPE_COL[((FS.DEX || {})[m.p] || [])[4]] || ['#FFB46B', '#FFE6C8'];
      const pic = el('div', { class: 'pc-pic' }, egg ? el('span', { html: SET.eggHTML(m.egg) }) : el('img', { src: SET.art(m.p), alt: '' }), m.s && !egg ? el('span', { class: 'pc-shiny', html: ICON.sparkle }) : null);
      const rows = [];
      if (egg) rows.push(...bar(f, EGG_NEED, 'strawberry', de ? 'Bis zum Schlüpfen' : '태어나기까지'));
      else {
        const nexts = nextOf(m), n = need(m), lv = lvOf(m), age = m.h > 1e12 ? Math.floor((Date.now() - m.h) / 864e5) : -1;
        rows.push(el('div', { class: 'pc-sub' }, age >= 0 ? el('span', {}, ...rich(L().age(age))) : null, el('span', {}, de ? 'Liebt ' : '좋아하는 열매 ', icon(SET.fav(m.p)))));
        if (nexts.length) {
          const seen = seenSet();
          rows.push(...bar(f, n, 'heart', P ? (de ? 'Bis zur Verwandlung' : '변신까지') : (de ? 'Bis zur Entwicklung' : '진화까지')));
          rows.push(el('div', { class: 'pc-nx' }, el('span', { text: de ? 'Nächste Form ' : '다음 모습 ' }), ...nexts.slice(0, 3).map((q) => el('img', { src: SET.art(q), alt: '', class: seen.has(String(q)) ? 'pc-seen' : '' }))));
        }
        if (SET.romi && SET.romi.has(m.p) && (m.forms || []).length > 1) { // 👑 얻은 모습 중에서 고르기
          const { id: mid, ...rest } = m;
          rows.push(el('div', { class: 'pc-forms' }, el('span', { text: L().forms }), ...m.forms.map((q) => el('button', { type: 'button', class: q === m.p ? 'on' : '', 'aria-label': name(q),
            onclick: (ev) => { ev.stopPropagation(); if (q === m.p) return; W(['mons', mid], { ...rest, p: q }); snd.stick(); closeCard(); } }, el('img', { src: SET.art(q), alt: '' })))));
        }
        if (nexts.length) { /* 위에서 그림 */ } else if (SET.friend) rows.push(...bar(f % FRIEND, FRIEND, 'heart', lv >= 3 ? (de ? `💗${lv} Beste Freunde` : `💗${lv} 단짝`) : `💗${lv} → 💗${lv + 1}`));
        else rows.push(...bar(1, 1, 'star', de ? '⭐ Letzte Entwicklung!' : '⭐ 최종 진화!', `💖 ${f}`));
        if (!isNight()) {
          const nd = needOf(m), sk = sickOf(m), w = wishOf(), chip = (ic, ok, a, b) => el('span', { class: ok ? '' : 'pc-no' }, icon(ic), ok ? a : b);
          rows.push(el('div', { class: 'pc-st' }, chip('rice', nd !== 'eat', de ? 'Satt' : '배불러요', de ? 'Hunger' : '배고파요'), chip('heart', nd !== 'pet', de ? 'Fröhlich' : '기분 좋아요', de ? 'Streicheln!' : '쓰다듬어 줘요'),
            chip('bath', !dirtyOf(m), de ? 'Sauber' : '깨끗해요', de ? 'Baden!' : '씻고 싶어요'), sk ? chip('sick', false, '', de ? 'Krank' : '아파요') : null,
            w && w.id === m.id ? el('span', { class: 'pc-no' }, icon(w.kind === 'play' ? 'ball' : w.berry), de ? 'Wunsch' : '소원') : null));
        }
      }
      const tag = egg ? '' : P ? (nextOf(m).length ? '' : `💗${lvOf(m)}`) : ['', 'Lv.1', 'Lv.2', 'Lv.3'][(FS.pokeStage && FS.pokeStage(m.p)) || 0] || '';
      const c = el('div', { class: 'pr-card', style: `--c1:${col[0]};--c2:${col[1]}` }, pic,
        el('div', { class: 'pc-info' }, el('div', { class: 'pc-nm' }, el('span', { text: egg ? eggName(m.egg) : name(m.p) }), tag ? el('span', { class: 'pc-tag' }, ...rich(tag)) : null), ...rows),
        el('button', { type: 'button', class: 'pc-x', 'aria-label': L().close, text: '✕', onclick: closeCard }));
      c.addEventListener('pointerdown', (ev) => ev.stopPropagation());
      roomEl.append(c);
      cardT = setTimeout(closeCard, 9000);
    }
    // ── ❓ 도움말 ──
    function helpView(closeB) {
      const de = lang() === 'de', rows = (de ? HELP.de : HELP.ko)(SET.key === 'ping');
      const row = ([ic, t, d]) => el('div', { class: 'pr-hrow' }, icon(ic), el('div', {}, el('b', {}, ...rich(t)), el('span', {}, ...rich(d))));
      const hm = homeMons().filter((m) => hatched(m));
      return [el('h4', {}, el('span', {}, icon('help'), de ? ' So geht’s' : ' 이렇게 키워요'), closeB), ...rows.slice(0, 3).map(row),
        hm.length ? el('h4', {}, el('span', { text: de ? 'Lieblingsbeeren im Zimmer' : '우리 방 친구들이 좋아하는 열매' })) : null,
        hm.length ? el('div', { class: 'pr-grid' }, ...hm.map((m) => el('span', { class: 'pr-fav' }, el('img', { src: SET.art(m.p), alt: '', loading: 'lazy' }), el('span', { class: 'n', text: name(m.p) }), icon(SET.fav(m.p))))) : null,
        el('h4', {}, el('span', { text: de ? 'Was die Bilder über dem Kopf bedeuten' : '머리 위 그림 뜻' })),
        el('div', { class: 'pr-legend' }, ...(de ? LEGEND.de : LEGEND.ko).map(([k, t]) => el('span', {}, icon(k), t))), ...rows.slice(3).map(row)];
    }
    // ── ✨ 진화 · 변신 장면: 화면이 어두워지고 → 하얀 그림자가 두 모습을 오가다 점점 빨라짐 → 번쩍! → 새 모습 + "피카츄 ➜ 라이츄" ──
    function evoScene(from, to) {
      const P = SET.key === 'ping', T = [], at = (ms, f) => T.push(setTimeout(f, ms));
      const tone = (f, d) => { if (o.snd && !muted) beep([[f, 0, d, 'triangle']]); };
      const st = el('div', { class: 'ev-stage' }, el('img', { class: 'ev-a', src: SET.art(from), alt: '' }), el('img', { class: 'ev-b', src: SET.art(to), alt: '' }));
      const txt = el('div', { class: 'ev-txt' }, ...rich(P ? L().evoStartP(name(from)) : L().evoStart(name(from))));
      const ov = el('div', { class: 'pr-evo' + (P ? ' ping' : '') }, el('div', { class: 'ev-rays' }), st, el('div', { class: 'ev-flash' }), txt);
      document.body.append(ov);
      let doneAt = 0, closed = false;
      const close = () => { if (closed) return; closed = true; T.forEach(clearTimeout); ov.classList.add('out'); setTimeout(() => ov.remove(), 400); };
      ov.addEventListener('click', () => { if (doneAt && Date.now() - doneAt > 900) close(); });
      const burst = () => { for (let i = 0; i < 26; i++) { const a = Math.random() * Math.PI * 2, d = 18 + Math.random() * 30;
        const sp = el('span', { class: 'ev-sp', html: ICON[pick(P ? ['heart', 'sparkle', 'star'] : ['sparkle', 'star', 'sparkle'])], style: `--dx:${(Math.cos(a) * d).toFixed(1)}vmin;--dy:${(Math.sin(a) * d).toFixed(1)}vmin;--r:${Math.round(rnd(-200, 200))}deg;animation-delay:${(i * 0.02).toFixed(2)}s` });
        ov.append(sp); setTimeout(() => sp.remove(), 2200); } };
      if (o.snd && !muted) voice({ p: from, h: 1 }, true);
      at(1300, () => { ov.classList.add('white'); st.classList.add('glow'); tone(262, 0.5); });
      let t = 2100, gap = 440, n = 0, f = 330;
      while (gap > 55) { const b = n % 2 === 0, ff = f; at(t, () => { ov.classList.toggle('show-b', b); tone(ff, 0.08); }); t += gap; gap *= 0.85; n++; f *= 1.045; }
      at(t, () => ov.classList.add('show-b'));
      at(t + 200, () => {
        doneAt = Date.now();
        ov.classList.remove('white'); st.classList.remove('glow'); ov.classList.add('flashing', 'done');
        snd.tada(); burst(); setTimeout(() => voice({ p: to, h: 1 }, true), 500);
        txt.replaceChildren(el('div', {}, ...rich(P ? L().evoDoneP(name(from), name(to)) : L().evoDone(name(from), name(to)))),
          el('div', { class: 'ev-res' }, el('img', { src: SET.art(from), alt: '' }), el('span', { text: '➜' }), el('img', { src: SET.art(to), alt: '' })),
          el('button', { type: 'button', class: 'ev-ok', text: L().evoOk, onclick: (ev) => { ev.stopPropagation(); close(); } }));
      });
      at(t + 900, burst);
      at(t + 16000, close);
    }
    // ── 🐣 태어나는 장면: 알이 흔들흔들 → 금이 쩍 · 쩍 → 하얗게 번쩍! → 새 친구 + 이름 ──
    function hatchScene(egg, p, sh) {
      const P = SET.key === 'ping', T = [], at = (ms, f) => T.push(setTimeout(f, ms));
      const tone = (f, d) => { if (o.snd && !muted) beep([[f, 0, d, 'triangle']]); };
      const eg = el('div', { class: 'ev-egg w1', html: `<span class="egw">${SET.eggHTML(egg)}${CRACK}${CRACK2}</span>` });
      const st = el('div', { class: 'ev-stage' }, eg, el('img', { class: 'ev-b', src: SET.art(p), alt: '' }));
      const txt = el('div', { class: 'ev-txt' }, ...rich(P ? L().hatchStartP : L().hatchStart));
      const ov = el('div', { class: 'pr-evo' + (P ? ' ping' : '') }, el('div', { class: 'ev-rays' }), st, el('div', { class: 'ev-flash' }), txt);
      document.body.append(ov);
      let doneAt = 0, closed = false;
      const close = () => { if (closed) return; closed = true; T.forEach(clearTimeout); ov.classList.add('out'); setTimeout(() => ov.remove(), 400); };
      ov.addEventListener('click', () => { if (doneAt && Date.now() - doneAt > 900) close(); });
      const burst = () => { for (let i = 0; i < 28; i++) { const a = Math.random() * Math.PI * 2, d = 18 + Math.random() * 32;
        const sp = el('span', { class: 'ev-sp', html: ICON[pick(P ? ['heart', 'sparkle', 'star'] : ['sparkle', 'star', 'party'])], style: `--dx:${(Math.cos(a) * d).toFixed(1)}vmin;--dy:${(Math.sin(a) * d).toFixed(1)}vmin;--r:${Math.round(rnd(-200, 200))}deg;animation-delay:${(i * 0.02).toFixed(2)}s` });
        ov.append(sp); setTimeout(() => sp.remove(), 2200); } };
      new Image().src = SET.art(p);
      tone(392, 0.12);
      at(1000, () => { eg.className = 'ev-egg w2 c1'; tone(330, 0.1); setTimeout(() => tone(330, 0.1), 160); });
      at(2100, () => { eg.className = 'ev-egg w3 c1 c2'; tone(440, 0.1); setTimeout(() => tone(494, 0.1), 140); txt.replaceChildren(...rich(L().hatchMid)); });
      at(2900, () => { ov.classList.add('white'); st.classList.add('glow'); tone(523, 0.45); });
      at(3600, () => {
        doneAt = Date.now();
        ov.classList.remove('white'); st.classList.remove('glow'); ov.classList.add('flashing', 'done', 'show-b', 'hatched');
        snd.tada(); burst(); setTimeout(() => voice({ p, h: 1 }, true), 450);
        txt.replaceChildren(el('div', {}, ...rich(L().hatchDone(name(p), sh))),
          el('div', { class: 'ev-res' }, el('img', { src: SET.art(p), alt: '' }), el('b', { class: 'ev-nm' }, sh ? icon('sparkle') : null, name(p))),
          el('button', { type: 'button', class: 'ev-ok', text: L().hatchOk, onclick: (ev) => { ev.stopPropagation(); close(); } }));
      });
      at(4300, burst);
      at(19000, close);
    }
    // ── 친구들이 가구를 써요 (소파에 앉기 · 피아노 · 분수 · 밤엔 침대에서 쿨쿨) ──
    const UK = USE[SET.room ? 'pp' : 'pk'], BK = BED[SET.room ? 'pp' : 'pk'];
    const fac = () => (scale * 300) / Math.max(1, roomEl.clientWidth); // 가구 크기 비율 (방이 커도 가구는 2.4배까지)
    function spotAt(key, dx, dy) {
      const de = decoEls.get(key);
      if (!de) return null;
      const f = fac();
      return { x: parseFloat(de.style.left) + dx * f, y: parseFloat(de.style.top) + dy * f, z: parseInt(de.style.zIndex, 10) || 0 };
    }
    function useDeco(e) {
      const taken = new Set([...monEls.values()].map((m) => m._spot)), free = [...decoEls.keys()].filter((k) => UK[k] && !taken.has(k));
      if (!free.length) return false;
      const k = pick(free), [ic, dx, dy, over] = UK[k], s = spotAt(k, dx, dy);
      if (!s) return false;
      const ox = parseFloat(e.style.left), oy = parseFloat(e.style.top), x = Math.min(95, Math.max(5, s.x)), y = Math.min(98, Math.max(56, s.y));
      const d = Math.max(0.8, Math.hypot(x - ox, (y - oy) * 0.75) / 9);
      e._spot = k; placeMon(e, x, y, d.toFixed(2)); e._rest = Date.now() + d * 1000 + rnd(7000, 13000);
      const at = () => { if (!alive || e._spot !== k) return; if (over) e.style.zIndex = String(s.z + 1); hearts(x, y - 16, 2, ic, true); };
      setTimeout(at, d * 1000 + 80); setTimeout(at, d * 1000 + 4500);
      return true;
    }
    const bedSpot = (i) => (BK[i] ? spotAt('bed', BK[i][0], BK[i][1]) : null);
    // 가구 상자 (방 %) — 아직 그림이 안 왔으면 너비로 높이를 어림
    function decoBoxes(wallToo) {
      const R = roomEl.getBoundingClientRect();
      if (!R.width) return null;
      return [...decoEls.entries()].filter(([k]) => k !== 'rug' && (wallToo === 'all' || !!DK[k][3] === !!wallToo)).map(([, d]) => {
        const r = d.getBoundingClientRect(), h = r.height > 2 ? r.height : r.width * 0.85;
        return [(r.left - R.left) / R.width * 100, (r.bottom - h - R.top) / R.height * 100, (r.right - R.left) / R.width * 100, (r.bottom - R.top) / R.height * 100];
      });
    }
    // 💩 은 가구가 없는 빈 바닥에
    function freeFloor(seed, x0, y0) {
      const boxes = decoBoxes(false);
      if (!boxes) return { x: x0, y: y0 };
      const poos = [...pooEls.values()].map((p) => [parseFloat(p.style.left), parseFloat(p.style.top)]);
      const hit = (x, y) => boxes.some(([a, b, c, d]) => x > a - 4 && x < c + 4 && y > b && y - 8 < d + 2) || poos.some(([px, py]) => Math.abs(px - x) < 9 && Math.abs(py - y) < 7);
      for (let i = 0; i < 20; i++) { const x = i ? 8 + hash(seed + 'x' + i) * 84 : x0, y = i ? 68 + hash(seed + 'y' + i) * 27 : y0; if (!hit(x, y)) return { x, y }; }
      return { x: x0, y: y0 };
    }
    // 새로 산 가구는 비어 있는 자리에 (원래 자리에서 너무 멀지 않게)
    function spotFor(key) {
      const [, dx, dy, wall, w] = DK[key];
      const R = roomEl.getBoundingClientRect();
      if (key === 'rug' || !R.width) return { x: dx, y: dy };
      const wp = (w * scale) / R.width * 100, hp = (w * 0.85 * scale) / R.height * 100, boxes = decoBoxes(!!wall) || [];
      if (wall) boxes.push(SET.room ? [29, 0, 71, 48] : [36, 6, 64, 42]); // 창문 (· 커튼)
      let best = null;
      for (const y of wall ? [20, 26, 32, 38, 44] : [62, 66, 70, 74, 78, 82, 86, 90, 94]) {
        for (let x = wp / 2 + 2; x <= 98 - wp / 2; x += 3) {
          const a = [x - wp / 2, y - hp, x + wp / 2, y];
          let ov = 0;
          for (const b of boxes) ov += Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));
          const sc = ov + Math.hypot(x - dx, y - dy) * 0.5;
          if (!best || sc < best.sc) best = { sc, x: Math.round(x), y };
        }
      }
      return best ? { x: best.x, y: best.y } : { x: dx, y: dy };
    }
    // 🤚 쓰다듬기 안내: 처음 세 번은 손이 문지르는 시늉을 보여 줌 (이 기기에서)
    let tipAt = 0;
    const tipN = () => { try { return Number(localStorage.getItem('poke-room:pet-tip')) || 0; } catch { return 9; } };
    function petTip() {
      if (Date.now() < tipAt || tipN() >= 3 || lightsOff()) return;
      tipAt = Date.now() + 9000;
      const set = needy(), all = pk().mons || {};
      const e = [...monEls.values()].find((x) => !x._pet && !x._play && all[x._id] && needOf({ id: x._id, ...all[x._id] }, set) === 'pet');
      if (!e) return;
      const g = el('span', { class: 'pr-hand ghost', html: ICON.hand, style: `left:${e.style.left};top:${parseFloat(e.style.top) - 8}%` });
      roomEl.append(g); setTimeout(() => g.remove(), 2400); say(L().petMe);
    }

    // 처음 고르는 알 (정해진 포켓몬) + 딸기 3개
    function pickEgg(egg) {
      if (mons().length) return;
      W(['mons', uid('e')], { egg, p: SET.startEggs[egg], f: 0, q: 1, at: Date.now() }); // q = 첫 알: 톡 누르면 바로 깨어남
      if (!pk().start) W(['start'], Date.now());
      for (const n of [1, 2, 3]) W(['items', `w${n}`], 'strawberry');
      news(L().eggCame(eggName(egg)));
    }
    // 💖 티니핑 방: 알 고르기 없이 하츄핑이 하트 알 안에 와 있음 (첫 알 → 톡 누르면 바로 깨어남)
    let booted = false;
    function boot() {
      if (!alive || !SET.start || booted || mons().length) return;
      booted = true;
      W(['mons', 'start'], { egg: SET.eggs[0], p: SET.start, f: 0, q: 1, at: Date.now() });
      if (!pk().start) W(['start'], Date.now());
      for (const n of [1, 2, 3]) W(['items', `w${n}`], 'strawberry');
      setTimeout(() => news(L().eggCame(eggName(SET.eggs[0]))), 400);
    }
    // 황금 스티커: 🪙 3개씩 (주마다 한 번), 4개마다 황금 알 — 알을 고른 다음에 받은 것만
    // 가게에서 빠진 가구를 이미 샀으면 치우고 코인을 돌려줌 (한 번만 — 치운 뒤엔 다시 안 함)
    function refundGone() {
      if (!alive || SET.room !== 'princess') return;
      const deco = pk().deco || {}, gone = Object.keys(deco).filter((k) => DECO_GONE[k] && !DK0[k]); // 내 방 가구만
      if (!gone.length) return;
      let c = 0;
      for (const k of gone) { W(['deco', k], null); for (let i = 0; i < DECO_GONE[k]; i++) W(['items', uid('r')], 'coin'); c += DECO_GONE[k]; }
      news(L().refund(c));
    }
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
    let newsAt = 0;
    function news(t) { // 여러 개면 차례로 (겹치지 않게)
      const wait = Math.max(0, newsAt - Date.now());
      newsAt = Date.now() + wait + 2600;
      setTimeout(() => {
        if (!alive) return;
        for (const old of roomEl.querySelectorAll('.pr-news')) old.remove();
        const n = el('div', { class: 'pr-news' }, ...rich(t));
        roomEl.append(n); setTimeout(() => n.remove(), 4600);
        snd.tada();
      }, wait);
    }
    function bubble(x, y, t, extra) {
      const b = el('div', { class: 'pr-bub', style: `left:${x}%;top:${y}%` }, ...rich(t), extra);
      roomEl.append(b); setTimeout(() => b.remove(), 2100); return b;
    }
    function hearts(x, y, n, icon, all) {
      for (let i = 0; i < n; i++) {
        const k = (i === 0 || all) && icon ? icon : 'heart', hh = el('span', { class: 'pr-heart', html: ICON[k] || k, style: `left:${x}%;top:${y}%;--hx:${rnd(-30, 30)}px;animation-delay:${i * 0.08}s` });
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
      if (e._egg) { const img = e.querySelector('.pk-egg'); if (img) img.style.width = `${(SET.room ? 46 : 34) * scale}px`; return; }
      if (e._img && SET.room) { e._img.style.height = `${52 * scale * (e._tall || 1)}px`; return; } // 티니핑 그림은 크기가 제각각 → 키를 맞춤
      if (e._img && e._img.naturalWidth) e._img.style.width = `${e._img.naturalWidth * scale}px`;
    }
    function monEl(id) {
      const e = el('button', { type: 'button', class: 'pr-mon' });
      e._id = id;
      placeMon(e, rnd(10, 90), rnd(62, 95), 0);
      dragable(e, () => tapMon(e), (x, y) => { placeMon(e, x, Math.max(58, y), 0); e._rest = Date.now() + 6000; e._spot = null; }, null, (ph) => pet(e, ph));
      return e;
    }
    function setLook(e, m) {
      const egg = !hatched(m), cracked = egg && ((m.f || 0) >= 3 || !!m.q), key = egg ? `egg/${m.egg}/${cracked ? 1 : 0}` : `${m.p}/${m.s ? 1 : 0}`;
      e.classList.toggle('glow', lvOf(m) >= 3);
      if (e._key === key) return;
      e._key = key; e._egg = egg; e._tall = !egg && SET.tall ? SET.tall(m.p) : 1;
      e.classList.toggle('egg', egg); e.classList.toggle('crack', cracked); e.classList.remove('hatch');
      if (egg) {
        e.innerHTML = `<span class="egw">${SET.eggHTML(m.egg)}${cracked ? CRACK : ''}</span>`;
        e.style.setProperty('--wd', `${rnd(0, 3).toFixed(1)}s`);
        e.setAttribute('aria-label', eggName(m.egg));
        e._img = null;
      } else {
        const img = el('img', { alt: '', draggable: 'false', src: SET.walk(m.p, m.s) });
        img.onload = () => sizeImg(e);
        e._img = img;
        if (SET.room) { // 티니핑: 그림을 .pr-body 로 감싸서 숨쉬기 · 걷기 · 폴짝
          e.replaceChildren(el('span', { class: 'pr-body' }, img));
          e.style.setProperty('--wd', `-${rnd(0, 2.6).toFixed(2)}s`); // 친구마다 움직이는 박자가 다르게
          sizeImg(e);
        } else e.replaceChildren(img);
        if (m.s) e.append(el('span', { class: 'shine', html: ICON.sparkle }));
        e.setAttribute('aria-label', name(m.p));
      }
    }
    function tapMon(e) {
      const raw = (pk().mons || {})[e._id];
      if (!raw) return;
      const m = { id: e._id, ...raw };
      const x = parseFloat(e.style.left), y = parseFloat(e.style.top) - 14;
      e.classList.remove('jump'); void e.offsetWidth; e.classList.add('jump');
      if (!hatched(m) && m.q) return hatchEgg(e, m, x, y); // 첫 알: 바로 깨어남
      if (feeding === 'rice') return eatRice(e, m, x, y);
      if (feeding === 'soap') return scrub(e, m, x, y);
      if (feeding === 'pill') return givePill(e, m, x, y);
      if (feeding === 'ball') return throwBall(x + rnd(-22, 22), y + 14 + rnd(-3, 6), e);
      if (feeding && count(feeding) > 0) return feed(e, m, feeding, x, y);
      if (hatched(m)) { if (Date.now() - (e._vAt || 0) > 1200) { e._vAt = Date.now(); voice(m); } } else snd.boing(); // 누르면 울음소리 / 핑♪
      showCard(m); // 🃏 상태 카드
      const w = wishOf();
      if (sickOf(m)) say(L().sickSay(name(m.p)));
      else if (w && w.id === m.id && !isNight() && !needOf(m)) say(w.kind === 'play' ? L().wishPlay(name(m.p)) : L().wishBerry(name(m.p), `${BERRY[w.berry][1]} ${bName(w.berry)}`));
    }
    // 알이 깨어남: 정해진 포켓몬/티니핑(첫 알) 또는 랜덤
    function hatchEgg(e, m, x, y) {
      if (e._busy) return;
      const { id, q, ...v } = m;
      const have = new Set(mons().filter(hatched).map((z) => z.p));
      const p = SET.valid(m.p) ? m.p : SET.hatch(m.egg, have), s = Math.random() < SET.shiny;
      e._busy = true; e.classList.add('hatch');
      hatchScene(m.egg, p, s); // 🐣 화면 전체 장면 (자료는 바로 저장)
      setTimeout(() => { e._busy = false; W(['mons', id], { ...v, p, s, h: Date.now(), f: 0 }); meet(p); hearts(x, y, 8); }, 1300);
    }
    function feed(e, m, kind, x, y) {
      const key = take(kind, 1)[0];
      if (!key || e._busy) return;
      if (hatched(m) && SET.fav(m.p) !== kind && care(m.id).j >= todayNum()) { // 좋아하는 열매가 아니면 하루 한 개만 (2026-11-16 엄마)
        bubble(x, y, L().oneBerry(name(m.p), `${BERRY[SET.fav(m.p)][1]} ${bName(SET.fav(m.p))}`)); snd.boing(); return;
      }
      if (hatched(m) && SET.fav(m.p) !== kind) setCare(m.id, { j: todayNum() });
      const { id, ...v } = m, w = wishOf();
      W(['items', key], null);
      if (!hatched(m)) {
        const f = (m.f || 0) + 1;
        hearts(x, y, 2, kind); snd.coin();
        if (f >= EGG_NEED) hatchEgg(e, m, x, y);
        else { W(['mons', id], { ...v, f }); bubble(x, y, L().eggInfo(EGG_NEED - f)); }
      } else {
        const fav = SET.fav(m.p) === kind, wish = !!w && w.kind === 'berry' && w.id === id && w.berry === kind, bonus = careBonus(m);
        hearts(x, y, fav ? 6 : 3, kind); snd.coin();
        grow(e, m, (fav ? 2 : 1) + (wish ? 1 : 0) + bonus, x, y, fav ? L().fav : L().ate(name(m.p)));
        if (bonus) { setTimeout(() => hearts(x, y, 4, 'heart'), 450); news(L().careBonus(name(m.p))); }
        if (wish) wishDone(e, id, true);
      }
      setTimeout(renderBar, 60);
    }
    // 하트가 늘어남 (열매 · 돌봄): 다 차면 진화/변신, 티니핑은 친해지기 단계
    function grow(e, m, add, x, y, text) {
      const { id, ...v } = m, f = (m.f || 0) + add, nexts = nextOf(m), n = need(m);
      if (nexts.length && f >= n) {
        const to = pick(nexts), from = m.p;
        e._busy = true; e.classList.add('evo');
        evoScene(from, to); // ✨ 화면 전체 진화 장면
        const forms = SET.romi && SET.romi.has(from) ? { forms: [...new Set([...(v.forms || [from]), from, to])] } : {}; // 👑 로미가 얻은 모습
        setTimeout(() => { W(['mons', id], { ...v, ...forms, p: to, f: 0 }); meet(from, to); }, 700);
        setTimeout(() => { e._busy = false; e.classList.remove('evo'); }, 1400);
        return;
      }
      W(['mons', id], { ...v, f }); bubble(x, y, text);
      const lv0 = lvOf(m), lv1 = lvOf({ ...m, f });
      if (lv1 > lv0) { // 한 단계 친해짐 → 축하 (코인 없음)
        setTimeout(() => news(lv0 < 3 && lv1 >= 3 ? L().bff(name(m.p)) : L().closer(name(m.p), lv1)), 600);
        setTimeout(() => hearts(x, y, 6, 'heart'), 600);
        setTimeout(() => voice(m, true), 700);
      }
    }
    // 끌어서 옮기기 (조금만 움직이면 '누르기'). onHold: 꾹 누르고 있으면 'start' → 문지르면 'rub' → 떼면 'end' (쓰다듬기)
    function dragable(e, onTap, onMove, onDrop, onHold) {
      let st = null;
      const stop = () => { if (st) clearTimeout(st.t); };
      e.addEventListener('pointerdown', (ev) => {
        stop();
        const me = st = { x: ev.clientX, y: ev.clientY, lx: ev.clientX, ly: ev.clientY, moved: false, hold: false, rub: 0 };
        if (onHold) me.t = setTimeout(() => { if (st === me && !me.moved) { me.hold = true; onHold('start'); } }, 450);
        try { e.setPointerCapture(ev.pointerId); } catch {}
      });
      e.addEventListener('pointermove', (ev) => {
        if (!st) return;
        if (st.hold) {
          st.rub += Math.hypot(ev.clientX - st.lx, ev.clientY - st.ly); st.lx = ev.clientX; st.ly = ev.clientY;
          if (st.rub > 28) { st.rub = 0; onHold('rub'); }
          return;
        }
        if (!st.moved && Math.hypot(ev.clientX - st.x, ev.clientY - st.y) < 8) return;
        st.moved = true; e.classList.add('drag');
        const r = roomEl.getBoundingClientRect();
        const x = Math.min(97, Math.max(3, ((ev.clientX - r.left) / r.width) * 100)), y = Math.min(99, Math.max(8, ((ev.clientY - r.top) / r.height) * 100 + (e.classList.contains('rug') ? 0 : 6)));
        onMove(x, y);
      });
      const end = () => { if (!st) return; const { moved, hold } = st; stop(); st = null; e.classList.remove('drag'); if (hold) onHold('end'); else if (moved) { if (onDrop) onDrop(); } else onTap(); };
      e.addEventListener('pointerup', end);
      e.addEventListener('pointercancel', () => { if (!st) return; const hold = st.hold; stop(); st = null; e.classList.remove('drag'); if (hold) onHold('end'); });
      e.addEventListener('click', (ev) => ev.preventDefault());
    }
    function wander() {
      if (!alive) return;
      if (!root.isConnected) return destroy();
      if (!root.offsetParent || document.hidden) return; // 안 보이면 쉼 (배터리)
      if (msgUntil && Date.now() > msgUntil) { msgUntil = 0; renderBar(); }
      if (isNight()) return;
      if (Date.now() > cheerAt) cheer();
      petTip();
      const allM = pk().mons || {};
      for (const e of monEls.values()) {
        if (e._egg || e._busy || e._pet || e._play || e._shower || e.classList.contains('drag') || (e._rest && Date.now() < e._rest) || Math.random() > 0.3) continue;
        if (allM[e._id] && sickOf({ id: e._id, ...allM[e._id] })) { // 🤒 아프면 제자리에서 가끔 에취
          if (Math.random() < 0.25) { bubble(parseFloat(e.style.left), parseFloat(e.style.top) - 14, L().achoo); sfx('achoo'); }
          e._rest = Date.now() + rnd(3000, 7000); continue;
        }
        if (e.classList.contains('glow') && Math.random() < 0.3) { // 💗3 단짝: 춤추며 하트 퐁퐁
          e.classList.remove('dance'); void e.offsetWidth; e.classList.add('dance'); setTimeout(() => e.classList.remove('dance'), 1450);
          hearts(parseFloat(e.style.left), parseFloat(e.style.top) - 16, 3); e._rest = Date.now() + rnd(3000, 6000); continue;
        }
        if (SET.room && Math.random() < 0.35) { // 티니핑: 가끔은 걷는 대신 제자리에서 폴짝 / 뒤돌아보기
          if (Math.random() < 0.6) { e.classList.remove('jump'); void e.offsetWidth; e.classList.add('jump'); setTimeout(() => e.classList.remove('jump'), 520); }
          else e.classList.toggle('flip');
          e._rest = Date.now() + rnd(1500, 4000); continue;
        }
        if (Math.random() < 0.22 && useDeco(e)) continue; // 가끔은 가구에 가서 놀기
        e._spot = null;
        const ox = parseFloat(e.style.left), oy = parseFloat(e.style.top);
        const x = Math.min(94, Math.max(6, ox + rnd(-28, 28))), y = Math.min(96, Math.max(60, oy + rnd(-12, 12)));
        const d = Math.max(1, Math.hypot(x - ox, (y - oy) * 0.75) / 9);
        placeMon(e, x, y, d.toFixed(2));
        e._rest = Date.now() + d * 1000 + rnd(800, 3500);
      }
    }

    // ── 가구 ──
    function decoEl(key) {
      const e = el('div', { class: 'pr-deco' + (key === 'rug' ? ' rug' : ''), style: `--w:${DK[key][4]}` }, el('img', { src: `${BASE}poke/deco/${DK[key][0]}.svg`, alt: '', draggable: 'false' }));
      dragable(e, () => {}, (x, y) => { e.style.left = `${x}%`; e.style.top = `${y}%`; e.style.zIndex = key === 'rug' ? '3' : String(10 + Math.round(y)); },
        () => W(decoPath(key), { ...(decoData()[key] || {}), x: Math.round(parseFloat(e.style.left)), y: Math.round(parseFloat(e.style.top)) }));
      return e;
    }

    function renderRoom() {
      wrap.classList.toggle('night', isNight());
      const th = pk().bg, BG = BGS[SET.room ? 'pp' : 'pk']; // 🖼️ 산 배경
      for (const c of [...wrap.classList]) if (c.startsWith('th-') && c !== `th-${th}`) wrap.classList.remove(c);
      if (th && BG[th] && (pk().bgs || {})[th]) wrap.classList.add(`th-${th}`);
      scale = Math.min(2.4, Math.max(1, roomEl.clientWidth / 300));
      wrap.style.setProperty('--pr-k', scale.toFixed(3)); // 가구도 캐릭터와 같은 비율로
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
      // 가구 (장소가 바뀌면 그 장소 가구로)
      const pl = placeNow();
      if (pl !== curPlace) { for (const e of decoEls.values()) e.remove(); decoEls.clear(); curPlace = pl; DK = pl === 'base' ? DK0 : PDECO[pl] || {}; }
      const deco = decoData();
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
      const all = Object.fromEntries(mons().map((m) => [m.id, m])), home = homeIds(), dark = lightsOff(), set = needy(), w = wishOf();
      for (const [id, e] of monEls) if (!home.includes(id)) { e.remove(); monEls.delete(id); }
      for (const id of home) {
        let e = monEls.get(id);
        if (!e) { e = monEl(id); monEls.set(id, e); roomEl.append(e); }
        if (!e._busy) setLook(e, all[id]);
        for (const z of e.querySelectorAll('.zz, .need')) z.remove();
        if (isNight()) { if (!e._egg) e.append(dark ? el('span', { class: 'zz', html: ICON.zz }) : el('span', { class: 'need', html: ICON.yawn })); } // 불 켜 두면 하품
        else { const ic = wantOf(all[id], set, w); if (ic) e.append(el('span', { class: 'need' + (ic.startsWith('w:') ? ' wish' : ''), html: ICON[ic.replace('w:', '')] })); }
        e.classList.toggle('sick', sickOf(all[id])); e.classList.toggle('dirty', !isNight() && dirtyOf(all[id]) && !sickOf(all[id]));
        sizeImg(e);
      }
      // 🌙 불 끄면 침대가 있으면 두 마리까지 침대에서 쿨쿨
      const sleepers = dark && decoEls.get('bed') ? home.filter((id) => all[id] && hatched(all[id])).slice(0, 2) : [];
      for (const [id, e] of monEls) {
        const i = sleepers.indexOf(id), s = i >= 0 ? bedSpot(i) : null;
        if (s) { if (!e._bed) { e._bed = true; e._spot = 'bed'; placeMon(e, s.x, s.y, 0); } e.style.zIndex = String(s.z + 1); }
        else if (e._bed) { e._bed = false; e._spot = null; }
      }
      // 💩
      const pp = poops(), keep = new Set(pp.map((p) => p.key));
      for (const [key, pe] of pooEls) if (!keep.has(key)) { pe.remove(); pooEls.delete(key); }
      for (const p of pp) {
        if (pooEls.has(p.key)) continue;
        Object.assign(p, freeFloor(p.key, p.x, p.y));
        const pe = el('button', { type: 'button', class: 'pr-poo', 'aria-label': '💩', html: ICON.poop, style: `left:${p.x}%;top:${p.y}%;z-index:${10 + Math.round(p.y)}` });
        pe.addEventListener('click', () => cleanPoo(p, pe));
        pooEls.set(p.key, pe); roomEl.append(pe);
      }
      // 🌙 불 끈 방
      wrap.classList.toggle('dark', dark);
      const dim = roomEl.querySelector('.pr-dim');
      if (dark && !dim) roomEl.append(el('div', { class: 'pr-dim' })); else if (!dark && dim) dim.remove();
    }
    function hint() {
      if (poops().length) return L().poo;
      const hm = homeMons();
      if (hm.some(sickOf)) return L().sick;
      const set = needy(), nds = hm.map((m) => needOf(m, set));
      if (nds.includes('eat')) return L().hungry;
      if (nds.includes('pet')) return L().petMe;
      if (wishOf()) return L().wishHint;
      if (hm.some(dirtyOf)) return L().dirty;
      const M = missionNow();
      return M && M.got ? L().allDone : mons().length ? L().pickBerry : '';
    }
    function renderBar() {
      const sickNow = homeMons().some(sickOf); // 💊 약 버튼은 아픈 친구가 있을 때만
      if (feeding && (TOOLS.includes(feeding) ? isNight() || (feeding === 'pill' && !sickNow) : !count(feeding))) feeding = ''; // 밤에는 돌보기 쉼
      const tools = TOOLS.filter((t) => t !== 'pill' || sickNow);
      toolRow.hidden = !awake();
      toolRow.style.setProperty('--n', tools.length);
      toolRow.replaceChildren(...tools.map((t) => el('button', { type: 'button', class: t === 'pill' ? 'pill' : '', 'aria-pressed': String(feeding === t), 'aria-label': L()[t], onclick: () => {
        if (isNight()) { say(lightsOff() ? L().sleep : L().sleepy); return; }
        feeding = feeding === t ? '' : t; snd.tap(2); msgUntil = 0; renderBar();
      } }, el('span', { class: 'e', html: ICON[t] }), L()[t], t !== 'pill' ? null : count('pill') ? el('small', { text: `×${count('pill')}` }) : el('small', {}, icon('coin'), '1'))));
      btnLight.hidden = !isNight() || !awake();
      btnLight.replaceChildren(icon(lightsOff() ? 'bulb' : 'moon'), lightsOff() ? L().lightOn : L().lightOff);
      berryRow.replaceChildren(...FS.BERRIES.map(([k, ic]) => {
        const n = count(k);
        return el('button', { type: 'button', class: n ? '' : 'zero', 'aria-pressed': String(feeding === k), 'aria-label': bName(k), onclick: () => {
          if (!n) { say(L().noBerry(bName(k))); return; }
          feeding = feeding === k ? '' : k; snd.tap(2); msgUntil = 0; renderBar();
        } }, el('span', { class: 'e', html: ICON[k] || ic }), String(n));
      }));
      coinEl.replaceChildren(icon('coin'), `${count('coin')}`);
      btnShop.replaceChildren(icon('shop'), L().shop); btnShop.setAttribute('aria-pressed', String(open === 'shop'));
      btnDex.replaceChildren(icon('book'), `${SET.dex.filter((id) => seenSet().has(String(id))).length}/${SET.dex.length}`); btnDex.setAttribute('aria-pressed', String(open === 'dex'));
      if (!msgUntil || Date.now() > msgUntil) msg.replaceChildren(...rich(feeding === 'rice' ? L().riceHint : feeding === 'soap' ? L().soapHint : feeding === 'ball' ? L().ballHint : feeding === 'pill' ? L().pillHint : feeding ? L().feedHint(`${BERRY[feeding][1]} ${bName(feeding)}`)
        : isNight() ? (lightsOff() || !awake() ? L().sleep : L().sleepy) : mons().some((m) => m.q && !hatched(m)) ? L().tapEgg : hint()));
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
        const deco = decoData();
        const eggs = el('div', { class: 'pr-grid' }, ...SET.eggs.map((egg) => el('button', { type: 'button', class: armed === `egg:${egg}` ? 'armed' : coins < FS.EGG_PRICE ? 'poor' : '',
          onclick: () => buy(`egg:${egg}`, FS.EGG_PRICE, () => { const id = uid('e'); W(['mons', id], { egg, f: 0, at: Date.now() }); addHome(id); news(L().eggCame(eggName(egg))); }) },
          el('span', { class: 'eg', html: SET.eggHTML(egg) }), el('span', { class: 'n', text: eggName(egg) }), el('span', {}, icon('coin'), `${FS.EGG_PRICE}`))));
        const BG = BGS[SET.room ? 'pp' : 'pk'], bgs = pk().bgs || {}, cur = (pk().bg && bgs[pk().bg]) ? pk().bg : 'base';
        const bgGrid = el('div', { class: 'pr-grid' }, ...Object.keys(BG).map((k) => {
          const [price, ko, de] = BG[k], has = k === 'base' || !!bgs[k], on = cur === k;
          const pv = el('span', { class: `bgpv pr${SET.room ? ` ${SET.room}` : ''}${k === 'base' ? '' : ` th-${k}`}` }, el('span', { class: 'pr-room' }));
          return el('button', { type: 'button', class: on ? 'on' : armed === `bg:${k}` ? 'armed' : !has && coins < price ? 'poor' : '', onclick: () => {
            if (has) { if (!on) { W(['bg'], k === 'base' ? null : k); snd.stick(); } return; }
            buy(`bg:${k}`, price, () => { W(['bgs', k], 1); W(['bg'], k); });
          } }, !has && Date.now() < NEW_UNTIL ? el('span', { class: 'new', text: 'NEW' }) : null, pv, el('span', { class: 'n', text: lang() === 'de' ? de : ko }),
            has ? el('span', { text: on ? L().bgOn : '' }) : el('span', {}, icon('coin'), `${price}`));
        }));
        const rank = (k) => (deco[k] ? 2000 : coins >= DK[k][5] ? 0 : 1000) + DK[k][5]; // 살 수 있는 것 → 아직 못 사는 것 → 산 것
        const furn = el('div', { class: 'pr-grid' }, ...Object.keys(DK).sort((a, b) => rank(a) - rank(b)).map((key) => {
          const v = deco[key], has = !!v, on = has && !v.off, price = DK[key][5];
          const ic = el('span', { class: 'dk', style: `--iw:${Math.min(64, Math.max(34, DK[key][4] * 0.8)).toFixed(0)}` }, el('img', { src: `${BASE}poke/deco/${DK[key][0]}.svg`, alt: '', loading: 'lazy' }));
          return el('button', { type: 'button', class: on ? 'on' : armed === `deco:${curPlace}:${key}` ? 'armed' : !has && coins < price ? 'poor' : '', onclick: () => {
            if (has) { W(decoPath(key), { ...v, off: on ? true : null }); snd.stick(); return; }
            buy(`deco:${curPlace}:${key}`, price, () => W(decoPath(key), spotFor(key)));
          } }, !has && Date.now() < NEW_UNTIL ? el('span', { class: 'new', text: 'NEW' }) : null, ic, el('span', { class: 'n', text: DK[key][lang() === 'de' ? 7 : 6] }), has ? null : el('span', {}, icon('coin'), `${price}`));
        }));
        // 👑 로미와 친구들 (티니핑 방): 알 말고 바로 데려옴. 로미 🪙 20, 친구 🪙 15
        const fam = new Set(mons().map((x) => (SET.romi && SET.romi.has(x.p) ? 'romi' : x.p)));
        const who = SET.buy && SET.buy.length ? el('div', { class: 'pr-grid' }, ...SET.buy.map((id) => {
          const has = fam.has(id), price = id === 'romi' ? 20 : 15;
          return el('button', { type: 'button', class: has ? 'on' : armed === `who:${id}` ? 'armed' : coins < price ? 'poor' : '', onclick: () => {
            if (has) { say(L().whoHave(name(id))); return; }
            buy(`who:${id}`, price, () => { const nid = uid('h'); W(['mons', nid], { egg: 'heart', p: id, h: Date.now(), f: 0, at: Date.now(), ...(id === 'romi' ? { forms: ['romi'] } : {}) });
              meet(id); addHome(nid); news(L().whoCame(name(id))); setTimeout(() => voice({ p: id, h: 1 }, true), 500); });
          } }, el('img', { src: SET.art(id), alt: '', loading: 'lazy' }), el('span', { class: 'n', text: name(id) }), has ? el('span', { text: '✓' }) : el('span', {}, icon('coin'), `${price}`));
        })) : null;
        panel.replaceChildren(el('h4', {}, el('span', {}, icon('coin'), L().shopHead(coins)), closeB), el('h4', {}, el('span', { text: L().eggs })), eggs,
          who ? el('h4', {}, el('span', {}, ...rich(L().whoHead))) : null, who ? el('p', { text: L().whoTip }) : null, who,
          el('h4', {}, el('span', {}, ...rich(L().bgHead))), el('p', { text: L().bgTip }), bgGrid,
          el('h4', {}, el('span', { text: curPlace === 'base' ? L().furn : `${L().furn} · ${BGP[curPlace][lang() === 'de' ? 2 : 1]}` })), el('p', { text: L().decoTip }), furn);
      } else if (open === 'help') {
        panel.replaceChildren(...helpView(closeB));
      } else {
        const all = mons(), home = homeIds(), seenS = seenSet(), seen = { has: (id) => seenS.has(String(id)) }, nSeen = SET.dex.filter((id) => seen.has(id)).length;
        const grid = el('div', { class: 'pr-grid' }, ...[...all].reverse().map((m) => el('button', { type: 'button', class: home.includes(m.id) ? 'on' : '', onclick: () => {
          const h = homeIds(), i = h.indexOf(m.id);
          if (i >= 0) h.splice(i, 1); else if (h.length >= HOME_MAX) { say(L().homeFull); return; } else h.push(m.id);
          W(['home'], h); snd.tap(i >= 0 ? 1 : 3);
        } }, hatched(m) ? el('img', { src: SET.art(m.p), alt: '', loading: 'lazy' }) : el('span', { class: 'eg', html: SET.eggHTML(m.egg) }),
          el('span', { class: 'n', text: hatched(m) ? name(m.p) : eggName(m.egg) }), m.s && hatched(m) ? el('span', { class: 'b', html: ICON.sparkle }) : null)));
        const dex = el('div', { class: 'pr-grid' }, ...SET.dex.map((id) => el('button', { type: 'button', class: seen.has(id) ? '' : 'unk', tabindex: '-1' },
          el('img', { src: SET.art(id), alt: '', loading: 'lazy' }), el('span', { class: 'n', text: seen.has(id) ? name(id) : typeof id === 'number' ? `#${id}` : '?' }))));
        panel.replaceChildren(el('h4', {}, el('span', { text: L().homeHead(home.length) }), closeB), grid, el('h4', {}, el('span', { text: L().dexHead(nSeen, SET.dex.length) })), dex);
      }
    }
    function renderAll() { if (!alive) return; renderRoom(); renderBar(); renderPanel(); }

    btnShop.addEventListener('click', () => { open = open === 'shop' ? '' : 'shop'; armed = ''; feeding = ''; renderAll(); });
    btnDex.addEventListener('click', () => { open = open === 'dex' ? '' : 'dex'; armed = ''; feeding = ''; renderAll(); });
    btnLight.addEventListener('click', () => {
      const off = !lightsOff();
      local.lo = off ? nightKey() : null; local.loAt = Date.now(); W(['lo'], local.lo);
      snd.tap(off ? 1 : 3);
      if (off) say(L().night); else for (const e of monEls.values()) if (!e._egg) happy(e);
      renderRoom(); renderBar();
    });
    roomEl.addEventListener('pointerdown', greet);
    const muteLook = () => { btnMute.innerHTML = ICON[muted ? 'mute' : 'sound']; btnMute.setAttribute('aria-label', muted ? '소리 켜기' : '소리 끄기'); btnMute.setAttribute('aria-pressed', String(muted)); };
    btnMute.addEventListener('click', () => {
      muted = !muted; muteLook();
      try { localStorage.setItem('poke-room:mute', muted ? '1' : '0'); } catch {}
      try { if (muted && window.speechSynthesis) window.speechSynthesis.cancel(); } catch {}
      if (!muted) beep(SFX.pill);
    });
    if (o.snd) { muteLook(); roomEl.append(btnMute); }
    btnHelp.setAttribute('aria-label', lang() === 'de' ? 'Hilfe' : '도움말');
    btnHelp.addEventListener('click', () => { open = open === 'help' ? '' : 'help'; armed = ''; feeding = ''; snd.tap(2); renderAll(); if (open) setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50); });
    roomEl.append(btnHelp);
    roomEl.addEventListener('pointerdown', (ev) => { if (ev.target === roomEl || ev.target.classList.contains('pr-dim')) closeCard(); }); // 빈 곳을 누르면 카드 닫기
    roomEl.addEventListener('pointerdown', (ev) => { // ⚽ 바닥을 누르면 공 던지기
      if (feeding !== 'ball' || ev.target.closest('.pr-mon, .pr-poo, .pr-pick, .pr-deco, .pr-mute, .pr-help, .pr-card')) return;
      const r = roomEl.getBoundingClientRect();
      throwBall(((ev.clientX - r.left) / r.width) * 100, ((ev.clientY - r.top) / r.height) * 100 + 4);
    });
    const timer = setInterval(wander, 1200);
    const nightTimer = setInterval(() => { if (alive && root.offsetParent) { renderRoom(); renderBar(); } }, 60e3); // 밤낮 · 밥 때 · 💩 (시간으로 바뀌는 것)
    const ro = window.ResizeObserver ? new ResizeObserver(() => { if (alive) renderRoom(); }) : null;
    if (ro) ro.observe(roomEl);
    function destroy() { alive = false; clearInterval(timer); clearInterval(nightTimer); clearTimeout(upT); if (ro) ro.disconnect(); }
    renderAll();
    // 쓰기는 mount 가 끝난 다음에 (앱이 쓰자마자 다시 그리면서 방을 또 만들지 않게)
    setTimeout(grants, 900);
    setTimeout(refundGone, 1200);
    setTimeout(greet, 1600);
    setTimeout(party, 4000);
    setTimeout(() => { // 가구 · 장소 그림 미리 받아 두기 ('?' 안 보이게) — 내 방 + 산 장소만, 이 페이지에서 한 번씩
      if (!alive) return;
      for (const pl of ['base', ...Object.keys(pk().bgs || {}).filter((b) => BGP[b])]) {
        const key = `${SET.key}:${pl}`; if (PRELOADED.has(key)) continue; PRELOADED.add(key);
        const t = pl === 'base' ? DK0 : PDECO[pl] || {};
        for (const k of Object.keys(t)) new Image().src = `${BASE}poke/deco/${t[k][0]}.svg`;
        if (pl !== 'base') new Image().src = `${BASE}poke/deco/scene-${pl}.svg`;
      }
    }, 5000);
    setTimeout(() => { const M = missionNow(); if (alive && M && M.got && !isNight()) for (const e of monEls.values()) if (!e._egg) happy(e); }, 2200); // 오늘 미션 다 했으면 다 같이 춤
    let upT = 0;
    const update = () => { if (upT) return; upT = setTimeout(() => { upT = 0; renderAll(); grants(); }, 40); }; // 자료가 연달아 바뀌어도 (코인 여러 개 · 생일 선물 …) 한 번만 다시 그림
    root._pr = { update, destroy };
    return root._pr;
  }
  // 방으로 가는 버튼 그림 (각 앱 탭 · 버튼에서 씀): 포켓몬 = 몬스터볼, 티니핑 = 하츄핑 얼굴
  function tabIcon(kid) {
    addCss();
    const S = FS.charSet(kid);
    return S && S.key === 'ping' ? `<img class="pi" src="${BASE}ping/heartsping1.webp" alt="" style="width:1.5em;height:1.5em;object-fit:contain;vertical-align:-.4em">`
      : ICON.pokeball.replace('class="pi"', 'class="pi" style="width:1.25em;height:1.25em;vertical-align:-.24em"');
  }
  window.PokeRoom = { mount, DECO, DECO_P, PDECO, ICON, rich, tabIcon };
})();
