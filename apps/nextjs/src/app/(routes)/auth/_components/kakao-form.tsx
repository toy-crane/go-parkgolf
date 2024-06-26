"use client";

import { useSearchParams } from "next/navigation";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useUserAgentStore } from "@/libs/store/user-agent";
import createSupabaseBrowerClient from "@/libs/supabase/client";

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

const KakaoForm = ({ label }: { label?: string }) => {
  const isMobileApp = useUserAgentStore((state) => state.isMobileApp);
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";
  const redirectBaseUrl = `${location.origin}/auth/callback`;
  const redirectUrl = next
    ? `${redirectBaseUrl}?next=${next}`
    : redirectBaseUrl;
  const kakaoSignUp = async () => {
    if (isMobileApp) {
      window.ReactNativeWebView?.postMessage("kakaoSignUp");
    } else {
      const supabase = createSupabaseBrowerClient();
      await supabase.auth.signInWithOAuth({
        provider: "kakao",
        options: {
          redirectTo: redirectUrl,
        },
      });
    }
  };

  return (
    <Button
      className="w-full bg-[#faea05] text-black hover:bg-[#faea05]/60 md:w-[360px] md:self-center"
      size="lg"
      onClick={kakaoSignUp}
    >
      <Icons.kakao className="mr-1 h-5 w-5" />
      {label ? label : "카카오톡으로 시작하기"}
    </Button>
  );
};

export default KakaoForm;
