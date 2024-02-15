import type { ExpoConfig } from "@expo/config";

const IS_DEV = process.env.APP_VARIANT === "development";

const defineConfig = (): ExpoConfig => ({
  name: IS_DEV ? "파크골프 가자(DEV)" : "파크골프 가자",
  slug: "goparkgolf",
  scheme: "goparkgolf",
  version: "1.0.1",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#27D51A",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "app.goparkgolf.www",
    supportsTablet: true,
    infoPlist: {
      NSLocationAlwaysAndWhenInUseUsageDescription:
        "사용자의 위치를 기반으로 파크골프장 정보를 제공하기 위해 권한이 필요합니다.",
      NSLocationAlwaysUsageDescription:
        "사용자의 위치를 기반으로 파크골프장 정보를 제공하기 위해 권한이 필요합니다.",
      NSLocationUsageDescription:
        "사용자의 위치를 기반으로 파크골프장 정보를 제공하기 위해 권한이 필요합니다.",
      NSLocationWhenInUseUsageDescription:
        "사용자의 위치를 기반으로 파크골프장 정보를 제공하기 위해 권한이 필요합니다.",
      NSUserTrackingUsageDescription:
        "사용자에게 최적화된 광고를 제공하기 위해 사용자의 광고 활동 정보를 수집합니다",
    },
  },
  android: {
    package: IS_DEV ? "app.goparkgolf.www.dev" : "app.goparkgolf.www",
    versionCode: 4,
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#1F104A",
    },
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme: "auth-app",
          },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },
  extra: {
    eas: {
      projectId: "4546c602-3f3d-4555-b1dc-f400dd645683",
    },
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  plugins: [
    "expo-router",
    "./expo-plugins/with-modify-gradle.js",
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "$(PRODUCT_NAME)가 사용자의 위치 정보를 사용하는데, 동의하시겠습니까?",
        locationAlwaysPermission:
          "$(PRODUCT_NAME)가 사용자의 위치 정보를 사용하는데, 동의하시겠습니까?",
        locationWhenInUsePermission:
          "$(PRODUCT_NAME)가 사용자의 위치 정보를 사용하는데, 동의하시겠습니까?",
      },
    ],
    [
      "expo-tracking-transparency",
      {
        userTrackingPermission:
          "사용자에게 최적화된 광고를 제공하기 위해 사용자의 광고 활동 정보를 수집합니다",
      },
    ],
    [
      "@react-native-seoul/kakao-login",
      {
        kakaoAppKey: "cbe5c62037f7104f1744ad386f63d6cf", // 필수
        kotlinVersion: "1.9.0", // Android Only, Optional, Expo 내부 패키지들과의 충돌이 있어 테스트 결과 1.5.10은 문제가 없었습니다. 지정 안하면 1.5.10으로 설정됩니다.
      },
    ],
  ],
});

export default defineConfig;
