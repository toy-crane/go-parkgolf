"use client";

import Image from "next/image";
import { cn } from "@/libs/tailwind";
import { track } from "@vercel/analytics";

const AdBanner = ({ className }: { className?: string }) => {
  return (
    <div className={cn(className)}>
      <a
        href="https://link.coupang.com/a/bthmUW"
        onClick={() => {
          track("coupang-ad-clicked");
        }}
        target="_blank"
        referrerPolicy="unsafe-url"
        rel="noreferrer"
      >
        <Image
          src="https://ads-partners.coupang.com/banners/763407?subId=&traceId=V0-301-efafde73812c2264-I763407&w=728&h=90"
          width={728}
          height={90}
          alt="coupang ad"
        />
        <div className="mt-1 flex justify-center text-[8px] text-slate-500">
          이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를
          제공받습니다.
        </div>
      </a>
    </div>
  );
};

export default AdBanner;
