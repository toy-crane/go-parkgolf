"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUserAgentStore } from "@/libs/store/user-agent";
import { track } from "@vercel/analytics/react";

const CTA = () => {
  const isMobileApp = useUserAgentStore((state) => state.isWebview);
  return (
    <>
      {isMobileApp ? (
        <Button asChild className="w-full">
          <Link
            href={`/score-card/create/golf-course`}
            onClick={() => track("create game CTA clicked")}
          >
            파크골프 스코어 기록하기
          </Link>
        </Button>
      ) : (
        <Button
          className="w-full font-bold"
          asChild
          size="sm"
          variant="secondary"
        >
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
      )}
    </>
  );
};

export default CTA;
