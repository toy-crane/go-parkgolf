import React from "react";
import { headers } from "next/headers";

import AppCTA from "./app-cta";

const Footer = () => {
  const headersList = headers();
  const userAgent = headersList.get("user-agent")!;
  const rules = ["(iPhone|iPod|iPad)(?!.*Safari/)", "Android.*(wv|.0.0.0)"];
  const exceptions = ["kakaotalk", "naver"];
  const regex = new RegExp(`(${rules.join("|")})`, "ig");
  const exceptionRegex = new RegExp(`(${exceptions.join("|")})`, "i");

  // userAgent에 예외가 포함되어 있지 않고, 정규 표현식 규칙에 맞는 경우만 isInApp이 true가 됩니다.
  const isInApp =
    !userAgent.match(exceptionRegex) && Boolean(userAgent.match(regex));

  return (
    <footer>
      <nav className="z-header fixed bottom-[calc(var(--bottom-nav-height)+2px)] left-0 right-0 flex justify-end px-3 pb-3">
        <div className="flex flex-col gap-2">{!isInApp && <AppCTA />}</div>
      </nav>
    </footer>
  );
};

export default Footer;
