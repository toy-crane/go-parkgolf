import React, { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, Linking } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";

import { originAllowList, serviceAllowList } from "~/configs/origin-allow-list";

export default function Home() {
  const webViewRef = useRef<WebView>(null);
  const [isCanGoBack, setIsCanGoBack] = useState(false);

  const onPressHardwareBackButton = useCallback(() => {
    if (webViewRef.current && isCanGoBack) {
      webViewRef.current.goBack();
      return true;
    } else {
      return false;
    }
  }, [isCanGoBack]);

  useEffect(() => {
    BackHandler.addEventListener(
      "hardwareBackPress",
      onPressHardwareBackButton,
    );
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        onPressHardwareBackButton,
      );
    };
  }, [isCanGoBack, onPressHardwareBackButton]);

  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) {
        return;
      }
    };
    void requestPermission();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        className="flex-1 bg-white"
        edges={["top", "left", "right"]}
      >
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
          onMessage={({ nativeEvent: state }) => {
            if (state.data === "navigationStateChange") {
              // Navigation state updated, can check state.canGoBack, etc.
              setIsCanGoBack(state.canGoBack);
            }
          }}
          injectedJavaScript={`
        (function() {
          function wrap(fn) {
            return function wrapper() {
              var res = fn.apply(this, arguments);
              window.ReactNativeWebView.postMessage('navigationStateChange');
              return res;
            }
          }
          history.pushState = wrap(history.pushState);
          history.replaceState = wrap(history.replaceState);
          window.addEventListener('popstate', function() {
            window.ReactNativeWebView.postMessage('navigationStateChange');
          });
        })();
        true;
      `}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
