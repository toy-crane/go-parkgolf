import React, { useRef } from "react";
import { Linking } from "react-native";
import { WebView } from "react-native-webview";

import { originAllowList, serviceAllowList } from "~/configs/origin-allow-list";

export default function Home() {
  const webViewRef = useRef<WebView>(null);

  return (
    <WebView
      webviewDebuggingEnabled
      ref={webViewRef}
      allowsBackForwardNavigationGestures
      geolocationEnabled
      originWhitelist={originAllowList}
      onShouldStartLoadWithRequest={(request) => {
        // Only allow navigating within this website
        if (serviceAllowList.some((url) => request.url.startsWith(url))) {
          return true;
        } else {
          void Linking.openURL(request.url);
          return false;
        }
      }}
      source={{ uri: process.env.EXPO_PUBLIC_WEB_URL! }}
    />
  );
}
