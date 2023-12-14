"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import createSupabaseBrowerClient from "@/libs/supabase/client";

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

const KakaoForm = () => {
  const kakaoSignUp = async () => {
    window.ReactNativeWebView?.postMessage("kakaoSignUp");
    // const supabase = createSupabaseBrowerClient();
    // await supabase.auth.signInWithOAuth({
    //   provider: "kakao",
    //   options: {
    //     redirectTo: `${location.origin}/auth/callback`,
    //   },
    // });
  };

  return (
    <Button
      className="w-full bg-[#faea05] text-black hover:bg-[#faea05]/80"
      size="lg"
      onClick={kakaoSignUp}
    >
      <Icons.kakao className="mr-2" />
      카카오톡으로 시작하기
    </Button>
  );
};

export default KakaoForm;
