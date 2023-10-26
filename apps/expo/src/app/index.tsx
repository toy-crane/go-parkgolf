import React, { useEffect, useRef, useState } from "react";
import { Linking } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";

import { originAllowList, serviceAllowList } from "~/configs/origin-allow-list";

export default function Home() {
  const webViewRef = useRef<WebView>(null);
  const [location, setLocation] = useState<Location.LocationObject>();

  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) {
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    };
    void requestPermission();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-transparent">
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
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
