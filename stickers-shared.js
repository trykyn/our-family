/* 칭찬 스티커 공통 파일 — 우리가족 앱과 우리집 한눈에가 함께 씀 (trykyn.github.io/our-family/stickers-shared.js).
   여기 있는 것(스티커 그림 · 칭찬 이유 · 소리 · 개수 계산 규칙)을 고치면 두 앱에 한 번에 적용됨.
   스티커 자료는 가족 문서 kids.{davin|arin} 에 저장:
     stickers.{id} = { at, d(그림 번호), why('@brush' 또는 직접 쓴 글), src?, tr?, by }
     cfg = { small, big, reward, bigReward, start }   ← start 이후에 붙인 스티커가 지금 판
     lock = { on, pin }  (kids.lock: 엄마·아빠 비밀번호 2자리)
   다빈 = 동글동글 속성 몬스터, 아린 = 반짝이 하트 요정 (직접 그린 SVG — 예전 스티커).
   🥚 포켓몬 알 키우기 (다빈·아린·엄마): 오늘 미션을 다 하면 선물 상자에서 열매(5가지) 또는 🪙 코인이 나옴.
     그날 스티커의 d = 2000 + 열매 번호 / 2100 = 코인 (스티커판에도 그 그림). 받은 것은 kids.{k}.poke.items.{스티커 id} = 'apple' | 'coin' …
     kids.{k}.poke = { start, items: {id: 열매|'coin'}, mons: {id: { egg, p?(태어난 포켓몬), f(하트), s?(반짝이), at }}, deco: {가구: {x, y, off?}}, home?: [방에 나온 id], gp: {황금 주: 1} }
     그림은 PokeAPI에서 받아 poke/ (art = 도감, walk/walk-s = 방에서 걷는 그림). 방 화면은 poke-room.js */
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
  // 알: [그림 색, 무늬 색, 한국어, 독일어, 나오는 타입들]. start = 처음 고르는 알 (정해진 포켓몬)
  const EGGS = {
    fire: ['#FF7A45', '#FFD23F', '불꽃 알', 'Feuer-Ei', ['fire']], water: ['#4DA8FF', '#DDF1FF', '물 알', 'Wasser-Ei', ['water', 'ice']],
    grass: ['#5CC46A', '#E6F7A8', '풀 알', 'Pflanzen-Ei', ['grass', 'bug']], electric: ['#FFD93D', '#FF9F1C', '번개 알', 'Blitz-Ei', ['electric']],
    mystery: ['#C79BF2', '#FFFFFF', '신비한 알', 'Geheimnis-Ei', null], gold: ['#FFC928', '#FFF6C2', '황금 알', 'Gold-Ei', 'legend'],
  };
  const START_EGGS = { fire: 4, water: 7, grass: 1, electric: 25 };
  const EGG_PRICE = 10;
  const eggSVG = (egg) => { const [c, sp] = EGGS[egg] || EGGS.mystery; return `<svg viewBox="0 0 100 120" aria-hidden="true"><path d="M50 4C25 4 8 48 8 74c0 26 19 42 42 42s42-16 42-42C92 48 75 4 50 4z" fill="${c}" stroke="rgba(0,0,0,.18)" stroke-width="3"/>
    <ellipse cx="33" cy="50" rx="9" ry="12" fill="${sp}" opacity=".9"/><ellipse cx="66" cy="72" rx="12" ry="9" fill="${sp}" opacity=".9"/><ellipse cx="40" cy="92" rx="7" ry="6" fill="${sp}" opacity=".9"/>
    <path d="M28 30c4-8 9-13 15-15" stroke="#fff" stroke-width="5" opacity=".55" fill="none" stroke-linecap="round"/>${egg === 'gold' ? '<path d="m72 22 2.4 5 5.6.8-4 4 1 5.6-5-2.7-5 2.7 1-5.6-4-4 5.6-.8z" fill="#fff"/>' : ''}</svg>`; };
  // 알에서 나올 포켓몬: 그 알 타입의 첫 단계 (전설 빼고), 아직 없는 것 먼저. 황금 알 = 전설
  function hatchPick(egg, have) {
    const types = (EGGS[egg] || EGGS.mystery)[4];
    const all = Object.keys(DEX).map(Number).filter((x) => (types === 'legend' ? DEX[x][3] : !DEX[x][2] && !DEX[x][3] && (!types || types.includes(DEX[x][4]))));
    const fresh = all.filter((x) => !have.has(x)), list = fresh.length ? fresh : all;
    return list[Math.floor(Math.random() * list.length)];
  }
  // 오늘 미션 선물: 열매 2/3, 코인 1/3. d = 2000 + 열매 번호, 2100 = 코인
  const newRewardD = () => (Math.random() < 1 / 3 ? 2100 : 2000 + Math.floor(Math.random() * BERRIES.length));
  const rewardItem = (d) => (d === 2100 ? 'coin' : d >= 2000 && BERRIES[d - 2000] ? BERRIES[d - 2000][0] : '');
  const rewardIcon = (d) => (d === 2100 ? '🪙' : BERRIES[d - 2000] ? BERRIES[d - 2000][1] : '⭐');
  const rewardLabel = (d, lang) => (d === 2100 ? (lang === 'de' ? 'Münze' : '코인') : BERRIES[d - 2000] ? BERRIES[d - 2000][lang === 'de' ? 3 : 2] : '');
  const rewardSVG = (d) => `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" fill="${d === 2100 ? '#FFE9A8' : '#FFE1E8'}" stroke="${d === 2100 ? '#F0B400' : '#FF9EB5'}" stroke-width="4"/>
    <text x="50" y="52" text-anchor="middle" dominant-baseline="central" font-size="56">${rewardIcon(d)}</text></svg>`;
  const stickerSVG = (kid, d) => (d >= 2000 ? rewardSVG(d) : kid === 'arin' ? fairySVG(d) : monsterSVG(d));
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
    water: ['💧', '물 마시기', 'Wasser trinken'], move: ['🚶', '산책·운동', 'Bewegung'], deutsch: ['📝', '독일어 공부', 'Deutsch lernen'],
  };
  const MISSION_DEFAULT = {
    davin: [{ id: 'brushAM' }, { id: 'bag', wd: true }, { id: 'study' }, { id: 'toys' }, { id: 'clothes' }],
    arin: [{ id: 'brushAM' }, { id: 'dress' }, { id: 'toys' }, { id: 'clothes' }],
    mom: [{ id: 'water' }, { id: 'move' }, { id: 'deutsch' }],
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
      const off = !got && (sick || !!(md[key] && md[key].off));
      return { key, i, got: !!got, off, sick, id: got || '', d: s && typeof s.d === 'number' ? s.d : i,
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
    BASE, DEX, POKE_N, pokeName, pokeArt, pokeWalk, pokeStage, pokeNext, BERRIES, favBerry, EGGS, START_EGGS, EGG_PRICE, eggSVG, hatchPick, newRewardD, rewardItem, rewardIcon, rewardLabel, rewardSVG,
    MISSIONS, MISSION_DEFAULT, missionsOf, missionsOn, missionState, missionIcon, missionLabel, isWeekday, weekKeys, weekState, WEEK_LABEL, weekCompletesToday, goldState };
})();
