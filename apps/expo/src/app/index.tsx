import React, { useRef } from "react";
import { Linking } from "react-native";
import { WebView } from "react-native-webview";

export default function Home() {
  const webViewRef = useRef<WebView>(null);

  return (
    <WebView
      webviewDebuggingEnabled
      ref={webViewRef}
      allowsBackForwardNavigationGestures
      geolocationEnabled
      originWhitelist={["https://*", "http://*", "tel:*"]}
      onShouldStartLoadWithRequest={(request) => {
        // Only allow navigating within this website
        if (request.url.startsWith("http://localhost:3000/")) {
          return true;
        } else {
          void Linking.openURL(request.url);
          return false;
        }
      }}
      source={{ uri: "http://localhost:3000/" }}
    />
  );
}
