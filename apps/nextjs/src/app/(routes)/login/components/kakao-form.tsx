"use client";

import { Button } from "@/components/ui/button";
import createSupabaseBrowerClient from "@/libs/supabase/client";

const KakaoForm = () => {
  const kakaoSignUp = async () => {
    const supabase = createSupabaseBrowerClient();
    await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <Button className="w-full" size="lg" onClick={kakaoSignUp}>
      카카오로 3초만에 시작하기
    </Button>
  );
};

export default KakaoForm;
