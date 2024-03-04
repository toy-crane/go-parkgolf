"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { isApp } from "@/libs/user-agent";
import { track } from "@vercel/analytics/react";

const CTA = () => {
  return isApp(navigator.userAgent) ? (
    <Button className="w-full" asChild>
      <Link href="/score-card/create/golf-course">스코어 기록하기</Link>
    </Button>
  ) : (
    <Button className="w-full font-bold" asChild size="sm" variant="secondary">
      <a
        href="https://play.google.com/store/apps/details?id=app.goparkgolf.www"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("android app install button clicked")}
      >
        <Image
          width={16}
          height={16}
          className="mr-2"
          src={"/icons/google-play.svg"}
          alt="google play icon"
        />
        안드로이드 앱 설치
      </a>
    </Button>
  );
};

export default CTA;
