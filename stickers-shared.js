/* 칭찬 스티커 공통 파일 — 우리가족 앱과 우리집 한눈에가 함께 씀 (trykyn.github.io/our-family/stickers-shared.js).
   여기 있는 것(스티커 그림 · 칭찬 이유 · 소리 · 개수 계산 규칙)을 고치면 두 앱에 한 번에 적용됨.
   스티커 자료는 가족 문서 kids.{davin|arin} 에 저장:
     stickers.{id} = { at, d(그림 번호), why('@brush' 또는 직접 쓴 글), src?, tr?, by }
     cfg = { small, big, reward, bigReward, start }   ← start 이후에 붙인 스티커가 지금 판
     lock = { on, pin }  (kids.lock: 엄마·아빠 비밀번호 2자리)
   다빈 = 동글동글 속성 몬스터, 아린 = 반짝이 하트 요정 (직접 그린 SVG — 예전 스티커).
   🥚 포켓몬 알 키우기 (다빈·아린·엄마·아빠): 오늘 미션을 다 하면 선물 상자에서 열매(5가지) 또는 🪙 코인이 나옴.
     그날 스티커의 d = 2000 + 열매 번호 / 2100 = 코인 (스티커판에도 그 그림). 받은 것은 kids.{k}.room.items.{스티커 id} = 'apple' | 'coin' …
     kids.{k}.room (예전 이름 poke) = { start, items: {id: 열매|'coin'}, mons: {id: { egg, p?(태어난 포켓몬), f(하트), s?(반짝이), at }}, deco: {가구: {x, y, off?}}, home?: [방에 나온 id], gp: {황금 주: 1} }
     그림은 PokeAPI에서 받아 poke/ (art = 도감, walk/walk-s = 방에서 걷는 그림). 방 화면은 poke-room.js
   💖 아린 방만 티니핑 (charSet): 같은 kids.arin.room 에 저장. 처음엔 하츄핑이 하트 알 안에 있고 (톡 누르면 바로 깨어남) 나머지는 하트 알에서 랜덤. 그림 ping/{id}.webp */
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
  const STICKER_N = 8;

  /* ── 🥚 포켓몬 알 키우기 ── DEX[번호] = [한국어, 독일어, 진화 전 번호(0 = 첫 단계), 전설(1), 첫째 타입] */
  const BASE = (document.currentScript && document.currentScript.src) ? new URL('.', document.currentScript.src).href : './';
  const DEX = {
    1:["이상해씨","Bisasam",0,0,"grass"],2:["이상해풀","Bisaknosp",1,0,"grass"],3:["이상해꽃","Bisaflor",2,0,"grass"],4:["파이리","Glumanda",0,0,"fire"],5:["리자드","Glutexo",4,0,"fire"],
    6:["리자몽","Glurak",5,0,"fire"],7:["꼬부기","Schiggy",0,0,"water"],8:["어니부기","Schillok",7,0,"water"],9:["거북왕","Turtok",8,0,"water"],10:["캐터피","Raupy",0,0,"bug"],
    11:["단데기","Safcon",10,0,"bug"],12:["버터플","Smettbo",11,0,"bug"],13:["뿔충이","Hornliu",0,0,"bug"],14:["딱충이","Kokuna",13,0,"bug"],15:["독침붕","Bibor",14,0,"bug"],
    16:["구구","Taubsi",0,0,"normal"],17:["피죤","Tauboga",16,0,"normal"],18:["피죤투","Tauboss",17,0,"normal"],19:["꼬렛","Rattfratz",0,0,"normal"],20:["레트라","Rattikarl",19,0,"normal"],
    21:["깨비참","Habitak",0,0,"normal"],22:["깨비드릴조","Ibitak",21,0,"normal"],23:["아보","Rettan",0,0,"poison"],24:["아보크","Arbok",23,0,"poison"],25:["피카츄","Pikachu",0,0,"electric"],
    26:["라이츄","Raichu",25,0,"electric"],27:["모래두지","Sandan",0,0,"ground"],28:["고지","Sandamer",27,0,"ground"],29:["니드런♀","Nidoran♀",0,0,"poison"],30:["니드리나","Nidorina",29,0,"poison"],
    31:["니드퀸","Nidoqueen",30,0,"poison"],32:["니드런♂","Nidoran♂",0,0,"poison"],33:["니드리노","Nidorino",32,0,"poison"],34:["니드킹","Nidoking",33,0,"poison"],35:["삐삐","Piepi",0,0,"fairy"],
    36:["픽시","Pixi",35,0,"fairy"],37:["식스테일","Vulpix",0,0,"fire"],38:["나인테일","Vulnona",37,0,"fire"],39:["푸린","Pummeluff",0,0,"normal"],40:["푸크린","Knuddeluff",39,0,"normal"],
    41:["주뱃","Zubat",0,0,"poison"],42:["골뱃","Golbat",41,0,"poison"],43:["뚜벅쵸","Myrapla",0,0,"grass"],44:["냄새꼬","Duflor",43,0,"grass"],45:["라플레시아","Giflor",44,0,"grass"],
    46:["파라스","Paras",0,0,"bug"],47:["파라섹트","Parasek",46,0,"bug"],48:["콘팡","Bluzuk",0,0,"bug"],49:["도나리","Omot",48,0,"bug"],50:["디그다","Digda",0,0,"ground"],
    51:["닥트리오","Digdri",50,0,"ground"],52:["나옹","Mauzi",0,0,"normal"],53:["페르시온","Snobilikat",52,0,"normal"],54:["고라파덕","Enton",0,0,"water"],55:["골덕","Entoron",54,0,"water"],
    56:["망키","Menki",0,0,"fighting"],57:["성원숭","Rasaff",56,0,"fighting"],58:["가디","Fukano",0,0,"fire"],59:["윈디","Arkani",58,0,"fire"],60:["발챙이","Quapsel",0,0,"water"],
    61:["슈륙챙이","Quaputzi",60,0,"water"],62:["강챙이","Quappo",61,0,"water"],63:["캐이시","Abra",0,0,"psychic"],64:["윤겔라","Kadabra",63,0,"psychic"],65:["후딘","Simsala",64,0,"psychic"],
    66:["알통몬","Machollo",0,0,"fighting"],67:["근육몬","Maschock",66,0,"fighting"],68:["괴력몬","Machomei",67,0,"fighting"],69:["모다피","Knofensa",0,0,"grass"],70:["우츠동","Ultrigaria",69,0,"grass"],
    71:["우츠보트","Sarzenia",70,0,"grass"],72:["왕눈해","Tentacha",0,0,"water"],73:["독파리","Tentoxa",72,0,"water"],74:["꼬마돌","Kleinstein",0,0,"rock"],75:["데구리","Georok",74,0,"rock"],
    76:["딱구리","Geowaz",75,0,"rock"],77:["포니타","Ponita",0,0,"fire"],78:["날쌩마","Gallopa",77,0,"fire"],79:["야돈","Flegmon",0,0,"water"],80:["야도란","Lahmus",79,0,"water"],
    81:["코일","Magnetilo",0,0,"electric"],82:["레어코일","Magneton",81,0,"electric"],83:["파오리","Porenta",0,0,"normal"],84:["두두","Dodu",0,0,"normal"],85:["두트리오","Dodri",84,0,"normal"],
    86:["쥬쥬","Jurob",0,0,"water"],87:["쥬레곤","Jugong",86,0,"water"],88:["질퍽이","Sleima",0,0,"poison"],89:["질뻐기","Sleimok",88,0,"poison"],90:["셀러","Muschas",0,0,"water"],
    91:["파르셀","Austos",90,0,"water"],92:["고오스","Nebulak",0,0,"ghost"],93:["고우스트","Alpollo",92,0,"ghost"],94:["팬텀","Gengar",93,0,"ghost"],95:["롱스톤","Onix",0,0,"rock"],
    96:["슬리프","Traumato",0,0,"psychic"],97:["슬리퍼","Hypno",96,0,"psychic"],98:["크랩","Krabby",0,0,"water"],99:["킹크랩","Kingler",98,0,"water"],100:["찌리리공","Voltobal",0,0,"electric"],
    101:["붐볼","Lektrobal",100,0,"electric"],102:["아라리","Owei",0,0,"grass"],103:["나시","Kokowei",102,0,"grass"],104:["탕구리","Tragosso",0,0,"ground"],105:["텅구리","Knogga",104,0,"ground"],
    106:["시라소몬","Kicklee",0,0,"fighting"],107:["홍수몬","Nockchan",0,0,"fighting"],108:["내루미","Schlurp",0,0,"normal"],109:["또가스","Smogon",0,0,"poison"],110:["또도가스","Smogmog",109,0,"poison"],
    111:["뿔카노","Rihorn",0,0,"ground"],112:["코뿌리","Rizeros",111,0,"ground"],113:["럭키","Chaneira",0,0,"normal"],114:["덩쿠리","Tangela",0,0,"grass"],115:["캥카","Kangama",0,0,"normal"],
    116:["쏘드라","Seeper",0,0,"water"],117:["시드라","Seemon",116,0,"water"],118:["콘치","Goldini",0,0,"water"],119:["왕콘치","Golking",118,0,"water"],120:["별가사리","Sterndu",0,0,"water"],
    121:["아쿠스타","Starmie",120,0,"water"],122:["마임맨","Pantimos",0,0,"psychic"],123:["스라크","Sichlor",0,0,"bug"],124:["루주라","Rossana",0,0,"ice"],125:["에레브","Elektek",0,0,"electric"],
    126:["마그마","Magmar",0,0,"fire"],127:["쁘사이저","Pinsir",0,0,"bug"],128:["켄타로스","Tauros",0,0,"normal"],129:["잉어킹","Karpador",0,0,"water"],130:["갸라도스","Garados",129,0,"water"],
    131:["라프라스","Lapras",0,0,"water"],132:["메타몽","Ditto",0,0,"normal"],133:["이브이","Evoli",0,0,"normal"],134:["샤미드","Aquana",133,0,"water"],135:["쥬피썬더","Blitza",133,0,"electric"],
    136:["부스터","Flamara",133,0,"fire"],137:["폴리곤","Porygon",0,0,"normal"],138:["암나이트","Amonitas",0,0,"rock"],139:["암스타","Amoroso",138,0,"rock"],140:["투구","Kabuto",0,0,"rock"],
    141:["투구푸스","Kabutops",140,0,"rock"],142:["프테라","Aerodactyl",0,0,"rock"],143:["잠만보","Relaxo",0,0,"normal"],144:["프리져","Arktos",0,1,"ice"],145:["썬더","Zapdos",0,1,"electric"],
    146:["파이어","Lavados",0,1,"fire"],147:["미뇽","Dratini",0,0,"dragon"],148:["신뇽","Dragonir",147,0,"dragon"],149:["망나뇽","Dragoran",148,0,"dragon"],150:["뮤츠","Mewtu",0,1,"psychic"],
    151:["뮤","Mew",0,1,"psychic"],
  };
  const POKE_N = 151;
  const pokeName = (id, lang) => (DEX[id] ? DEX[id][lang === 'de' ? 1 : 0] : '');
  const pokeArt = (id) => `${BASE}poke/art/${id}.png`;
  const pokeWalk = (id, shiny) => `${BASE}poke/${shiny ? 'walk-s' : 'walk'}/${id}.gif`;
  const pokeStage = (id) => { let n = 1; for (let x = id; DEX[x] && DEX[x][2]; x = DEX[x][2]) n++; return n; };
  const pokeNext = (id) => Object.keys(DEX).map(Number).filter((x) => DEX[x][2] === id); // 이브이는 3가지
  // 열매 5가지: [키, 그림, 한국어, 독일어]
  const BERRIES = [['strawberry', '🍓', '딸기', 'Erdbeere'], ['apple', '🍎', '사과', 'Apfel'], ['blueberry', '🫐', '블루베리', 'Blaubeere'], ['banana', '🍌', '바나나', 'Banane'], ['pepper', '🌶️', '고추', 'Chili']];
  // 좋아하는 열매 (타입으로): 주면 하트 2개
  const FAV = { fire: 'pepper', water: 'blueberry', ice: 'blueberry', grass: 'apple', bug: 'apple', poison: 'apple', electric: 'banana' };
  const favBerry = (id) => FAV[DEX[id] && DEX[id][4]] || 'strawberry';
  // 알: [-, -, 한국어, 독일어, 나오는 타입들]. 그림은 포켓몬 알(PokeAPI) 무늬 색만 바꾼 poke/egg-{종류}.png. START_EGGS = 처음 고르는 알 (정해진 포켓몬)
  const EGGS = {
    fire: ['hue-rotate(-115deg) saturate(2.2)', '', '불꽃 알', 'Feuer-Ei', ['fire']], water: ['hue-rotate(95deg) saturate(1.8)', '', '물 알', 'Wasser-Ei', ['water', 'ice']],
    grass: ['none', '', '풀 알', 'Pflanzen-Ei', ['grass', 'bug']], electric: ['hue-rotate(-60deg) saturate(2.6) brightness(1.05)', '', '번개 알', 'Blitz-Ei', ['electric']],
    mystery: ['hue-rotate(165deg) saturate(1.6)', '', '신비한 알', 'Geheimnis-Ei', null], gold: ['sepia(1) saturate(5) hue-rotate(-12deg) brightness(1.08)', '', '황금 알', 'Gold-Ei', 'legend'],
  };
  const START_EGGS = { fire: 4, water: 7, grass: 1, electric: 25 };
  const EGG_PRICE = 10;
  const eggHTML = (egg) => `<img class="pk-egg" src="${BASE}poke/egg-${EGGS[egg] ? egg : 'mystery'}.png" alt="" draggable="false">`;
  // 알에서 나올 포켓몬: 그 알 타입의 첫 단계 (전설 빼고), 아직 없는 것 먼저. 황금 알 = 전설
  function hatchPick(egg, have) {
    const types = (EGGS[egg] || EGGS.mystery)[4];
    const all = Object.keys(DEX).map(Number).filter((x) => (types === 'legend' ? DEX[x][3] : !DEX[x][2] && !DEX[x][3] && (!types || types.includes(DEX[x][4]))));
    const fresh = all.filter((x) => !have.has(x)), list = fresh.length ? fresh : all;
    return list[Math.floor(Math.random() * list.length)];
  }
  /* ── 💖 티니핑 (아린 방) ── PING = [id, 한국어, 독일어 화면 이름, 좋아하는 열매, 전설(황금 하트에서만), 하츄핑 몇 기(0 = 변신 없음),
       그림 속 자리 % [머리 가운데 x, 머리 꼭대기 y, 머리 오른쪽 x, 그 높이 y, 발 가운데 x] — 그림에서 자동으로 찾음 (지금은 안 씀)]
     그림은 엄마가 저장한 것 → 배경 투명하게 다듬어 ping/{id}.webp (240px). 하츄핑은 하트 10개마다 다음 기 모습으로 변신,
     다른 티니핑은 변신 없음. 새 그림을 넣으면 여기 한 줄 + ping/ 파일 하나 */
  const PING = [
    ['heartsping1', '하츄핑', 'Heartsping', 'strawberry', 0, 1, [41, 3, 73, 15, 39]],
    ['heartsping2', '하츄핑 2기', 'Heartsping S2', 'strawberry', 0, 2, [48, 3, 86, 15, 51]],
    ['heartsping3', '하츄핑 3기', 'Heartsping S3', 'strawberry', 0, 3, [51, 1, 89, 13, 46]],
    ['heartsping4', '하츄핑 4기', 'Heartsping S4', 'strawberry', 0, 4, [50, 5, 84, 17, 62]],
    ['heartsping5', '하츄핑 5기', 'Heartsping S5', 'strawberry', 0, 5, [45, 7, 84, 19, 40]],
    ['heartsping6', '하츄핑 6기', 'Heartsping S6', 'strawberry', 0, 6, [47, 6, 70, 18, 57]],
    ['aloneping', '홀로핑', 'Aloneping', 'pepper', 0, 0, [47, 16, 78, 28, 49]],
    ['artping', '그림핑', 'Artping', 'blueberry', 0, 0, [59, 3, 94, 15, 42]],
    ['auroraping', '오로라핑', 'Auroraping', 'strawberry', 1, 0, [48, 6, 79, 18, 37]],
    ['balletping', '발레핑', 'Balletping', 'strawberry', 0, 0, [38, 4, 60, 15, 36]],
    ['bebeping', '베베핑', 'Bebeping', 'strawberry', 0, 0, [50, 5, 98, 17, 35]],
    ['blankping', '깜빡핑', 'Blankping', 'pepper', 0, 0, [52, 3, 63, 15, 67]],
    ['bonnyping', '뽀니핑', 'Bonnyping', 'apple', 0, 0, [56, 3, 91, 15, 28]],
    ['buddyping', '짝짝핑', 'Buddyping', 'blueberry', 0, 0, [46, 3, 87, 15, 63]],
    ['chachaping', '차차핑', 'Chachaping', 'apple', 0, 0, [55, 3, 91, 15, 57]],
    ['charmping', '아잉핑', 'Charmping', 'strawberry', 0, 0, [47, 4, 72, 16, 50]],
    ['claireping', '아름핑', 'Claireping', 'strawberry', 0, 0, [47, 11, 88, 23, 55]],
    ['coolping', '덜덜핑', 'Coolping', 'blueberry', 0, 0, [51, 1, 90, 12, 56]],
    ['cozyping', '포근핑', 'Cozyping', 'blueberry', 0, 0, [50, 2, 87, 14, 46]],
    ['curieping', '모야핑', 'Curieping', 'strawberry', 0, 0, [59, 4, 70, 16, 51]],
    ['dadaping', '바로핑', 'Dadaping', 'blueberry', 0, 0, [60, 8, 99, 20, 26]],
    ['dajoping', '다조핑', 'Allmineping', 'pepper', 0, 0, [50, 2, 92, 13, 60]],
    ['dareping', '부투핑', 'Dareping', 'strawberry', 0, 0, [42, 7, 74, 19, 51]],
    ['dianaping', '다이아나핑', 'Dianaping', 'strawberry', 1, 0, [59, 14, 83, 26, 35]],
    ['dreamping', '띠용핑', 'Dreamping', 'blueberry', 0, 0, [56, 4, 100, 16, 47]],
    ['eclipseping', '이클립스핑', 'Eclipseping', 'blueberry', 1, 0, [46, 15, 66, 26, 61]],
    ['egoping', '앙대핑', 'Egoping', 'strawberry', 0, 0, [54, 8, 93, 20, 50]],
    ['floraping', '플라핑', 'Floraping', 'apple', 0, 0, [45, 3, 79, 15, 36]],
    ['fluffyping', '포실핑', 'Fluffyping', 'blueberry', 0, 0, [54, 4, 80, 16, 47]],
    ['freezeping', '꽁꽁핑', 'Freezeping', 'blueberry', 0, 0, [53, 2, 99, 14, 54]],
    ['giftping', '주네핑', 'Giftping', 'strawberry', 0, 0, [61, 2, 91, 14, 54]],
    ['giggleping', '악동핑', 'Giggleping', 'strawberry', 0, 0, [66, 3, 100, 15, 62]],
    ['gogoping', '아자핑', 'Gogoping', 'pepper', 0, 0, [49, 5, 99, 16, 40]],
    ['goodping', '차캐핑', 'Goodping', 'strawberry', 0, 0, [47, 6, 80, 18, 66]],
    ['happying', '해핑', 'Happying', 'strawberry', 0, 0, [53, 3, 93, 15, 49]],
    ['heavyping', '무거핑', 'Heavyping', 'strawberry', 0, 0, [57, 0, 99, 12, 35]],
    ['jellyping', '말랑핑', 'Jellyping', 'strawberry', 0, 0, [54, 2, 90, 14, 61]],
    ['joahping', '조아핑', 'Joahping', 'pepper', 0, 0, [46, 1, 81, 13, 39]],
    ['kikiping', '키키핑', 'Kikiping', 'blueberry', 0, 0, [63, 3, 95, 15, 47]],
    ['ladyping', '공쥬핑', 'Ladyping', 'strawberry', 0, 0, [48, 8, 88, 20, 48]],
    ['lalaping', '라라핑', 'Lalaping', 'strawberry', 0, 0, [53, 3, 96, 15, 63]],
    ['luckyping', '행운핑', 'Luckyping', 'blueberry', 1, 0, [58, 8, 83, 20, 44]],
    ['luvping', '바네핑', 'Luvping', 'strawberry', 0, 0, [55, 2, 92, 14, 32]],
    ['memoping', '메모핑', 'Memoping', 'blueberry', 0, 0, [53, 2, 82, 14, 33]],
    ['mimicping', '따라핑', 'Mimicping', 'strawberry', 0, 0, [46, 5, 93, 16, 37]],
    ['moseyping', '차나핑', 'Moseyping', 'blueberry', 0, 0, [40, 3, 74, 15, 78]],
    ['nanaping', '나나핑', 'Nanaping', 'strawberry', 0, 0, [53, 0, 97, 12, 32]],
    ['narrping', '나르핑', 'Narrping', 'strawberry', 0, 0, [54, 4, 84, 16, 58]],
    ['nonoping', '시러핑', 'Nonoping', 'blueberry', 0, 0, [39, 4, 64, 15, 39]],
    ['noraping', '노라핑', 'Noraping', 'blueberry', 0, 0, [65, 3, 98, 15, 53]],
    ['noriping', '노리핑', 'Noriping', 'strawberry', 0, 0, [51, 13, 88, 25, 35]],
    ['okeydokeyping', '꾸래핑', 'Okeydokeyping', 'blueberry', 0, 0, [48, 2, 77, 13, 58]],
    ['onlyping', '다해핑', 'Onlyping', 'blueberry', 0, 0, [52, 1, 84, 13, 52]],
    ['oppoping', '꺼꿀핑', 'Oppoping', 'blueberry', 0, 0, [41, 2, 66, 14, 26]],
    ['owwping', '아야핑', 'Owwping', 'strawberry', 0, 0, [55, 6, 99, 18, 43]],
    ['patping', '토닥핑', 'Patping', 'apple', 0, 0, [51, 2, 86, 14, 31]],
    ['princeping', '왕자핑', 'Princeping', 'blueberry', 0, 0, [61, 8, 92, 19, 48]],
    ['roarping', '화나핑', 'Roarping', 'strawberry', 0, 0, [35, 8, 63, 20, 41]],
    ['sculptping', '뚝딱핑', 'Sculptping', 'blueberry', 0, 0, [45, 2, 73, 13, 44]],
    ['shashaping', '샤샤핑', 'Shashaping', 'blueberry', 0, 0, [50, 5, 70, 16, 42]],
    ['shimmerping', '빛나핑', 'Shimmerping', 'blueberry', 0, 0, [54, 3, 95, 15, 35]],
    ['shushping', '똑똑핑', 'Shushping', 'blueberry', 0, 0, [50, 7, 85, 18, 45]],
    ['shyping', '부끄핑', 'Shyping', 'blueberry', 0, 0, [39, 2, 75, 13, 56]],
    ['sighping', '아휴핑', 'Sighping', 'apple', 0, 0, [53, 3, 92, 15, 49]],
    ['sleeping', '코자핑', 'Sleeping', 'apple', 0, 0, [48, 2, 84, 13, 49]],
    ['sparkleping', '초롱핑', 'Sparkleping', 'blueberry', 0, 0, [43, 6, 69, 18, 43]],
    ['sparkping', '찌릿핑', 'Sparkping', 'blueberry', 0, 0, [48, 5, 87, 17, 54]],
    ['spookping', '무셔핑', 'Spookping', 'strawberry', 0, 0, [50, 1, 92, 12, 45]],
    ['stickping', '딱풀핑', 'Stickping', 'apple', 0, 0, [42, 3, 83, 15, 63]],
    ['sweetping', '달콤핑', 'Sweetping', 'strawberry', 1, 0, [47, 2, 90, 14, 41]],
    ['tangyping', '새콤핑', 'Tangyping', 'apple', 1, 0, [55, 8, 95, 20, 63]],
    ['teeheeping', '방글핑', 'Teeheeping', 'strawberry', 0, 0, [51, 2, 82, 13, 49]],
    ['tickleping', '까르핑', 'Tickleping', 'apple', 0, 0, [61, 4, 99, 15, 49]],
    ['tidyping', '싹싹핑', 'Tidyping', 'pepper', 0, 0, [47, 2, 80, 14, 40]],
    ['timidping', '쪼꼼핑', 'Timidping', 'blueberry', 0, 0, [47, 2, 85, 14, 61]],
    ['toyping', '토이핑', 'Toyping', 'blueberry', 0, 0, [51, 4, 92, 15, 40]],
    ['trueping', '솔찌핑', 'Trueping', 'pepper', 0, 0, [39, 14, 69, 26, 57]],
    ['trustping', '믿어핑', 'Trustping', 'blueberry', 0, 0, [55, 4, 87, 16, 53]],
    ['tutuping', '투투핑', 'Tutuping', 'strawberry', 0, 0, [54, 3, 89, 15, 47]],
    ['tweetping', '떠벌핑', 'Tweetping', 'blueberry', 0, 0, [43, 6, 76, 18, 57]],
    ['twinkleping', '빤짝핑', 'Twinkleping', 'blueberry', 0, 0, [56, 5, 84, 17, 66]],
    ['wannabeping', '또까핑', 'Wannabeping', 'strawberry', 0, 0, [47, 3, 84, 15, 60]],
    ['weeping', '주르핑', 'Weeping', 'apple', 0, 0, [54, 6, 97, 18, 39]],
    ['wishping', '소원핑', 'Wishping', 'blueberry', 0, 0, [48, 3, 87, 15, 51]],
    ['wonderping', '원더핑', 'Wonderping', 'strawberry', 0, 0, [37, 7, 64, 19, 42]],
    ['yummyping', '맛나핑', 'Yummyping', 'strawberry', 0, 0, [43, 5, 67, 17, 58]],
    ['zipping', '씽씽핑', 'Zipping', 'blueberry', 0, 0, [53, 2, 98, 14, 40]]
  ];
  const PINGD = Object.fromEntries(PING.map((r) => [r[0], r]));
  const PING_EGGS = { heart: ['반짝 하트', 'Glitzerherz'], gold: ['황금 하트', 'Goldherz'] };
  const pingHeart = (egg) => {
    const g = egg === 'gold', id = g ? 'pgh-g' : 'pgh-p';
    return `<svg class="pk-egg pg-heart" viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${g ? '#FFF1A8' : '#FFD3E6'}"/><stop offset="1" stop-color="${g ? '#F2B21B' : '#FF5FA2'}"/></linearGradient></defs>`
      + `<path d="M50 90C20 68 5 50 5 32 5 17 17 7 30 7c9 0 16 5 20 13 4-8 11-13 20-13 13 0 25 10 25 25 0 18-15 36-45 58z" fill="url(#${id})" stroke="#fff" stroke-width="4"/>`
      + `<ellipse cx="28" cy="27" rx="10" ry="6" fill="#fff" opacity=".75" transform="rotate(-35 28 27)"/><path d="M71 26l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#fff"/><path d="M58 60l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" fill="#fff" opacity=".85"/></svg>`;
  };
  // 하트 알에서 나올 티니핑: 아직 없는 것 먼저 (하츄핑 · 전설 빼고). 황금 하트 = 전설
  function pingHatch(egg, have) {
    const all = PING.filter((r) => !r[5] && r[4] === (egg === 'gold' ? 1 : 0)).map((r) => r[0]);
    const fresh = all.filter((x) => !have.has(x)), list = fresh.length ? fresh : all;
    return list[Math.floor(Math.random() * list.length)];
  }
  const pingNext = (id) => { const n = PINGD[id] && PINGD[id][5]; return n && PINGD[`heartsping${n + 1}`] ? [`heartsping${n + 1}`] : []; };
  // 아이별 캐릭터 세트 — 방 화면(poke-room.js)은 이것만 보고 그림
  const SETS = {
    poke: { key: 'poke', name: pokeName, art: pokeArt, walk: pokeWalk, valid: (p) => !!DEX[p], next: pokeNext, evoNeed: (p) => (pokeStage(p) === 1 ? 10 : 15), fav: favBerry,
      dex: Array.from({ length: POKE_N }, (_, i) => i + 1), eggs: ['fire', 'water', 'grass', 'electric', 'mystery'], startEggs: START_EGGS, start: null,
      eggName: (egg, lang) => (EGGS[egg] || EGGS.mystery)[lang === 'de' ? 3 : 2], eggHTML, hatch: hatchPick, shiny: 0.1, room: '' },
    ping: { key: 'ping', name: (id, lang) => (PINGD[id] ? PINGD[id][lang === 'de' ? 2 : 1] : ''), art: (id) => `${BASE}ping/${id}.webp`, walk: (id) => `${BASE}ping/${id}.webp`,
      valid: (p) => !!PINGD[p], next: pingNext, evoNeed: () => 10, fav: (id) => (PINGD[id] ? PINGD[id][3] : 'strawberry'),
      dex: PING.map((r) => r[0]), eggs: ['heart'], startEggs: null, start: 'heartsping1',
      eggName: (egg, lang) => (PING_EGGS[egg] || PING_EGGS.heart)[lang === 'de' ? 1 : 0], eggHTML: pingHeart, hatch: pingHatch, shiny: 0,
      friend: true, room: 'princess' }, // 변신 없는 티니핑: 하트 5개마다 친해지기 단계 💗 (코인은 없음), 💗3부터 반짝 빛 · 춤
  };
  const charSet = (kid) => SETS[kid === 'arin' ? 'ping' : 'poke'];
  // 키우기 방 자료가 들어 있는 칸: kids.{k}.room (2026-11-15 밤 엄마 요청으로 모두 새로 시작 — 예전 kids.{k}.poke 는 안 씀)
  const ROOM = 'room';
  // 오늘 미션 선물: 열매 2/3, 코인 1/3. d = 2000 + 열매 번호, 2100 = 코인
  // 매일 미션 선물 (2026-11-15 엄마: 코인이 너무 느려서) = 열매 1개 + 🪙 코인 1개. d = 2000 + 열매 번호 (예전 2100 = 코인만)
  // 코인은 같은 스티커 id 뒤에 'c' 를 붙여 가방에: items.{id} = 열매, items.{id}c = 'coin'
  const newRewardD = () => 2000 + Math.floor(Math.random() * BERRIES.length);
  const rewardItem = (d) => (d === 2100 ? 'coin' : d >= 2000 && BERRIES[d - 2000] ? BERRIES[d - 2000][0] : '');
  const rewardIcon = (d) => (d === 2100 ? '🪙' : BERRIES[d - 2000] ? BERRIES[d - 2000][1] : '⭐');
  const rewardLabel = (d, lang) => (d === 2100 ? (lang === 'de' ? 'Münze' : '코인') : BERRIES[d - 2000] ? BERRIES[d - 2000][lang === 'de' ? 3 : 2] : '');
  const rewardSVG = (d) => `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" fill="${d === 2100 ? '#FFE9A8' : '#FFE1E8'}" stroke="${d === 2100 ? '#F0B400' : '#FF9EB5'}" stroke-width="4"/>
    <text x="50" y="52" text-anchor="middle" dominant-baseline="central" font-size="56">${rewardIcon(d)}</text></svg>`;
  // 미션 완료 스티커 (요일 칸 · 황금 스티커 안): 포켓몬 = 볼 5가지, 아린(티니핑) = 반짝 하트 보석 5가지
  const BALLS = [ // [위, 아래, 가운데 줄, 무늬]
    ['#E8343A', '#fff', '#2B2B2B', ''],
    ['#2F7BE0', '#fff', '#2B2B2B', '<path d="M17 30c4-9 10-14 18-17l-2 15zM83 30c-4-9-10-14-18-17l2 15z" fill="#E8343A"/>'],
    ['#2B2B2B', '#fff', '#2B2B2B', '<path d="M23 44l6-26 8 3-2 23zM77 44l-6-26-8 3 2 23z" fill="#FFD23F"/>'],
    ['#F7F7F7', '#fff', '#E8343A', ''],
    ['#7B4BC4', '#fff', '#2B2B2B', '<circle cx="27" cy="31" r="7" fill="#F06CB4"/><circle cx="73" cy="31" r="7" fill="#F06CB4"/><path d="M40 33V19l10 9 10-9v14" stroke="#fff" stroke-width="4" fill="none" stroke-linejoin="round"/>'],
  ];
  const ballSVG = (v) => { const [t, b, l, x] = BALLS[v] || BALLS[0];
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" fill="${b}" stroke="#2B2B2B" stroke-width="5"/><path d="M8.5 50a41.5 41.5 0 0 1 83 0z" fill="${t}"/>${x}`
      + `<path d="M7 50h86" stroke="${l}" stroke-width="7"/><circle cx="50" cy="50" r="13" fill="#fff" stroke="${l}" stroke-width="5"/><circle cx="50" cy="50" r="6" fill="#fff" stroke="#ccc" stroke-width="2"/>`
      + `<ellipse cx="31" cy="27" rx="9" ry="5" fill="#fff" opacity=".55" transform="rotate(-32 31 27)"/></svg>`; };
  const GEMS = [['#FFC2DD', '#FF4F98'], ['#E2CCFF', '#9A5BFF'], ['#C4F5EA', '#22BFA0'], ['#CDE6FF', '#3D96F5'], ['#FFF0B0', '#F2A516']];
  const gemSVG = (v) => { const [a, b] = GEMS[v] || GEMS[0], id = `gm${v}`;
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>`
      + `<path d="M50 92C19 70 5 52 5 33 5 18 17 8 30 8c9 0 16 5 20 13 4-8 11-13 20-13 13 0 25 10 25 25 0 19-14 37-45 59z" fill="url(#${id})" stroke="#fff" stroke-width="5"/>`
      + `<path d="M50 21 35 40l15 38 15-38z" fill="#fff" opacity=".22"/><ellipse cx="28" cy="28" rx="10" ry="6" fill="#fff" opacity=".7" transform="rotate(-35 28 28)"/>`
      + `<path d="M74 22l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#fff"/><path d="M60 62l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" fill="#fff" opacity=".85"/></svg>`; };
  const missionSVG = (kid, d) => { const v = d >= 2000 && d < 2005 ? d - 2000 : 0; return kid === 'arin' ? gemSVG(v) : ballSVG(v); };
  const rewardText = (d, lang) => (d === 2100 ? `🪙 ${rewardLabel(d, lang)}` : `${rewardIcon(d)} ${rewardLabel(d, lang)} + 🪙 ${lang === 'de' ? 'Münze' : '코인'}`);
  const stickerSVG = (kid, d) => (d >= 2000 ? missionSVG(kid, d) : kid === 'arin' ? fairySVG(d) : monsterSVG(d));
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
    mission: ['🎯', '오늘의 미션 완료', 'Tagesmission geschafft'],
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

  /* ── 🎯 오늘의 미션: 그날 할 일을 다 하면 스티커 1장 ──
     kids.{k}.missions = [{ id: 'brushAM', wd?: true(평일만) } | { id: 'c…', text, src?, wd? }]  (없으면 아래 기본 목록)
     kids.{k}.mdone.{YYYY-MM-DD} = { [미션 id]: true, got?: 받은 스티커 id, off?: 쉬는 날, sick?: 아픈 날(일정에서 자동) } */
  const MISSIONS = {
    brushAM: ['🪥', '아침 양치', 'Zähne putzen (morgens)'], brushPM: ['🌙', '저녁 양치', 'Zähne putzen (abends)'],
    bag: ['🎒', '가방 챙기기', 'Schultasche packen'], study: ['📚', '공부', 'Lernen'], dress: ['👗', '혼자 옷 입기', 'Allein anziehen'],
    toys: ['🧸', '장난감 정리', 'Spielzeug aufräumen'], clothes: ['🧺', '벗은 옷 정리', 'Kleidung wegräumen'],
    read: ['📖', '책 읽기', 'Lesen'], music: ['🎹', '악기 연습', 'Instrument üben'], bed: ['🛏️', '이불 정리', 'Bett machen'],
    table: ['🍽️', '식탁 정리 돕기', 'Tisch abräumen'], shoes: ['👟', '신발 정리', 'Schuhe aufräumen'],
    sleep12: ['🌙', '어젯밤 12시 전에 잠', 'Gestern vor 0 Uhr geschlafen'], bedSleep: ['🛏️', '어젯밤 침대에서 잠', 'Gestern im Bett eingeschlafen'],
    sport: ['🏃', '운동', 'Sport'], deutsch: ['📝', '독일어 공부', 'Deutsch lernen'], noBeer: ['🧃', '술 안 마시기', 'Kein Alkohol'],
  };
  const MISSION_DEFAULT = {
    davin: [{ id: 'brushAM' }, { id: 'bag', wd: true }, { id: 'study' }, { id: 'toys' }, { id: 'clothes' }],
    arin: [{ id: 'brushAM' }, { id: 'dress' }, { id: 'toys' }, { id: 'clothes' }],
    mom: [{ id: 'sleep12' }, { id: 'sport' }, { id: 'deutsch' }],
    dad: [{ id: 'bedSleep' }, { id: 'sport' }, { id: 'noBeer' }],
  };
  const missionsOf = (kidData, k) => ((kidData && Array.isArray(kidData.missions)) ? kidData.missions : (MISSION_DEFAULT[k] || [])).filter((x) => x && x.id);
  const dowOf = (key) => { const [y, m, d] = key.split('-').map(Number); return new Date(y, m - 1, d).getDay(); };
  const isWeekday = (key) => { const w = dowOf(key); return w >= 1 && w <= 5; };
  // 미션은 매일 (월~일). '평일만'(wd) 미션은 주말에 빠짐 — 예: 가방 챙기기
  const missionsOn = (kidData, k, key) => missionsOf(kidData, k).filter((x) => !x.wd || isWeekday(key));
  function missionState(kidData, k, key) {
    const list = missionsOn(kidData, k, key), day = (kidData && kidData.mdone && kidData.mdone[key]) || {};
    const done = list.filter((x) => day[x.id]).length;
    return { list, day, done, total: list.length, all: list.length > 0 && done === list.length, got: !!day.got };
  }
  /* ── 주간 미션판: 월~일 7칸. 그날 미션을 다 하고 받은 스티커(mdone.{날짜}.got)가 그 요일 칸에 붙음.
     7칸이 다 차면 그 주 🏅 황금 스티커 1개 (kids.{k}.golds.{그 주 월요일} = { at, d }). 황금 스티커 cfg.big(기본 4)개 = 선물(cfg.reward).
     새 판은 cfg.start (그 뒤에 받은 황금 스티커만 셈) ── */
  const WEEK_LABEL = { ko: ['월', '화', '수', '목', '금', '토', '일'], de: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'] };
  const keyOfDate = (x) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
  function weekKeys(key) {
    const [y, m, d] = key.split('-').map(Number), dt = new Date(y, m - 1, d), off = (dt.getDay() + 6) % 7;
    return [0, 1, 2, 3, 4, 5, 6].map((i) => keyOfDate(new Date(y, m - 1, d - off + i)));
  }
  function weekState(kidData, k, today) {
    const keys = weekKeys(today), st = (kidData && kidData.stickers) || {}, md = (kidData && kidData.mdone) || {};
    const days = keys.map((key, i) => {
      // sick = 우리가족 '오늘 일정'에서 그 아이를 🤒 아파요로 넣은 날 (자동으로 쉬는 날처럼 셈)
      const got = md[key] && md[key].got, s = got && st[got], sick = !got && !!(md[key] && md[key].sick);
      const bag = (x) => (kidData[x] && kidData[x].items ? kidData[x].items[got] : '');
      const it = got && !s ? bag(ROOM) || bag('poke') : ''; // 예전 엄마·아빠 방 선물 (스티커 없이 열매/코인만)
      const itD = it === 'coin' ? 2100 : it ? 2000 + BERRIES.findIndex((b) => b[0] === it) : -1;
      const off = !got && (sick || !!(md[key] && md[key].off));
      return { key, i, got: !!got, off, sick, id: got || '', d: s && typeof s.d === 'number' ? s.d : itD >= 2000 ? itD : i,
        status: got ? 'got' : off ? 'off' : key === today ? 'today' : key < today ? 'missed' : 'future' };
    });
    const count = days.filter((x) => x.got).length, offs = days.filter((x) => x.off).length;
    const gold = !!((kidData && kidData.golds) || {})[keys[0]];
    return { keys, days, count, offs, all: count + offs === 7, gold };
  }
  // 오늘 스티커를 붙이면 이번 주 7칸이 다 차는지 (차면 황금 스티커를 같이 줌)
  function weekCompletesToday(kidData, k, today) {
    const W = weekState(kidData, k, today);
    return !W.gold && W.days.every((x) => x.got || x.off || x.key === today);
  }
  // 쉬는 날 표시로 이번 주가 다 차는지 (그날 = 쉬는 날로 바꾸는 날)
  function weekCompletesWithOff(kidData, k, today, offKey) {
    const W = weekState(kidData, k, today);
    return !W.gold && W.keys.includes(offKey) && W.days.every((x) => x.got || x.off || x.key === offKey);
  }
  // 황금 스티커: 이번 판(cfg.start 이후)에 모은 것, 선물까지 몇 개
  function goldState(kidData, k) {
    const c = cfgOf(kidData, k);
    const golds = Object.entries((kidData && kidData.golds) || {}).map(([week, g]) => ({ week, ...g }))
      .filter((g) => (g.at || 0) >= (c.start || 0)).sort((a, b) => (a.at || 0) - (b.at || 0));
    return { c, golds, need: c.big, count: Math.min(golds.length, c.big), gift: golds.length >= c.big };
  }
  const missionIcon = (x) => (MISSIONS[x.id] ? MISSIONS[x.id][0] : x.ic || '⭐');
  /* ── 🎯 미션 아이콘: 직접 그린 귀여운 그림 (이모지 대신). 직접 쓴 미션은 고른 이모지 그대로 ── */
  const MO = '#5A4434', ST = `stroke="${MO}" stroke-width="3"`;
  const mFace = (x, y, s = 1) => `<circle cx="${x - 5 * s}" cy="${y}" r="${2.1 * s}" fill="${MO}"/><circle cx="${x + 5 * s}" cy="${y}" r="${2.1 * s}" fill="${MO}"/>`
    + `<path d="M${x - 2.4 * s} ${y + 3 * s}q${2.4 * s} ${2.6 * s} ${4.8 * s} 0" stroke="${MO}" stroke-width="${1.8 * s}" fill="none"/>`
    + `<ellipse cx="${x - 8.5 * s}" cy="${y + 3 * s}" rx="${2.6 * s}" ry="${1.6 * s}" fill="#FF8FA8" opacity=".7"/><ellipse cx="${x + 8.5 * s}" cy="${y + 3 * s}" rx="${2.6 * s}" ry="${1.6 * s}" fill="#FF8FA8" opacity=".7"/>`;
  const mSleep = (x, y, s = 1) => `<path d="M${x - 7.5 * s} ${y}q${2.4 * s} ${2.4 * s} ${4.8 * s} 0M${x + 2.7 * s} ${y}q${2.4 * s} ${2.4 * s} ${4.8 * s} 0" stroke="${MO}" stroke-width="${1.9 * s}" fill="none"/>`
    + `<ellipse cx="${x - 8.5 * s}" cy="${y + 4 * s}" rx="${2.6 * s}" ry="${1.6 * s}" fill="#FF8FA8" opacity=".7"/><ellipse cx="${x + 8.5 * s}" cy="${y + 4 * s}" rx="${2.6 * s}" ry="${1.6 * s}" fill="#FF8FA8" opacity=".7"/>`;
  const mZz = (x, y) => `<text x="${x}" y="${y}" font-size="11" font-weight="800" font-family="system-ui,sans-serif" fill="#8E7CFF">z</text><text x="${x + 6}" y="${y - 7}" font-size="8" font-weight="800" font-family="system-ui,sans-serif" fill="#8E7CFF">z</text>`;
  const mStar = (x, y, r, c = '#FFD45C') => `<path d="M${x} ${y - r}l${r * .3} ${r * .7} ${r * .7} ${r * .3}-${r * .7} ${r * .3}-${r * .3} ${r * .7}-${r * .3}-${r * .7}-${r * .7}-${r * .3} ${r * .7}-${r * .3}z" fill="${c}"/>`;
  const mBrush = `<g transform="rotate(-32 32 36)"><rect x="6" y="34" width="38" height="9" rx="4.5" fill="#7FD8C8" ${ST}/><rect x="40" y="27" width="16" height="16" rx="5" fill="#fff" ${ST}/>`
    + `<path d="M44 27v-5M48 27v-6M52 27v-5" stroke="#6FB8FF" stroke-width="3.2"/></g><circle cx="47" cy="11" r="5" fill="#E9F7FF" stroke="#9FD3F5" stroke-width="2"/><circle cx="56" cy="17" r="3.5" fill="#E9F7FF" stroke="#9FD3F5" stroke-width="2"/>`;
  const MISSION_SVG = {
    brushAM: mBrush + `<path d="M14 2v3M14 23v3M2 14h3M23 14h3M5.5 5.5l2 2M22.5 5.5l-2 2M5.5 22.5l2-2" stroke="#FFB800" stroke-width="2.6"/><circle cx="14" cy="14" r="6.5" fill="#FFD45C" ${ST}/>`,
    brushPM: mBrush + `<path d="M17 4a10 10 0 1 0 6 17a8 8 0 1 1-6-17z" fill="#FFE27A" ${ST}/>` + mStar(27, 7, 4, '#FFE27A'),
    bag: `<path d="M22 20q0-10 10-10t10 10" fill="none" ${ST}/><rect x="12" y="18" width="40" height="40" rx="13" fill="#FF7A6B" ${ST}/>`
      + `<path d="M12 31q20 7 40 0" fill="none" ${ST}/><rect x="21" y="40" width="22" height="13" rx="5" fill="#FFB15C" ${ST}/>` + mFace(32, 26, .75),
    study: `<rect x="10" y="44" width="44" height="11" rx="3" fill="#6EC6FF" ${ST}/><rect x="14" y="33" width="38" height="11" rx="3" fill="#FFD45C" ${ST}/><rect x="9" y="22" width="40" height="11" rx="3" fill="#FF8FB1" ${ST}/>`
      + `<path d="M46 47v5M48 36v5M42 25v5" stroke="#fff" stroke-width="2.5"/>` + mFace(26, 38, .6) + `<g transform="rotate(35 50 14)"><rect x="46" y="2" width="8" height="22" rx="2" fill="#FFD45C" ${ST}/><path d="M46 24l4 7 4-7z" fill="#F7D9B5" ${ST}/></g>`,
    dress: `<path d="M24 8h16l3 11-5 4 14 31H12l14-31-5-4z" fill="#FFA6C9" ${ST}/><path d="M26 23h12" ${ST}/><path d="M32 31c-3-4-8-1-5 3l5 5 5-5c3-4-2-7-5-3z" fill="#FF5F9E"/>`
      + `<path d="M14 50q9 4 18 0t18 0" fill="none" stroke="#fff" stroke-width="2.5"/>`,
    toys: `<circle cx="16" cy="17" r="8" fill="#D9A066" ${ST}/><circle cx="48" cy="17" r="8" fill="#D9A066" ${ST}/><circle cx="16" cy="17" r="3.5" fill="#F3D2A8"/><circle cx="48" cy="17" r="3.5" fill="#F3D2A8"/>`
      + `<circle cx="32" cy="34" r="21" fill="#D9A066" ${ST}/><ellipse cx="32" cy="42" rx="9" ry="7" fill="#F3D2A8"/><ellipse cx="32" cy="39" rx="3.5" ry="2.5" fill="${MO}"/>`
      + `<circle cx="24" cy="31" r="2.4" fill="${MO}"/><circle cx="40" cy="31" r="2.4" fill="${MO}"/><path d="M29 45q3 2.5 6 0" stroke="${MO}" stroke-width="2" fill="none"/>`
      + `<ellipse cx="18" cy="38" rx="3" ry="2" fill="#FF8FA8" opacity=".7"/><ellipse cx="46" cy="38" rx="3" ry="2" fill="#FF8FA8" opacity=".7"/>`,
    clothes: `<path d="M17 30q-2-14 11-14l5 4 6-4q12 0 10 14z" fill="#8EC5FF" ${ST}/><path d="M44 30q4-12 10-8l-3 8z" fill="#FF8FB1" ${ST}/>`
      + `<path d="M8 29h48l-6 26H14z" fill="#F2C27B" ${ST}/><path d="M12 38h40M14 46h36M24 30l-2 24M40 30l2 24" stroke="#C98F45" stroke-width="2.4"/>`,
    read: `<path d="M6 16v38q14-3 26 3q12-6 26-3V16" fill="#8FD18F" ${ST}/><path d="M32 18q-10-6-23-4v35q13-2 23 4z" fill="#fff" ${ST}/><path d="M32 18q10-6 23-4v35q-13-2-23 4z" fill="#fff" ${ST}/>`
      + `<path d="M14 24q7-1 13 2M14 31q7-1 13 2M37 26q6-3 13-2M37 33q6-3 13-2" stroke="#C9C1B8" stroke-width="2.4" fill="none"/>` + mStar(52, 8, 5) + mStar(12, 7, 3.5, '#FF8FB1'),
    music: `<path d="M24 46V16l26-6v30" fill="none" ${ST}/><path d="M24 16l26-6v8l-26 6z" fill="#A88BFF" ${ST}/>`
      + `<ellipse cx="18" cy="47" rx="8" ry="6.5" fill="#A88BFF" ${ST}/><ellipse cx="44" cy="41" rx="8" ry="6.5" fill="#FF8FB1" ${ST}/>` + mStar(55, 52, 4) + mStar(8, 18, 3.5, '#6EC6FF'),
    bed: `<rect x="6" y="16" width="10" height="38" rx="4" fill="#C99A6B" ${ST}/><rect x="12" y="32" width="46" height="14" rx="4" fill="#fff" ${ST}/>`
      + `<ellipse cx="22" cy="30" rx="8" ry="5" fill="#FFF2B3" ${ST}/><rect x="28" y="28" width="30" height="18" rx="5" fill="#8EC5FF" ${ST}/><path d="M28 35h30" stroke="#fff" stroke-width="2.5"/>`
      + `<path d="M12 46v8M56 46v8" ${ST}/>` + mStar(50, 14, 5) + mStar(40, 9, 3, '#FF8FB1'),
    table: `<path d="M8 15v12q0 5 4.5 5v22M17 15v12q0 5-4.5 5M12.5 15v12" fill="none" ${ST}/><ellipse cx="54" cy="23" rx="5" ry="7.5" fill="#E6E6EA" ${ST}/><path d="M54 31v23" ${ST}/>`
      + `<circle cx="33" cy="37" r="15" fill="#fff" ${ST}/><circle cx="33" cy="37" r="10" fill="#FFE7A3"/>` + mFace(33, 35, .62),
    shoes: `<path d="M26 44q0-12 9-12l5 0q3 5 10 5l4 1q8 2 8 9v3H26z" fill="#7FB8FF" ${ST}/>`
      + `<path d="M4 46q0-13 10-13l6 0q3 6 11 6l5 1q8 2 8 10v4H4z" fill="#FF8FB1" ${ST}/><path d="M4 50h40" stroke="#fff" stroke-width="3"/><path d="M15 38l5 3M18 35l5 3" stroke="#fff" stroke-width="2.2"/>`,
    sleep12: `<path d="M38 8a25 25 0 1 0 18 40a21 21 0 1 1-18-40z" fill="#FFE27A" ${ST}/>` + mSleep(26, 36, .85) + mZz(44, 18),
    bedSleep: `<rect x="4" y="18" width="10" height="36" rx="4" fill="#C99A6B" ${ST}/><rect x="10" y="34" width="50" height="14" rx="4" fill="#fff" ${ST}/>`
      + `<ellipse cx="20" cy="33" rx="9" ry="5.5" fill="#FFF2B3" ${ST}/><circle cx="21" cy="27" r="8" fill="#FFD9B8" ${ST}/>` + mSleep(21, 27, .5)
      + `<rect x="26" y="30" width="34" height="18" rx="5" fill="#A88BFF" ${ST}/><path d="M10 48v6M58 48v6" ${ST}/>` + mZz(38, 20),
    sport: `<rect x="20" y="29" width="24" height="6" rx="3" fill="#B7C0CB" ${ST}/><rect x="7" y="18" width="12" height="28" rx="5" fill="#FF8FB1" ${ST}/><rect x="45" y="18" width="12" height="28" rx="5" fill="#FF8FB1" ${ST}/>`
      + `<rect x="2" y="24" width="6" height="16" rx="3" fill="#FFB8CF" ${ST}/><rect x="56" y="24" width="6" height="16" rx="3" fill="#FFB8CF" ${ST}/>` + mStar(32, 14, 6) + mStar(14, 56, 3.5, '#6EC6FF') + mStar(52, 55, 3.5, '#6EC6FF'),
    deutsch: `<rect x="14" y="6" width="38" height="50" rx="6" fill="#fff" ${ST}/><path d="M17 12h32" stroke="#2B2B2B" stroke-width="3"/><path d="M17 16h32" stroke="#E5484D" stroke-width="3"/><path d="M17 20h32" stroke="#F6C343" stroke-width="3"/>`
      + `<path d="M10 22h8M10 32h8M10 42h8" ${ST}/><text x="33" y="42" text-anchor="middle" font-size="17" font-weight="800" font-family="system-ui,sans-serif" fill="${MO}">Aa</text>`
      + `<g transform="rotate(40 50 46)"><rect x="46" y="32" width="8" height="22" rx="2" fill="#FFD45C" ${ST}/><path d="M46 54l4 7 4-7z" fill="#F7D9B5" ${ST}/></g>`,
    noBeer: `<path d="M40 20V6h8" fill="none" stroke="#FF6F91" stroke-width="4"/><rect x="16" y="18" width="32" height="40" rx="6" fill="#FFB15C" ${ST}/>`
      + `<path d="M16 26h32" ${ST}/><circle cx="32" cy="46" r="7" fill="#FF7A45"/><path d="M32 39q2-4 5-4" stroke="#5FBF6A" stroke-width="2.5" fill="none"/>` + mFace(32, 33, .62),
  };
  const missionIconHTML = (x) => (MISSION_SVG[x.id] ? `<svg class="mi" viewBox="0 0 64 64" aria-hidden="true" stroke-linejoin="round" stroke-linecap="round">${MISSION_SVG[x.id]}</svg>` : `<span class="mi-e">${String(missionIcon(x)).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`)}</span>`); // 직접 쓴 미션 이모지는 글자로만
  const missionLabel = (x, lang) => (MISSIONS[x.id] ? MISSIONS[x.id][lang === 'de' ? 2 : 1] : (x.src && x.src !== lang && x.tr ? x.tr : (x.text || '')));

  /* ── 📚 다빈 시간표 (1d 반). kids.davin.timetable = { mon: [6교시], … } — 우리가족 앱 설정에서 고침, 우리집 한눈에 오늘 일정 아래에 보임 ── */
  const TT_TIMES = [['8:00', '8:45'], ['8:45', '9:30'], ['9:50', '10:35'], ['10:35', '11:20'], ['11:35', '12:20'], ['12:20', '13:05']];
  const TT_DEFAULT = {
    mon: ['GU', 'GU', 'Sport', 'FöD/GU', 'GU', ''], tue: ['GU', 'GU', 'WG', 'GU', 'GU', 'Sport'], wed: ['GU', 'GU', 'GU', 'GU', '', ''],
    thu: ['GU', 'GU', 'GU', 'GU', '(D-Plus)', ''], fri: ['Rel', 'Rel', 'GU', 'GU', 'GU', ''],
  };
  // 과목: [그림, 한국어, 독일어]. 괄호로 시작하면 일부만 (흐리게, 끝나는 시간에 안 셈)
  const SUBJECTS = {
    GU: ['📖', '수업', 'GU'], Sport: ['🤸', '체육', 'Sport'], WG: ['✂️', '만들기', 'WG'], 'FöD/GU': ['🔤', '독일어', 'FöD/GU'],
    '(D-Plus)': ['🔤', '독일어+', 'D-Plus'], Rel: ['🙏', '종교·윤리', 'Reli/Ethik'], Mu: ['🎵', '음악', 'Musik'], Ku: ['🎨', '미술', 'Kunst'],
    Eng: ['🔠', '영어', 'Englisch'], Ma: ['🔢', '수학', 'Mathe'], De: ['📝', '독일어', 'Deutsch'], Schwimmen: ['🏊', '수영', 'Schwimmen'],
  };
  const ttOf = (kidData) => (kidData && kidData.timetable && typeof kidData.timetable === 'object') ? { ...TT_DEFAULT, ...kidData.timetable } : TT_DEFAULT;

  window.FamilyStickers = { TT_TIMES, TT_DEFAULT, SUBJECTS, ttOf, weekCompletesWithOff, monsterSVG, fairySVG, stickerSVG, STICKER_N, giftSVG, bigSVG, WHY, tone, SND, cfgOf, stickersOf, boardOf, progressOf,
    BASE, ROOM, PING, charSet, DEX, POKE_N, pokeName, pokeArt, pokeWalk, pokeStage, pokeNext, BERRIES, favBerry, EGGS, START_EGGS, EGG_PRICE, eggHTML, hatchPick, newRewardD, rewardText, rewardItem, rewardIcon, rewardLabel, rewardSVG,
    MISSIONS, MISSION_DEFAULT, missionsOf, missionsOn, missionState, missionIcon, missionIconHTML, missionLabel, isWeekday, weekKeys, weekState, WEEK_LABEL, weekCompletesToday, goldState };
})();
