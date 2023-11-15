import React from "react";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";

import AppCTA from "./app-cta";

const Footer = () => {
  const headersList = headers();
  const userAgent = headersList.get("user-agent")!;
  const rules = [
    "WebView",
    "(iPhone|iPod|iPad)(?!.*Safari/)",
    "Android.*(wv|.0.0.0)",
  ];
  const regex = new RegExp(`(${rules.join("|")})`, "ig");
  const isInApp = Boolean(userAgent.match(regex));

  return (
    <footer>
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex justify-end px-3 pb-3">
        <div className="flex flex-col gap-2">
          {!isInApp && <AppCTA />}
          <Button className="font-bold" asChild size="default">
            <a
              href="https://forms.gle/41DvTTg1Z3SrQpNQ8"
              target="_blank"
              rel="noopener noreferrer"
            >
              제작자에게 문의하기
            </a>
          </Button>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
