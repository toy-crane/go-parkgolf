import React, { useRef } from "react";
import { WebView } from "react-native-webview";

export default function Home() {
  const webViewRef = useRef<WebView>(null);

  return (
    <WebView
      webviewDebuggingEnabled
      ref={webViewRef}
      allowsBackForwardNavigationGestures
      geolocationEnabled
      source={{ uri: "http://localhost:3000/" }}
    />
  );
}
