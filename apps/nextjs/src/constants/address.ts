const regions = [
  "충남",
  "부산",
  "울산",
  "인천",
  "대구",
  "대전",
  "서울",
  "충북",
  "제주특별자치도",
  "경남",
  "경기",
  "경북",
  "강원특별자치도",
  "전북",
  "세종특별자치시",
  "전남",
  "광주",
];

const districts = [
  {
    region: "강원특별자치도",
    district: "속초시",
  },
  {
    region: "강원특별자치도",
    district: "횡성군",
  },
  {
    region: "강원특별자치도",
    district: "강릉시",
  },
  {
    region: "강원특별자치도",
    district: "양양군",
  },
  {
    region: "강원특별자치도",
    district: "철원군",
  },
  {
    region: "강원특별자치도",
    district: "동해시",
  },
  {
    region: "강원특별자치도",
    district: "화천군",
  },
  {
    region: "강원특별자치도",
    district: "양구군",
  },
  {
    region: "강원특별자치도",
    district: "삼척시",
  },
  {
    region: "강원특별자치도",
    district: "홍천군",
  },
  {
    region: "강원특별자치도",
    district: "태백시",
  },
  {
    region: "강원특별자치도",
    district: "영월군",
  },
  {
    region: "강원특별자치도",
    district: "인제군",
  },
  {
    region: "강원특별자치도",
    district: "고성군",
  },
  {
    region: "강원특별자치도",
    district: "원주시",
  },
  {
    region: "강원특별자치도",
    district: "평창군",
  },
  {
    region: "강원특별자치도",
    district: "정선군",
  },
  {
    region: "강원특별자치도",
    district: "춘천시",
  },
  {
    region: "경기",
    district: "여주시",
  },
  {
    region: "경기",
    district: "안산시 단원구",
  },
  {
    region: "경기",
    district: "성남시 분당구",
  },
  {
    region: "경기",
    district: "하남시",
  },
  {
    region: "경기",
    district: "고양시 일산동구",
  },
  {
    region: "경기",
    district: "광주시",
  },
  {
    region: "경기",
    district: "의정부시",
  },
  {
    region: "경기",
    district: "남양주시",
  },
  {
    region: "경기",
    district: "구리시",
  },
  {
    region: "경기",
    district: "평택시",
  },
  {
    region: "경기",
    district: "이천시",
  },
  {
    region: "경기",
    district: "양주시",
  },
  {
    region: "경기",
    district: "고양시 일산서구",
  },
  {
    region: "경기",
    district: "동두천시",
  },
  {
    region: "경기",
    district: "연천군",
  },
  {
    region: "경기",
    district: "양평군",
  },
  {
    region: "경기",
    district: "용인시 처인구",
  },
  {
    region: "경기",
    district: "시흥시",
  },
  {
    region: "경기",
    district: "가평군",
  },
  {
    region: "경기",
    district: "화성시",
  },
  {
    region: "경기",
    district: "수원시 권선구",
  },
  {
    region: "경기",
    district: "고양시 덕양구",
  },
  {
    region: "경기",
    district: "포천시",
  },
  {
    region: "경기",
    district: "파주시",
  },
  {
    region: "경기",
    district: "김포시",
  },
  {
    region: "경기",
    district: "용인시 수지구",
  },
  {
    region: "경남",
    district: "하동군",
  },
  {
    region: "경남",
    district: "밀양시",
  },
  {
    region: "경남",
    district: "양산시",
  },
  {
    region: "경남",
    district: "산청군",
  },
  {
    region: "경남",
    district: "김해시",
  },
  {
    region: "경남",
    district: "창원시 성산구",
  },
  {
    region: "경남",
    district: "창원시 의창구",
  },
  {
    region: "경남",
    district: "창원시 진해구",
  },
  {
    region: "경남",
    district: "창원시 마산회원구",
  },
  {
    region: "경남",
    district: "남해군",
  },
  {
    region: "경남",
    district: "함양군",
  },
  {
    region: "경남",
    district: "창녕군",
  },
  {
    region: "경남",
    district: "진주시",
  },
  {
    region: "경남",
    district: "사천시",
  },
  {
    region: "경남",
    district: "거창군",
  },
  {
    region: "경남",
    district: "함안군",
  },
  {
    region: "경남",
    district: "합천군",
  },
  {
    region: "경남",
    district: "거제시",
  },
  {
    region: "경북",
    district: "포항시 북구",
  },
  {
    region: "경북",
    district: "영덕군",
  },
  {
    region: "경북",
    district: "울진군",
  },
  {
    region: "경북",
    district: "포항시 남구",
  },
  {
    region: "경북",
    district: "경주시",
  },
  {
    region: "경북",
    district: "고령군",
  },
  {
    region: "경북",
    district: "안동시",
  },
  {
    region: "경북",
    district: "봉화군",
  },
  {
    region: "경북",
    district: "영천시",
  },
  {
    region: "경북",
    district: "청도군",
  },
  {
    region: "경북",
    district: "구미시",
  },
  {
    region: "경북",
    district: "영양군",
  },
  {
    region: "경북",
    district: "의성군",
  },
  {
    region: "경북",
    district: "청송군",
  },
  {
    region: "경북",
    district: "상주시",
  },
  {
    region: "경북",
    district: "성주군",
  },
  {
    region: "경북",
    district: "예천군",
  },
  {
    region: "경북",
    district: "문경시",
  },
  {
    region: "경북",
    district: "경산시",
  },
  {
    region: "경북",
    district: "영주시",
  },
  {
    region: "경북",
    district: "김천시",
  },
  {
    region: "경북",
    district: "칠곡군",
  },
  {
    region: "광주",
    district: "서구",
  },
  {
    region: "광주",
    district: "광산구",
  },
  {
    region: "광주",
    district: "북구",
  },
  {
    region: "광주",
    district: "동구",
  },
  {
    region: "광주",
    district: "남구",
  },
  {
    region: "대구",
    district: "남구",
  },
  {
    region: "대구",
    district: "서구",
  },
  {
    region: "대구",
    district: "동구",
  },
  {
    region: "대구",
    district: "달성군",
  },
  {
    region: "대구",
    district: "달서구",
  },
  {
    region: "대구",
    district: "군위군",
  },
  {
    region: "대구",
    district: "수성구",
  },
  {
    region: "대구",
    district: "북구",
  },
  {
    region: "대전",
    district: "유성구",
  },
  {
    region: "대전",
    district: "대덕구",
  },
  {
    region: "대전",
    district: "서구",
  },
  {
    region: "대전",
    district: "중구",
  },
  {
    region: "부산",
    district: "사하구",
  },
  {
    region: "부산",
    district: "북구",
  },
  {
    region: "부산",
    district: "기장군",
  },
  {
    region: "부산",
    district: "강서구",
  },
  {
    region: "부산",
    district: "사상구",
  },
  {
    region: "서울",
    district: "송파구",
  },
  {
    region: "서울",
    district: "동대문구",
  },
  {
    region: "서울",
    district: "금천구",
  },
  {
    region: "서울",
    district: "노원구",
  },
  {
    region: "서울",
    district: "영등포구",
  },
  {
    region: "서울",
    district: "양천구",
  },
  {
    region: "서울",
    district: "강서구",
  },
  {
    region: "서울",
    district: "구로구",
  },
  {
    region: "서울",
    district: "강동구",
  },
  {
    region: "서울",
    district: "마포구",
  },
  {
    region: "세종특별자치시",
    district: "세종시",
  },
  {
    region: "울산",
    district: "동구",
  },
  {
    region: "울산",
    district: "중구",
  },
  {
    region: "울산",
    district: "남구",
  },
  {
    region: "울산",
    district: "울주군",
  },
  {
    region: "울산",
    district: "북구",
  },
  {
    region: "인천",
    district: "남동구",
  },
  {
    region: "인천",
    district: "연수구",
  },
  {
    region: "인천",
    district: "중구",
  },
  {
    region: "인천",
    district: "서구",
  },
  {
    region: "전남",
    district: "장성군",
  },
  {
    region: "전남",
    district: "구례군",
  },
  {
    region: "전남",
    district: "곡성군",
  },
  {
    region: "전남",
    district: "함평군",
  },
  {
    region: "전남",
    district: "무안군",
  },
  {
    region: "전남",
    district: "담양군",
  },
  {
    region: "전남",
    district: "완도군",
  },
  {
    region: "전남",
    district: "나주시",
  },
  {
    region: "전남",
    district: "영광군",
  },
  {
    region: "전남",
    district: "해남군",
  },
  {
    region: "전남",
    district: "순천시",
  },
  {
    region: "전남",
    district: "보성군",
  },
  {
    region: "전남",
    district: "장흥군",
  },
  {
    region: "전남",
    district: "영암군",
  },
  {
    region: "전남",
    district: "목포시",
  },
  {
    region: "전남",
    district: "진도군",
  },
  {
    region: "전남",
    district: "광양시",
  },
  {
    region: "전북",
    district: "진안군",
  },
  {
    region: "전북",
    district: "완주군",
  },
  {
    region: "전북",
    district: "전주시 덕진구",
  },
  {
    region: "전북",
    district: "순창군",
  },
  {
    region: "전북",
    district: "부안군",
  },
  {
    region: "전북",
    district: "전주시 완산구",
  },
  {
    region: "전북",
    district: "고창군",
  },
  {
    region: "전북",
    district: "김제시",
  },
  {
    region: "전북",
    district: "정읍시",
  },
  {
    region: "전북",
    district: "익산시",
  },
  {
    region: "전북",
    district: "임실군",
  },
  {
    region: "전북",
    district: "무주군",
  },
  {
    region: "전북",
    district: "군산시",
  },
  {
    region: "전북",
    district: "남원시",
  },
  {
    region: "제주특별자치도",
    district: "제주시",
  },
  {
    region: "제주특별자치도",
    district: "서귀포시",
  },
  {
    region: "충남",
    district: "천안시 서북구",
  },
  {
    region: "충남",
    district: "부여군",
  },
  {
    region: "충남",
    district: "보령시",
  },
  {
    region: "충남",
    district: "서천군",
  },
  {
    region: "충남",
    district: "아산시",
  },
  {
    region: "충남",
    district: "공주시",
  },
  {
    region: "충남",
    district: "태안군",
  },
  {
    region: "충남",
    district: "천안시 동남구",
  },
  {
    region: "충남",
    district: "예산군",
  },
  {
    region: "충남",
    district: "당진시",
  },
  {
    region: "충남",
    district: "홍성군",
  },
  {
    region: "충남",
    district: "논산시",
  },
  {
    region: "충남",
    district: "계룡시",
  },
  {
    region: "충남",
    district: "청양군",
  },
  {
    region: "충남",
    district: "금산군",
  },
  {
    region: "충남",
    district: "서산시",
  },
  {
    region: "충북",
    district: "진천군",
  },
  {
    region: "충북",
    district: "증평군",
  },
  {
    region: "충북",
    district: "제천시",
  },
  {
    region: "충북",
    district: "괴산군",
  },
  {
    region: "충북",
    district: "청주시 상당구",
  },
  {
    region: "충북",
    district: "단양군",
  },
  {
    region: "충북",
    district: "음성군",
  },
  {
    region: "충북",
    district: "청주시 흥덕구",
  },
  {
    region: "충북",
    district: "충주시",
  },
];

export { regions, districts };
