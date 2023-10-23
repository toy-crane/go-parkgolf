export const PermittedDevicesAllowList: string[] = ["tel:*"];

export const serviceAllowList: string[] = [
  "https://www.goparkgolf.app",
  "http://localhost:3000",
];

export const originAllowList: string[] = [
  ...PermittedDevicesAllowList,
  ...serviceAllowList,
];
