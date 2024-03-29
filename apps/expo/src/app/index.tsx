import React, { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as Linking from "expo-linking";
import * as Location from "expo-location";
import * as WebBrowser from "expo-web-browser";
import type { Session } from "@supabase/supabase-js";

import { originAllowList, serviceAllowList } from "~/configs/origin-allow-list";
import { supabase } from "~/lib/supabase";

const redirectTo = makeRedirectUri();

const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;

  if (!access_token || !refresh_token) return;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) throw error;
  return data.session;
};

export default function Home() {
  const webViewRef = useRef<WebView>(null);
  const [isCanGoBack, setIsCanGoBack] = useState(false);
  const [session, setSession] = useState<Session | null | undefined>(null);

  const signInWithKakao = async (): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "kakao",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      const res = await WebBrowser.openAuthSessionAsync(
        data?.url ?? "",
        redirectTo,
        {
          createTask: false,
        },
      );
      if (res.type === "success") {
        const { url } = res;
        const data = await createSessionFromUrl(url);
        setSession(data);
      }
    } catch (error) {
      console.error("login err", error);
    }
  };

  const reloadWebView = () => webViewRef.current?.reload();

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
          pullToRefreshEnabled
          onContentProcessDidTerminate={reloadWebView}
          // android에서 이미지 나오도록 설정
          mixedContentMode="compatibility"
          originWhitelist={originAllowList}
          textZoom={100}
          onShouldStartLoadWithRequest={(request) => {
            // Only allow navigating within this website
            if (serviceAllowList.some((url) => request.url.startsWith(url))) {
              return true;
            } else {
              void Linking.openURL(request.url);
              return false;
            }
          }}
          source={{
            uri: process.env.EXPO_PUBLIC_WEB_URL!,
            headers: {
              "X-Access-Token": session?.access_token ?? undefined,
              "X-Refresh-Token": session?.refresh_token ?? undefined,
              "X-Is-Mobile-App": "true",
            },
          }}
          onMessage={async ({ nativeEvent: state }) => {
            if (state.data === "navigationStateChange") {
              setIsCanGoBack(state.canGoBack);
            } else if (state.data === "kakaoSignUp") {
              await signInWithKakao();
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
