import { env } from "@/env.mjs";
import { createSupabaseServerClient } from "@/libs/supabase/server";

export const dynamic = "force-dynamic"; // defaults to force-static

const ZIGSAW_API_ENDPOINT = "https://api.jigsawstack.com/v1/web/scrape";
const getScrapeUrl = (page: number) =>
  `http://www.kpga7330.com/info/club.php?bmode=list&page=20&page=${page}`;

const ScrapedCourses = [
  {
    name: "가곡파크골프장",
    address: "경상남도 밀양시 가곡동 743-2",
    hole_count: "9",
  },
  {
    name: "가산파크골프장",
    address: "경상남도 양산시 동면 가산리807",
    hole_count: "36",
  },
  {
    name: "가창파크골프장",
    address: "대구광역시 달성군 가창면 대일리 342(가창체육공원 대일교차로)",
    hole_count: "18",
  },
  {
    name: "가평파크골프장",
    address: "경기도 가평군 청평면 대성리 388-13",
    hole_count: "36",
  },
  {
    name: "강남파크골프장",
    address: "경상북도 안동시 정상동 779",
    hole_count: "27",
  },
  {
    name: "강동파크골프장",
    address: "서울특별시 강동구 천호동 481-6 (한강고수부지, 광진교)",
    hole_count: "9",
  },
  {
    name: "강릉파크골프장",
    address: "강원도 강릉시 입암동 572-3번지",
    hole_count: "18",
  },
  {
    name: "강변파크골프장",
    address: "대구광역시 북구 서변동 1506 강변축구장 옆",
    hole_count: "45",
  },
  {
    name: "강창파크골프장",
    address: "대구광역시 달성군 다사읍 매곡리 91",
    hole_count: "18",
  },
  {
    name: "강창학파크골프장",
    address: "제주특별자치도 서귀포시 강정동 1353",
    hole_count: "18",
  },
  {
    name: "거제파크골프장",
    address: "경상남도 거제시 거제면 스포츠파크내",
    hole_count: "27",
  },
  {
    name: "거창강변파크골프장(3구장)",
    address: "경상남도 거창군 거창읍 대평리 강변",
    hole_count: "18",
  },
  {
    name: "거창파크골프장(제1구장)",
    address: "경상남도 거창군 거창읍 심소정길 39-36",
    hole_count: "18",
  },
  {
    name: "거창파크골프장(제2구장)",
    address: "경상남도 거창군 심소정길 39-36",
    hole_count: "18",
  },
  {
    name: "거창파크골프장(제4구장)",
    address: "경상남도 거창군 거창읍 심소정길 강변",
    hole_count: "18",
  },
  {
    name: "거창파크골프장(제6구장)",
    address: "경상남도 거창군 가조면 일부리 1121-1",
    hole_count: "9",
  },
  {
    name: "경산파크골프장",
    address: "경상북도 경산시 강변동로 369",
    hole_count: "18",
  },
  {
    name: "경주파크골프장",
    address: "경상북도 경주시 석장동1169-1",
    hole_count: "18",
  },
  {
    name: "계룡시파크골프장",
    address: "충청남도 계룡시 신도안면 정장리 6",
    hole_count: "18",
  },
  {
    name: "고금파크골프장",
    address: "전남 완도군 고금면 농산리 759-1",
    hole_count: "9",
  },
  {
    name: "고로파크골프장",
    address: "대구광역시 군위군 삼국유사면 석산리 560",
    hole_count: "18",
  },
  {
    name: "고산파크골프장",
    address: "전라북도 완주군 고산면 읍내리 902 고산체육공원 내",
    hole_count: "9",
  },
  {
    name: "고성군파크골프장",
    address: "강원도 고성군 토성면 도원리 115-27",
    hole_count: "18",
  },
  {
    name: "고아파크골프장",
    address: "경상북도 구미시 고아읍 예강리 695-1",
    hole_count: "36",
  },
  {
    name: "고창스포츠타운파크골프장",
    address: "전라북도 고창군 고창읍 월암리 407-2 (고창스포츠타운내)",
    hole_count: "18",
  },
  {
    name: "곡강천파크골프장",
    address: "경상북도 포항시 북구 흥해읍 용전리965",
    hole_count: "36",
  },
  {
    name: "곡교천파크골프장",
    address: "충청남도 아산시 권곡동 331-1",
    hole_count: "18",
  },
  {
    name: "곡성동악파크골프장",
    address: "전라남도 곡성군 곡성읍 교촌리47",
    hole_count: "9",
  },
  {
    name: "곰나루파크골프장",
    address: "충청남도 공주시 웅진동 722",
    hole_count: "18",
  },
  {
    name: "공촌유수지파크골프장",
    address: "인천광역시 서구 첨단서로 130 공촌유수지체육시설",
    hole_count: "18",
  },
  {
    name: "과학관공원파크골프장",
    address: "대구광역시 달성군 유가읍 상리 916-1",
    hole_count: "9",
  },
  {
    name: "광산구 서봉파크골프장",
    address: "광주광역시 광산구 서봉동 205-6",
    hole_count: "36",
  },
  {
    name: "광석골파크골프장",
    address: "경상남도 창원시 진해구 장천동 765번지",
    hole_count: "6",
  },
  {
    name: "광양시파크골프장",
    address: "전라남도 광양시 광양읍 강변동길 216",
    hole_count: "18",
  },
  {
    name: "광주시파크골프장",
    address: "경기도 광주시 경안동 청석공원 내 파크골프장",
    hole_count: "18",
  },
  {
    name: "괴산파크골프장",
    address: "충북 괴산군 괴산읍 임꺽정로 222",
    hole_count: "18",
  },
  {
    name: "구례군파크골프장",
    address: "전라남도 구례군 서시천로 106",
    hole_count: "9",
  },
  {
    name: "구로 안양천 18홀 파크골프장",
    address: "서울특별시 구로구 구로동 621-8 교척교 하단 우측",
    hole_count: "18",
  },
  {
    name: "구로 안양천 9홀 파크골프장",
    address: "서울특별시 구로구 신도림동 271-84 도림천역 부근",
    hole_count: "9",
  },
  {
    name: "구리시파크골프장",
    address: "경기도 구리시 수택동 왕숙천 구리시환경사무소",
    hole_count: "9",
  },
  {
    name: "구미파크골프장",
    address: "경상북도 구미시 낙동제방길 200 낙동강체육공원 내",
    hole_count: "54",
  },
  {
    name: "구지1호근린공원 파크골프장",
    address: "대구광역시 달성군 구지면 내리 840 산업단지1호근린공원",
    hole_count: "18",
  },
  {
    name: "구지평촌파크골프장",
    address: "대구광역시 달성군 구지면 평촌리 1-10",
    hole_count: "18",
  },
  {
    name: "군북파크골프장",
    address: "경상남도 함안군 군북면 사도리1306 일원",
    hole_count: "36",
  },
  {
    name: "군산파크골프장",
    address: "전라북도 군산시 수송동 851",
    hole_count: "18",
  },
  {
    name: "군위파크골프장",
    address: "대구광역시 군위군 군위읍 내량길 28-60",
    hole_count: "18",
  },
  {
    name: "군포시파크골프장",
    address: "경기도 군포시 수변공원내",
    hole_count: "9",
  },
  {
    name: "금강파크골프장",
    address: "세종특별자치시 세종동 747-321",
    hole_count: "36",
  },
  {
    name: "금산군파크골프장",
    address: "충청남도 금산군 제원면 수당리 986-1",
    hole_count: "18",
  },
  {
    name: "금서파크골프장",
    address: "경상남도 산청군 금서면 동의보감로 645",
    hole_count: "9",
  },
  {
    name: "금성파크골프장",
    address: "경상북도 의성군 금성면 탑운길99",
    hole_count: "9",
  },
  {
    name: "금소파크골프장",
    address: "경상북도 안동시 임하면 금소리 생태공원",
    hole_count: "18",
  },
  {
    name: "금천구 한내천파크골프장",
    address: "서울특별시 금천구 가산동 557-2",
    hole_count: "18",
  },
  {
    name: "기장파크골프장",
    address: "부산광역시 기장군 정관읍 모전리677 물빛공원 내",
    hole_count: "6",
  },
  {
    name: "김천파크골프장",
    address: "경상북도 김천시 모암동 30",
    hole_count: "9",
  },
  {
    name: "김포레코파크골프장",
    address: "경기도 김포시 걸포동2-81",
    hole_count: "9",
  },
  {
    name: "나리공원파크골프장",
    address: "경기도 양주시 광사동 나리공원 내",
    hole_count: "18",
  },
  {
    name: "남구 대공원 파크골프장",
    address: "울산광역시 남구 대공원로 94",
    hole_count: "18",
  },
  {
    name: "남구 태화강 파크골프장",
    address: "울산광역시 남구 신정동 391",
    hole_count: "36",
  },
  {
    name: "남구파크골프장",
    address: "대구광역시 남구 봉덕동 산128-1",
    hole_count: "9",
  },
  {
    name: "남악파크골프장",
    address: "전라남도 무안군 심향읍 남악리 2597",
    hole_count: "18",
  },
  {
    name: "남양주장애인파크골프장",
    address: "경기도 남양주시 별내동910",
    hole_count: "9",
  },
  {
    name: "남양주파크골프장",
    address: "경기도 남양주시 다산동739 다산근린공원 앞 왕숙천",
    hole_count: "18",
  },
  {
    name: "남울진파크골프장",
    address: "울진군 평해읍 평해리 548-4",
    hole_count: "9",
  },
  {
    name: "남원파크골프장",
    address: "전라북도 남원시 춘향골 체육공원내",
    hole_count: "18",
  },
  {
    name: "남해파크골프장",
    address: "경상남도 남해군 서면 스포츠파크길 15 남해스포츠파크 내",
    hole_count: "18",
  },
  {
    name: "녹송파크골프장",
    address: "강원도 정선군 정선읍 봉양리37-3",
    hole_count: "18",
  },
  {
    name: "논공 위천파크골프장",
    address: "대구광역시 달성군 논공읍 위천리 646",
    hole_count: "18",
  },
  {
    name: "논산시파크골프장",
    address: "충청남도 논산시 대교동 319-39번지",
    hole_count: "9",
  },
  {
    name: "다사파크골프장",
    address: "대구광역시 달성군 다사읍 매곡리 344-3 금호강변 세천교 밑",
    hole_count: "36",
  },
  {
    name: "다산파크골프장",
    address: "경상북도 고령군 다산면 호촌리 30",
    hole_count: "18",
  },
  {
    name: "다인문암파크골프장",
    address: "경상북도 의성군 다인면 삼분2길259",
    hole_count: "9",
  },
  {
    name: "단북파크골프장",
    address: "경상북도 의성군 단북면 당북다인로 168",
    hole_count: "9",
  },
  {
    name: "단성(묵곡)파크골프장",
    address: "경상남도 산청군 단성면 묵곡 생태숲(겁외사)",
    hole_count: "18",
  },
  {
    name: "단양파크골프장",
    address: "충청북도 단양군 단양읍 별곡리 92 단양생태체육공원 내",
    hole_count: "18",
  },
  {
    name: "달서 강창파크골프장",
    address: "대구광역시 달서구 파호동 401-2",
    hole_count: "27",
  },
  {
    name: "달성보파크골프장",
    address: "대구광역시 달성군 논공읍 남리 1 (달성보 하류)",
    hole_count: "18",
  },
  {
    name: "담양 제1파크골프장",
    address: "전남 담양군 담양읍 양각샛길 207",
    hole_count: "36",
  },
  {
    name: "담양 제2파크골프장",
    address: "전라남도 담양군 담양읍 양각리 348-135",
    hole_count: "18",
  },
  {
    name: "당진해나루파크골프장",
    address: "충청남도 당진시 석문면 통정리 1349",
    hole_count: "36",
  },
  {
    name: "대가야파크골프장",
    address: "경상북도 고령군 대가야읍 장기리 121",
    hole_count: "18",
  },
  {
    name: "대상파크골프장",
    address: "광주광역시 북구 월출동 968",
    hole_count: "9",
  },
  {
    name: "대소원파크골프장",
    address: "충청북도 충주시 대소원면 새터2길 29-15",
    hole_count: "18",
  },
  {
    name: "대원파크골프장",
    address: "경상남도 창원시 의창구 두대로 46 대상공원내",
    hole_count: "9",
  },
  {
    name: "대저생태공원파크골프장",
    address: "부산광역시 강서구 대저1동 1-5 대저생태공원",
    hole_count: "18",
  },
  {
    name: "대저생태공원파크골프장",
    address: "부산광역시 강서구 대저1동 1-5 대저생태공원",
    hole_count: "27",
  },
  {
    name: "대화파크골프장",
    address: "강원도 평창군 대화면 하원동길 25 평창군환경센타",
    hole_count: "18",
  },
  {
    name: "덕산파크골프장",
    address: "경상북도 칠곡군 약목면 덕산리 348-7",
    hole_count: "9",
  },
  {
    name: "덕흥파크골프장",
    address: "광주광역시 서구 덕흥동 157",
    hole_count: "9",
  },
  {
    name: "도개파크골프장",
    address: "경상북도 구미시 도개면 궁기리 829-1",
    hole_count: "36",
  },
  {
    name: "도고파크골프장",
    address: "충청남도 아산시 도고면 신언리 826",
    hole_count: "9",
  },
  {
    name: "도동파크골프장",
    address: "경상남도 진주시 초전동",
    hole_count: "9",
  },
  {
    name: "도천파크골프장",
    address: "경상남도 창녕군 도천면 도천리 770",
    hole_count: "18",
  },
  {
    name: "동구 봉무동 파크골프장",
    address: "대구광역시 동구 봉무동 1097-5 빗물펌프장(금호강변) 인근",
    hole_count: "36",
  },
  {
    name: "동구도평파크골프장",
    address: "대구광역시 동구 도동",
    hole_count: "9",
  },
  {
    name: "동대문구중량천 파크골프장",
    address: "서울특별시 동대문구 장안동 (군자교 다리 밑)",
    hole_count: "9",
  },
  {
    name: "동두천파크골프장",
    address: "경기도 동두천시 동두천로27 송내주공5단지",
    hole_count: "9",
  },
  {
    name: "동두천파크골프장",
    address: "경기도 동두천시 송내동 696",
    hole_count: "18",
  },
  {
    name: "동락파크골프장",
    address: "경상북도 구미시 진평동 880",
    hole_count: "36",
  },
  {
    name: "동부5개면파크골프장",
    address: "경상남도 진주시 사봉면 사군로 583",
    hole_count: "18",
  },
  {
    name: "동부권파크골프장",
    address: "경상남도 적중면 상부리242",
    hole_count: "18",
  },
  {
    name: "동천 파크골프장",
    address: "울산광역시 중구 남외동 508-1",
    hole_count: "27",
  },
  {
    name: "동탄제2신도시파크골프장",
    address: "경기도 화성시 동탄면 방교동789",
    hole_count: "18",
  },
  {
    name: "동해시파크골프장",
    address: "강원도 동해시 동해대로6314 망상컨멘션센타 옆",
    hole_count: "27",
  },
  {
    name: "둔내우용파크골프장",
    address: "강원도 횡성군 둔내면 우용리 395-1",
    hole_count: "9",
  },
  {
    name: "둔내파크골프장",
    address: "강원도 횡성군 둔내면 둔방내리 563-3",
    hole_count: "9",
  },
  {
    name: "둔산파크골프장",
    address: "전라북도 완주군 봉동읍 둔산리 881",
    hole_count: "18",
  },
  {
    name: "둔포파크골프장",
    address: "아산시 둔포면 석곡리 1480",
    hole_count: "9",
  },
  {
    name: "렛츠런파크골프장",
    address: "제주특별자치도 제주시 애월읍 유수암리 1206",
    hole_count: "18",
  },
  {
    name: "마사파크골프장",
    address: "경상남도 김해시 한림면 생림면마사리915-7",
    hole_count: "36",
  },
  {
    name: "마전교파크골프장",
    address: "전라북도 전주시 완산구 서신동 738-7",
    hole_count: "18",
  },
  {
    name: "모고파크골프장",
    address: "경상남도 산청군 산청읍 모고리",
    hole_count: "9",
  },
  {
    name: "무등산파크골프장",
    address: "동구 남문로 418-13",
    hole_count: "9",
  },
  {
    name: "무안파크골프장",
    address: "전남 무안군 무안읍 성동리 1086-3",
    hole_count: "18",
  },
  {
    name: "무안파크골프장",
    address: "경상남도 밀양시 무안면 신법리 262-2",
    hole_count: "9",
  },
  {
    name: "무주파크골프장",
    address: "전라북도 무주군 설천면 상평지길 20 무주복지공원 내",
    hole_count: "6",
  },
  {
    name: "무태파크골프장",
    address: "대구광역시 북구 서변동 산격대교 밑",
    hole_count: "18",
  },
  {
    name: "무한천파크골프장",
    address: "충청남도 예산군 예산읍 주교리 460",
    hole_count: "36",
  },
  {
    name: "문경파크골프장",
    address: "경상북도 문경시 창리강길45",
    hole_count: "45",
  },
  {
    name: "문막파크골프장",
    address: "강원도 원주시 문막면 문막리 1071-71",
    hole_count: "36",
  },
  {
    name: "미사리파크골프장",
    address: "경기도 하남시 미사동608",
    hole_count: "9",
  },
  {
    name: "밀양파크골프장",
    address: "경상남도 밀양시 삼문동 631번지",
    hole_count: "45",
  },
  {
    name: "백세파크골프장",
    address: "충청남도 청양군 청양읍 은천동길 16-6 백세공원 내",
    hole_count: "18",
  },
  {
    name: "버드내-태평파크골프장",
    address: "대전광역시 중구 태평동515-2(가장교-태평교)",
    hole_count: "9",
  },
  {
    name: "벽진면파크골프장",
    address: "경상북도 성주군 벽진면 체육공원",
    hole_count: "9",
  },
  {
    name: "병곡파크골프장",
    address: "경상북도 영덕군 병곡면 송천리 434-1",
    hole_count: "36",
  },
  {
    name: "보령파크골프구장",
    address: "충청남도 보령시 웅천읍 오천리 534-1",
    hole_count: "18",
  },
  {
    name: "보성미니파크골프장",
    address: "전라남도 보성군 용문길 36-16",
    hole_count: "9",
  },
  {
    name: "복내파크골프장(2024.4.25.까지 휴장)",
    address: "전남 보성군 복내리 536-16",
    hole_count: "18",
  },
  {
    name: "봉산파크골프장",
    address: "봉산면 서부로 4344-11",
    hole_count: "9",
  },
  {
    name: "봉평파크골프장",
    address: "강원도 평창군 봉평면 덕거리 369-2",
    hole_count: "18",
  },
  {
    name: "봉화파크골프장",
    address: "경상북도 봉화군 봉화읍 내성리 내성천 둔치",
    hole_count: "9",
  },
  {
    name: "부강파크골프장",
    address: "세종특별자치시 부강면 금호리 82 부강생활체육공원내",
    hole_count: "16",
  },
  {
    name: "부강파크골프장",
    address: "세종특별자치시 부강면 금호리 82 부강생활체육공원내",
    hole_count: "16",
  },
  {
    name: "부여파크골프장",
    address: "충청남도 부여군 부여읍 군수리 268-3",
    hole_count: "36",
  },
  {
    name: "부주산국제파크골프장",
    address: "전남 목포시 부주로 159",
    hole_count: "27",
  },
  {
    name: "북구검단파크골프장",
    address: "대구광역시 북구 검단동 276",
    hole_count: "27",
  },
  {
    name: "북구파크골프장",
    address: "광주광역시 북구 연제동 730번지(북구종합운동장내)",
    hole_count: "0",
  },
  {
    name: "북부권파크골프장",
    address: "경상남도 합천군 야로면 월광리388-1",
    hole_count: "18",
  },
  {
    name: "북평파크골프장",
    address: "강원도 정선군 북평면 북평리149-1",
    hole_count: "18",
  },
  {
    name: "북항파크골프장",
    address: "전남 목포시 북항 하수종말처리장",
    hole_count: "9",
  },
  {
    name: "불갑파크골프장",
    address: "전남 영광군 불갑면 방마리",
    hole_count: "18",
  },
  {
    name: "불로파크골프장",
    address: "대구광역시 동구 불로동 866-2",
    hole_count: "27",
  },
  {
    name: "비봉파크골프장",
    address: "전라북도 완주군 비봉면 소농리454 비봉면체육공원 내",
    hole_count: "9",
  },
  {
    name: "비비정파크골프장",
    address: "전라북도 완주군 삼례읍 후정리142-1 비비정공원 내",
    hole_count: "9",
  },
  {
    name: "비산파크골프장A-B",
    address: "대구광역시 서구 비산동 2127(매천대교 밑)",
    hole_count: "18",
  },
  {
    name: "비산파크골프장C-D",
    address: "대구광역시 서구 비산동 2127(매천대교 밑)",
    hole_count: "18",
  },
  {
    name: "비안파크골프장",
    address: "경상북도 의성군 비안면 이두리 이두교",
    hole_count: "18",
  },
  {
    name: "사봉파크골프장",
    address: "경상남도 진주시 사봉면 사군로 583",
    hole_count: "18",
  },
  {
    name: "사암파크골프장",
    address: "부산광역시 강서구 신호공단 내",
    hole_count: "9",
  },
  {
    name: "산이파크골프장",
    address: "전남 해남군 산이면 초두길 10-14",
    hole_count: "18",
  },
  {
    name: "산청(모고)파크골프장",
    address: "경상남도 산청군 시천면 사리 900-48",
    hole_count: "18",
  },
  {
    name: "삼락18파크골프장",
    address: "부산시 사상구 삼락동 658-1",
    hole_count: "9",
  },
  {
    name: "삼락9&9파크골프장",
    address: "부산시 사상구 삼락동 658-1",
    hole_count: "18",
  },
  {
    name: "삼락다이나믹파크골프장",
    address: "부산광역시 사상구 삼락동 431-752번지",
    hole_count: "36",
  },
  {
    name: "삼량진파크골프장",
    address: "경상남도 밀양시 삼량진읍 송지리 456-6",
    hole_count: "9",
  },
  {
    name: "삼척시미로파크골프장",
    address: "강원도 삼척시 미로면 강변 고수부지",
    hole_count: "9",
  },
  {
    name: "삼학도파크골프장",
    address: "전남 목포시 산정동 삼하도",
    hole_count: "9",
  },
  {
    name: "삼호대불파크골프장",
    address: "전남 영암군 삼호읍  종합공원길11",
    hole_count: "36",
  },
  {
    name: "삽교파크골프구장",
    address: "충청남도 당진시 신평면 삽교호 호수공원내",
    hole_count: "9",
  },
  {
    name: "상관파크골프장",
    address: "전라북도 완주군 상관면 신리 916",
    hole_count: "18",
  },
  {
    name: "상동파크골프장",
    address: "전라남도 목포시 상동 1045번지",
    hole_count: "9",
  },
  {
    name: "상락원파크골프장",
    address: "경상남도 진주시 판문오동길115번길62-33",
    hole_count: "6",
  },
  {
    name: "상록파크골프구장",
    address: "충청남도 당진시 송악읍 두곡공단로",
    hole_count: "18",
  },
  {
    name: "상사파크골프장",
    address: "순천시 상사면 응령리 678-7",
    hole_count: "13",
  },
  {
    name: "상주파크골프장",
    address: "경상북도 상주시 병성천2길44",
    hole_count: "27",
  },
  {
    name: "상평파크골프장",
    address: "경상남도 진주시 상평동",
    hole_count: "9",
  },
  {
    name: "생강골파크골프장",
    address: "전라북도 완주군 봉동읍 낙평리 795",
    hole_count: "27",
  },
  {
    name: "생비량파크골프장",
    address: "경상남도 산청군 생비량면 가계리 939-2 생활체육공원내",
    hole_count: "9",
  },
  {
    name: "생초파크골프장",
    address: "경상남도 산청군 생초면 어서리",
    hole_count: "9",
  },
  {
    name: "서남물재생센터공원파크골프장",
    address: "서울특별시 강서구 양천로 201 서남물재생센터",
    hole_count: "9",
  },
  {
    name: "서면파크골프장",
    address: "전남 순천시 서면 강청리 828",
    hole_count: "9",
  },
  {
    name: "서산나이스파크골프장",
    address: "충청남도 서산시 음암면 바위백이길 12",
    hole_count: "18",
  },
  {
    name: "서산시파크골프장",
    address: "충청남도 서산시 양대동 753-4",
    hole_count: "36",
  },
  {
    name: "서의성파크골프장",
    address: "경상북도 의성군 안계면 서보안계로 1907",
    hole_count: "27",
  },
  {
    name: "서재파크골프장",
    address: "대구광역시 달성군 다사읍 다사로 822(방천리 환경자원사업소)",
    hole_count: "18",
  },
  {
    name: "서종파크골프장",
    address: "경기도 양평군 서종면 문호리922-4 서종문화체육공원 내",
    hole_count: "9",
  },
  {
    name: "서천군노인복지관파크골프장",
    address: "충청남도 서천군 종천면 충서로302번길 88-26",
    hole_count: "18",
  },
  {
    name: "서해파크골프장",
    address: "전라남도 목포시 연산동 825-2",
    hole_count: "9",
  },
  {
    name: "석적파크골프장",
    address: "경상북도 칠곡군 석적읍 남율리 403",
    hole_count: "36",
  },
  {
    name: "선남면파크골프장",
    address: "경상북도 경북 성주군 선남면 관화리 714 체육공원 내",
    hole_count: "18",
  },
  {
    name: "선산파크골프장",
    address: "경상북도 구미시 선산읍 원리1057-26",
    hole_count: "36",
  },
  {
    name: "선학파크골프장",
    address: "인천광역시 연수구 경원대로 526",
    hole_count: "9",
  },
  {
    name: "섬진강피크닉광장파크골프장",
    address: "경상남도 하동군 고전면 전도리 882-3",
    hole_count: "18",
  },
  {
    name: "성남시파크골프장",
    address: "경기도 성남시 분당구 수내동 탄천변",
    hole_count: "9",
  },
  {
    name: "성서5차산업단지파크골프장",
    address: "대구광역시 달성군 다사읍 세천리1691",
    hole_count: "9",
  },
  {
    name: "성저파크골프장",
    address: "경기도 고양시 일산서구 대화동2325",
    hole_count: "18",
  },
  {
    name: "성조천파크골프장",
    address: "경상북도 의성군 의성읍 북원3길 35",
    hole_count: "9",
  },
  {
    name: "성주읍파크골프장",
    address: "경상북도 성주군 성주읍 경산리 경산교 일대 (성밖숲 건너편)",
    hole_count: "9",
  },
  {
    name: "소보파크골프장",
    address: "대구광역시 군위군 봉황리",
    hole_count: "18",
  },
  {
    name: "속초 경동대 파크골프장",
    address: "강원도 속초시 도리원길 5",
    hole_count: "9",
  },
  {
    name: "속초시파크골프장",
    address: "강원도 속초시 관광로 363번길 92",
    hole_count: "18",
  },
  {
    name: "송백파크골프장",
    address: "경상남도 진주시 금산면 송백리 663",
    hole_count: "36",
  },
  {
    name: "송월동파크골프장",
    address: "전남 나주시 성북동 100",
    hole_count: "9",
  },
  {
    name: "송정파크골프장",
    address: "경상남도 산청군 생초면 어서리",
    hole_count: "9",
  },
  {
    name: "쇠평파크골프장",
    address: "울산광역시 동구 남목3동 산153",
    hole_count: "18",
  },
  {
    name: "수림지파크골프장",
    address: "대구광역시 달서구 대천동699",
    hole_count: "18",
  },
  {
    name: "수망리파크골프장",
    address: "제주특별자치도 서귀포시 남원읍 수망리 산 158-1",
    hole_count: "18",
  },
  {
    name: "수성파크골프장",
    address: "대구광역시 수성구 고모동 6-2",
    hole_count: "27",
  },
  {
    name: "수성팔현파크골프장",
    address: "대구광역시 수성구 고모동 20-3 수성패미리파크",
    hole_count: "27",
  },
  {
    name: "수안보온천파크골프장",
    address: "충청북도 충주시 수안보면 안보리 425-4 수안보생활체육공원 내",
    hole_count: "27",
  },
  {
    name: "수원시파크골프장",
    address: "경기도 수원시 권선구 서수원로577번길 171(서수원칠보체육관)",
    hole_count: "9",
  },
  {
    name: "순창군파크골프장",
    address: "전라북도 순창군 유등면 왜이리 555-2",
    hole_count: "9",
  },
  {
    name: "술뫼파크골프장",
    address: "경상남도 김해시 한림면 시산리 495-2",
    hole_count: "72",
  },
  {
    name: "승촌파크골프장",
    address: "남구 승촌동 588-47번지 일원(승촌공원 내)",
    hole_count: "18",
  },
  {
    name: "시종마한파크골프장",
    address: "전남 영암군 시종면 남해당로 65",
    hole_count: "18",
  },
  {
    name: "시천(덕산)파크골프장",
    address: "경상남도 산청군 시천면 사리 900-48",
    hole_count: "18",
  },
  {
    name: "시흥시청파크골프장",
    address: "경기도 시흥시 장현동 300 시흥시청 옆",
    hole_count: "9",
  },
  {
    name: "시흥파크골프장",
    address: "경기도 시흥시 목감동 신도시 내",
    hole_count: "9",
  },
  {
    name: "신안파크골프장",
    address: "경상남도 산청군 신안면 중촌갈전로 228-35",
    hole_count: "18",
  },
  {
    name: "신태인파크골프장",
    address: "전라북도 정읍시 신태인읍 신용리 881",
    hole_count: "27",
  },
  {
    name: "실내체육관파크골프장",
    address: "전남 목포시 상동 349-1",
    hole_count: "9",
  },
  {
    name: "쌍백파크골프장",
    address: "합천군 쌍백면 중앙로 63",
    hole_count: "9",
  },
  {
    name: "안산신길파크골프장",
    address: "경기도 안산시 단원구 신길동1748",
    hole_count: "18",
  },
  {
    name: "안양천파크골프장",
    address: "서울특별시 양천구 안양천로 1138",
    hole_count: "18",
  },
  {
    name: "알천파크골프장",
    address: "경상북도 경주시 구황동 7-1번지",
    hole_count: "18",
  },
  {
    name: "양양송이조각공원 파크골프장",
    address: "강원도 양양군 양양읍 송암리 540",
    hole_count: "45",
  },
  {
    name: "양지파인리조트파크골프장",
    address: "경기도 용인시 처인구 양지면 남평로112 양지파인리조트",
    hole_count: "9",
  },
  {
    name: "양촌파크골프장",
    address: "경기도 김포시 양촌읍 학운리 3084-4",
    hole_count: "9",
  },
  {
    name: "양평누리파크골프장",
    address: "서울특별시 영등포구 양화동 4-1",
    hole_count: "18",
  },
  {
    name: "양평장애인파크골프장",
    address: "경기도 양평군 강상면 교평리419",
    hole_count: "18",
  },
  {
    name: "양평파크골프장",
    address: "경기도 양평군 강상면 교평리419",
    hole_count: "63",
  },
  {
    name: "양포파크구미교육원",
    address: "경상북도 구미시 거양길 280(양호동 607-2)",
    hole_count: "18",
  },
  {
    name: "어울림파크골프장",
    address: "경상북도 구미시 신평동 구미시산업로193-105",
    hole_count: "18",
  },
  {
    name: "여주파크골프장",
    address: "경기도 여주시 현암동 616-3",
    hole_count: "36",
  },
  {
    name: "연천재인폭포오토캠핑장파크골프장",
    address: "경기도 연천군 연천읍 고문리130-1",
    hole_count: "9",
  },
  {
    name: "연천파크골프장",
    address: "경기도 연천군 군남면 군남대교옆",
    hole_count: "36",
  },
  {
    name: "염주파크골프장",
    address: "광주광역시 서구 금화로 278",
    hole_count: "9",
  },
  {
    name: "영산포체육공원파크골프장",
    address: "전남 나주시 삼영동 131-1",
    hole_count: "18",
  },
  {
    name: "영암파크골프장",
    address: "전남 영암군 영암읍 영운재로 272",
    hole_count: "18",
  },
  {
    name: "영양군파크골프장",
    address: "경상북도 영양군 영양읍 삼지리 200 삼지수변공원 내",
    hole_count: "18",
  },
  {
    name: "영월파크골프장",
    address: "강원도 영월군 영월읍 하송리 81-74",
    hole_count: "9",
  },
  {
    name: "영종파크골프장",
    address: "인천광역시 중구 중산동 1878-2",
    hole_count: "9",
  },
  {
    name: "영주파크골프장(1구장)",
    address: "경상북도 영주시 가흥동 1382 영주교 밑",
    hole_count: "36",
  },
  {
    name: "영주파크골프장(2구장)",
    address: "경상북도 영주시 가흥동 46 가흥제1교 밑",
    hole_count: "18",
  },
  {
    name: "영천조교파크골프장",
    address: "경상북도 영천시 조교동 51-1",
    hole_count: "36",
  },
  {
    name: "영해파크골프장",
    address: "경상북도 영덕군 영해면 성내리 130 영해생활체육공원 내",
    hole_count: "9",
  },
  {
    name: "예천파크골프장",
    address: "경상북도 예천군 예천읍 서본리124",
    hole_count: "36",
  },
  {
    name: "오가낭파크골프장",
    address: "세종특별자치시 한누리대로651",
    hole_count: "9",
  },
  {
    name: "오곡파크골프장",
    address: "전남 곡성군 오곡천변내",
    hole_count: "9",
  },
  {
    name: "오부파크골프장",
    address: "경상남도 산청군 오부면 오잔리",
    hole_count: "9",
  },
  {
    name: "오수파크골프장",
    address: "경상북도 영천시 오수5길 75",
    hole_count: "36",
  },
  {
    name: "온고을파크골프장",
    address: "전라북도 전주시 덕진구 화전동 969-6 만경강하천",
    hole_count: "18",
  },
  {
    name: "왜관파크골프장",
    address: "경상북도 칠곡군 왜관읍 왜관리 1282",
    hole_count: "18",
  },
  {
    name: "용상파크골프장",
    address: "경상북도 안동시 용상동 구 안동병원앞",
    hole_count: "9",
  },
  {
    name: "용인파크골프장",
    address: "경기도 용인시 포고면 용인애버랜드 옆(체육공원내)",
    hole_count: "9",
  },
  {
    name: "용주파크골프장",
    address: "경상남도 합천군 용주면 성산리 1085-1",
    hole_count: "27",
  },
  {
    name: "용평파크골프장",
    address: "강원도 평창군 용펑면 갈정지길 55-35",
    hole_count: "9",
  },
  {
    name: "우보파크골프장",
    address: "대구광역시 군위군 미성리",
    hole_count: "9",
  },
  {
    name: "우주항공파크골프장",
    address: "경상남도 사천시 정동면 예수리 420",
    hole_count: "9",
  },
  {
    name: "운림삼별초파크골프장",
    address: "전남 진도군 의신면 사천길 15-21",
    hole_count: "18",
  },
  {
    name: "운정호수공원파크골프장",
    address: "경기도 파주시 소리천로91",
    hole_count: "9",
  },
  {
    name: "울주군 범서파크골프장",
    address: "울산광역시 울주군 범서읍 천상리 1041-77번지 태화강변",
    hole_count: "18",
  },
  {
    name: "울주군 청량 파크골프장",
    address: "울산광역시 울주군 청량읍 덕하리 979-63",
    hole_count: "18",
  },
  {
    name: "울진파크골프장",
    address: "울진군 근남면 수산리 337-4",
    hole_count: "36",
  },
  {
    name: "웅상파크골프장",
    address: "경상남도 양산시 웅상읍 소주동 소남교 둔치",
    hole_count: "18",
  },
  {
    name: "원동파크골프장",
    address: "경상남도 양산시 원동면 용당들길 43-62",
    hole_count: "9",
  },
  {
    name: "원오교파크골프장",
    address: "대구광역시 달성군 현풍면 원교리 863 원오교",
    hole_count: "18",
  },
  {
    name: "원주시파크골프장",
    address: "강원도 원주시 태장동1346-16 둔치",
    hole_count: "36",
  },
  {
    name: "월드컵파크골프장",
    address: "서울특별시 마포구 하늘공원로 86",
    hole_count: "18",
  },
  {
    name: "월라봉파크골프장",
    address: "제주특별자치도 서귀포시 신효동 1188-5",
    hole_count: "9",
  },
  {
    name: "유가한정파크골프장",
    address: "대구광역시 달성군 유가읍 한정리 596-1 (차천변)",
    hole_count: "18",
  },
  {
    name: "유등파크골프장",
    address: "대전광역시 서구 만년동 424",
    hole_count: "18",
  },
  {
    name: "유성구 갑천파크골프장",
    address: "대전광역시 유성구 탑립동 211-2",
    hole_count: "36",
  },
  {
    name: "율곡파크골프장",
    address: "경상남도 합천군 율곡면 영전리786-1",
    hole_count: "18",
  },
  {
    name: "을미기파크골프장",
    address: "대전광역시 대덕구 대덕대로1448번길 120 을미기공원 내",
    hole_count: "18",
  },
  {
    name: "음성생극파크골프장",
    address: "충청북도 음성군 생극면 신양리793-2",
    hole_count: "18",
  },
  {
    name: "의성군파크골프장",
    address: "경상북도 의성군 비안면 이두리 이두교",
    hole_count: "36",
  },
  {
    name: "의정부파크골프장",
    address: "경기도 의정부시 장암동146-10(호장교 밑)",
    hole_count: "18",
  },
  {
    name: "이방파크골프장",
    address: "경상남도 창녕군 이방면 장천리 950",
    hole_count: "15",
  },
  {
    name: "이서파크골프장",
    address: "전라북도 완주군 이서면 용서리 777-2 지사울공원",
    hole_count: "9",
  },
  {
    name: "이천시파크골프장",
    address: "경기도 이천시 안흥동 33번지",
    hole_count: "18",
  },
  {
    name: "익산파크골프장",
    address: "전라북도 익산시 오산면 목천리 967-1",
    hole_count: "18",
  },
  {
    name: "인제군파크골프장",
    address: "강원도 인제군 인제읍 남북리 살구미길 27-5",
    hole_count: "27",
  },
  {
    name: "인천송도파크골프장",
    address: "인천광역시 연수구 송도동 1번지 달빛공원 내",
    hole_count: "18",
  },
  {
    name: "일동파크골프장",
    address: "경기도 포천시 일동면 새낭로267",
    hole_count: "18",
  },
  {
    name: "임실파크골프장",
    address: "전라북도 임실군 오수면 오수리 3",
    hole_count: "27",
  },
  {
    name: "잠실파크골프장",
    address: "서울특별시 송파구 올림픽로 25 잠실종합운동장 내",
    hole_count: "9",
  },
  {
    name: "장림파크골프장",
    address: "부산시 사하구",
    hole_count: "9",
  },
  {
    name: "장성군 A파크골프장",
    address: "전남 장성군 황룡면 월평리 590-1",
    hole_count: "9",
  },
  {
    name: "장성군 B파크골프장",
    address: "전남 장성군 황룡면 신호리 53-1",
    hole_count: "9",
  },
  {
    name: "장수파크골프장",
    address: "인천광역시 남동구 백범로64",
    hole_count: "18",
  },
  {
    name: "장애인파크골프장",
    address: "경기도 남양주시 진건읍 송능2리(광해군묘)",
    hole_count: "9",
  },
  {
    name: "장천파크골프장",
    address: "경상남도 창원시 진해구 진해대로1099번길 149 생태숲가는길중간지점",
    hole_count: "18",
  },
  {
    name: "장호원파크골프장",
    address: "경기도 이천시 장호원읍 오남리 304-5(청미천 둔치)",
    hole_count: "18",
  },
  {
    name: "장흥파크골프장",
    address: "전남 장흥군 관산읍 옥당리 535-16",
    hole_count: "9",
  },
  {
    name: "전원파크골프구장",
    address: "충청남도 서산시 대산읍 운산리",
    hole_count: "18",
  },
  {
    name: "정발파크골프장",
    address: "경기도 고양시 일산동구 마두동819 정발산배수지",
    hole_count: "9",
  },
  {
    name: "정촌파크골프장",
    address: "경상남도 진주시 정촌면",
    hole_count: "9",
  },
  {
    name: "제천중전리파크골프장",
    address: "충청북도 제천시 금성면 신담길 213",
    hole_count: "18",
  },
  {
    name: "조만강파크골프장",
    address: "경상남도 김해시 장유면 칠산로 127-25",
    hole_count: "36",
  },
  {
    name: "조천파크골프장",
    address: "세종특별자치시 조치원읍 새내22길(서창천교 옆)",
    hole_count: "9",
  },
  {
    name: "종합경기장파크골프장",
    address: "경상남도 진주시 동진로 415 진주종합경기장 내",
    hole_count: "9",
  },
  {
    name: "주문진 신리파크골프장",
    address: "강원도 강릉시 주문진읍 신리천",
    hole_count: "9",
  },
  {
    name: "죽전파크골프장",
    address: "경기도 용인시 수지구 죽전동555-4 죽전체육공원(하수처리장)",
    hole_count: "9",
  },
  {
    name: "줄포파크골프장",
    address: "전라북도 부안군 줄포면 생태공원로 170 부안자연생태공원 내",
    hole_count: "18",
  },
  {
    name: "중랑천 파크골프장",
    address: "서울특별시 노원구 월계동 230-10 중랑천변",
    hole_count: "9",
  },
  {
    name: "중산파크골프장",
    address: "경기도 고양시 일산동구 중산로217 중산공원",
    hole_count: "9",
  },
  {
    name: "중앙공원파크골프장",
    address: "세종특별자치시 연기면 세종동 1204",
    hole_count: "9",
  },
  {
    name: "증평파크골프장",
    address: "충청북도 증평군 증평읍 삼보로 40-60 증평군 수질개선사업소 내",
    hole_count: "9",
  },
  {
    name: "지곡파크골프장",
    address: "경상북도 포항시 남구 효곡동",
    hole_count: "9",
  },
  {
    name: "지수파크골프장",
    address: "경상남도 진주시 지수면",
    hole_count: "9",
  },
  {
    name: "진안파크골프장",
    address: "전라북도 진안군 진안읍 운산리 76",
    hole_count: "18",
  },
  {
    name: "진장 파크골프장",
    address: "울산광역시 북구 진장동 400",
    hole_count: "27",
  },
  {
    name: "진천파크골프장",
    address: "대구광역시 달성군 화원읍 구라리 188-1",
    hole_count: "18",
  },
  {
    name: "진천파크골프장",
    address: "충북 진천군 진천읍 장관리",
    hole_count: "18",
  },
  {
    name: "차황파크골프장",
    address: "경상남도 산청군 차황면 친환경로 3581",
    hole_count: "9",
  },
  {
    name: "창녕유어파크골프장",
    address: "경상남도 창녕군 유어면 미구리 588",
    hole_count: "18",
  },
  {
    name: "창원시 대산드림파크골프장",
    address: "경상남도 창원시 의창구 대산면 북부리 196-2(문화체육공원내)",
    hole_count: "18",
  },
  {
    name: "천안도솔파크골프장",
    address: "충청남도 천안시 동남구 천안대로 844 도솔광장 내",
    hole_count: "18",
  },
  {
    name: "천안풍세파크골프장",
    address: "충청남도 천안시 동남구 풍세면 용정리 971 풍세산단 내 공원",
    hole_count: "9",
  },
  {
    name: "천안한들파크골프장",
    address: "충청남도 천안시 서북구 음봉로 861-50",
    hole_count: "9",
  },
  {
    name: "철우파크골프장",
    address: "경상북도 안동시 운흥동 구 안동역내",
    hole_count: "9",
  },
  {
    name: "철원군파크골프장",
    address: "강원도 철원군 갈말읍 군탄리 869",
    hole_count: "18",
  },
  {
    name: "첨단체육공원 파크골프장",
    address: "광주광역시 광산구 쌍암동 695-3 첨단생활체육공원 내",
    hole_count: "9",
  },
  {
    name: "청도파크골프장",
    address: "경상북도 청도군 청도읍 월곡2길 15",
    hole_count: "18",
  },
  {
    name: "청송파크골프장",
    address: "경상북도 청송군 청송읍 송생리 784-1",
    hole_count: "18",
  },
  {
    name: "청심빌리지파크골프장",
    address: "경기도 가평군 설악면 송산리711 청심빌리지",
    hole_count: "9",
  },
  {
    name: "청양군파크골프장",
    address: "청양군 청양읍 읍내리 백세공원",
    hole_count: "18",
  },
  {
    name: "청일파크골프장",
    address: "강원도 횡성군 청일면 유평리 613-1",
    hole_count: "18",
  },
  {
    name: "청주오송파크골프장",
    address:
      "충청북도 청주시 흥덕구 오송읍 오송생명2로 187 오송생명과학단지 내",
    hole_count: "9",
  },
  {
    name: "청주장애인파크골프장",
    address: "충청북도 청주시 흥덕구 미호로99",
    hole_count: "18",
  },
  {
    name: "청주파크골프장",
    address: "충청북도 청주시 흥덕구 미호로99",
    hole_count: "27",
  },
  {
    name: "청주호미골파크골프장",
    address: "충청북도 청주시 상당구 용정동 25",
    hole_count: "9",
  },
  {
    name: "청하파크골프장",
    address: "전라북도 김제시 청하면 강변로151 근처",
    hole_count: "18",
  },
  {
    name: "춘천 소양강파크골프장",
    address: "강원도 춘천시 장학리 459-11",
    hole_count: "18",
  },
  {
    name: "춘천서면파크골프장",
    address: "강원도 춘천시 서면 박서로800",
    hole_count: "18",
  },
  {
    name: "충주단월파크골프장",
    address: "충청북도 충주시 단월동 635-4",
    hole_count: "18",
  },
  {
    name: "충주장애인파크골프장",
    address: "충청북도 충주시 용관동 창현로1400",
    hole_count: "9",
  },
  {
    name: "충주호파크골프장",
    address: "충청북도 충주시 목행동 749-3",
    hole_count: "36",
  },
  {
    name: "칠서강나루파크골프장",
    address: "경상남도 함안군 칠서면 이룡리 998",
    hole_count: "45",
  },
  {
    name: "칠십리파크골프장",
    address: "제주특별자치도 서귀포시 서홍동 663-2",
    hole_count: "18",
  },
  {
    name: "칠암파크골프장",
    address: "경상남도 진주시 칠암동 남강둔치",
    hole_count: "9",
  },
  {
    name: "태백파크골프장",
    address: "강원도 태백시 백두대간로 179 태백스포츠파크 내",
    hole_count: "18",
  },
  {
    name: "태안파크골프장",
    address: "충청남도 태안군 태안읍 기업도시로 443",
    hole_count: "18",
  },
  {
    name: "파주금강산랜드파크골프장",
    address: "경기도 파주시 월롱면 위전리89",
    hole_count: "9",
  },
  {
    name: "파주파크골프장",
    address: "경기도 파주시 교하로577(심학산배수지입구)",
    hole_count: "18",
  },
  {
    name: "평거파크골프장",
    address: "경상남도 진주시 평거동",
    hole_count: "18",
  },
  {
    name: "평창파크골프장",
    address: "강원도 평창군 평창읍 종부리 969-1",
    hole_count: "9",
  },
  {
    name: "평택파크골프장",
    address: "경기도 평택시 비전동 1005-1",
    hole_count: "9",
  },
  {
    name: "포천시파크골프장",
    address: "24년말 준공",
    hole_count: "36",
  },
  {
    name: "풍기파크골프장",
    address: "경상북도 영주시 풍기읍 창락리 303-1 남원천변",
    hole_count: "18",
  },
  {
    name: "풍호파크골프장",
    address: "경상남도 창원시 진해구 풍호동 26-1",
    hole_count: "9",
  },
  {
    name: "하남시파크골프장",
    address: "경기도 하남시 맘월동 226 미사경정공원 내",
    hole_count: "36",
  },
  {
    name: "하남파크골프장",
    address: "경상남도 밀양시 하남읍 수산리 418-5",
    hole_count: "9",
  },
  {
    name: "하대둔치 파크골프장",
    address: "경상남도 진주시 하대동",
    hole_count: "9",
  },
  {
    name: "하동파크골프장",
    address: "경상남도 하동군 진교면 송원리51-412",
    hole_count: "36",
  },
  {
    name: "하리파크골프장",
    address: "경상북도 안동시 송천동 하리체육공원",
    hole_count: "18",
  },
  {
    name: "하빈파크골프장",
    address: "대구광역시 달성군 하빈면 봉촌리 1200-3",
    hole_count: "27",
  },
  {
    name: "하양파크골프장",
    address: "경상북도 경산시 하양읍 동서리172-4",
    hole_count: "18",
  },
  {
    name: "한강파크골프장",
    address: "서울특별시 영등포구 여의도동 86",
    hole_count: "9",
  },
  {
    name: "한반도섬 파크골프장",
    address: "강원도 양구군 양구읍 동수리 334-17",
    hole_count: "27",
  },
  {
    name: "한빛원자력파크골프장",
    address: "전라남도 영광군 홍농읍 성산리 494 한마음공원 내",
    hole_count: "36",
  },
  {
    name: "한솔파크골프장",
    address: "세종특별자치시 가람동 765",
    hole_count: "9",
  },
  {
    name: "함안샛담파크골프장",
    address: "경상남도 함안군 함안면 강명리1469-23",
    hole_count: "18",
  },
  {
    name: "함안파크골프장",
    address: "경상남도 함안군 법수면 주물리 351",
    hole_count: "27",
  },
  {
    name: "함양파크골프장",
    address: "경상남도 함양군 함양읍 하림강변길 131 하림공원 내",
    hole_count: "18",
  },
  {
    name: "함평군파크골프장",
    address: "전남 함평군 함평으브 곤재로 83",
    hole_count: "36",
  },
  {
    name: "합천군파크골프장",
    address: "경상남도 합천군 합천읍 합천리 20번지",
    hole_count: "36",
  },
  {
    name: "해남파크골프장",
    address: "전라남도 해남군 삼산면 봉학리 154-7",
    hole_count: "18",
  },
  {
    name: "해평파크골프장",
    address: "경상북도 구미시 해평면 낙산리1095-34",
    hole_count: "18",
  },
  {
    name: "행구동파크골프장",
    address: "강원도 원주시 행구로 362 행구수변공원",
    hole_count: "9",
  },
  {
    name: "혁신도시파크골프장",
    address: "전남  나주시 빛가람동 4-346",
    hole_count: "9",
  },
  {
    name: "현리근린공원파크골프장",
    address: "강원도 인제군 기린면 현리 785 근린공원",
    hole_count: "9",
  },
  {
    name: "형산장애인전용파크골프장",
    address: "경상북도 포항시 남구 형산강북로 371",
    hole_count: "18",
  },
  {
    name: "형산파크골프장",
    address: "경상북도 포항시 남구 해도동 119-1 형산둔치 형산강변체육공원 내",
    hole_count: "36",
  },
  {
    name: "호계파크골프장",
    address: "경상남도 창원시 마산회원구 내서읍 호계 본동로 59-1",
    hole_count: "18",
  },
  {
    name: "홍성군파크골프장",
    address: "충청남도 홍성군 홍성읍 충서로1707번길 150",
    hole_count: "18",
  },
  {
    name: "홍천강변파크골프장",
    address: "강원도 홍천군 홍천읍 갈마곡리 267-10",
    hole_count: "18",
  },
  {
    name: "화명파크골프장",
    address: "부산광역시 북구 화명동 1718-17 화명생태공원 내",
    hole_count: "27",
  },
  {
    name: "화명파크골프장",
    address: "부산시 북구 화명동 1718-11",
    hole_count: "9",
  },
  {
    name: "화원 진천파크골프장",
    address: "대구광역시 화원읍 구라리 1400번지 일원",
    hole_count: "18",
  },
  {
    name: "화정파크골프장",
    address: "경기도 고양시 덕양구 은빛로77",
    hole_count: "9",
  },
  {
    name: "화천 산천어 파크골프장(1구장)",
    address: "강원도 화천군 하남면 춘화로 3061-17",
    hole_count: "18",
  },
  {
    name: "화천 산천어 파크골프장(2구장)",
    address: "강원특별자치도 화천군 하남면 춘화로 3061-17",
    hole_count: "18",
  },
  {
    name: "화천파크골프장",
    address: "강원도 화천군 하남면 용암리 1115번지",
    hole_count: "18",
  },
  {
    name: "황산파크골프장",
    address: "경상남도 양산시 물금읍 증산리967-1",
    hole_count: "36",
  },
  {
    name: "회천파크골프장",
    address: "제주특별자치도 제주시 와흘전1길 32 제주시생활체육공원 내",
    hole_count: "18",
  },
  {
    name: "횡성파크골프장",
    address: "강원도 횡성군 횡성읍 앞들동2로 45-19",
    hole_count: "18",
  },
  {
    name: "횡천파크골프장",
    address: "경상남도 하동군 횡청면 횡천리 639-3",
    hole_count: "18",
  },
  {
    name: "효령파크골프장",
    address: "대구광역시 군위군 효령면 장기리 116",
    hole_count: "9",
  },
  {
    name: "효령파크골프장",
    address: "광주광역시 북구 하서로 950",
    hole_count: "9",
  },
];

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const supabase = await createSupabaseServerClient();

  const pageRequests = Array.from({ length: 20 }, (_, i) => i + 1).map((page) =>
    fetch(ZIGSAW_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ZIGSAW_API_KEY,
      },
      body: JSON.stringify({
        url: getScrapeUrl(page),
        elements: [{ selector: ".tablevline tr:not(:first-child)" }],
      }),
    })
      .then((response) =>
        response.ok
          ? response.json()
          : Promise.reject("Scrape failed for page: " + page),
      )
      .then((result) =>
        result.data[0].results.map((r: any) => ({
          name: r.text.split("\n")[1].trim(),
          address: r.text.split("\n")[2].trim(),
          hole_count: Number(r.text.split("\n")[4].trim()),
        })),
      )
      .catch((error) => console.error(error)),
  );

  const results = await Promise.allSettled(pageRequests);
  const allCourses = results.flatMap((result) =>
    result.status === "fulfilled" ? result.value : [],
  ) as { name: string; address: string; hole_count: number }[];

  const result = await supabase
    .from("scraped_golf_courses")
    .upsert(allCourses, {
      onConflict: "name, address, hole_count",
      ignoreDuplicates: true,
    });

  if (result.error) {
    return Response.json({ status: 500, error: result.error });
  }

  return Response.json({ status: 200, result, allCourses });
}
