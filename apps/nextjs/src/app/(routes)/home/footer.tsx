"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAmplitude } from "@/libs/amplitude";

const Footer = () => {
  const { track } = useAmplitude();
  return (
    <footer>
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex justify-end px-3 pb-3">
        <div className="flex flex-col gap-2">
          <Button className="font-bold" asChild size="default">
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
          <Button className="font-bold" asChild size="default">
            <a
              href="https://forms.gle/41DvTTg1Z3SrQpNQ8"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("contact button clicked")}
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
