export const PermittedDevicesAllowList: string[] = ["tel:*"];

export const serviceAllowList: string[] = [
  "https://www.goparkgolf.app",
  "http://192.168.45.232:3000",
  "https://accounts.kakao.com",
  "http://k.kakaocdn.net",
];

export const originAllowList: string[] = [
  ...PermittedDevicesAllowList,
  ...serviceAllowList,
];
