"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAmplitude } from "@/libs/amplitude";

const AppCTA = () => {
  const { track } = useAmplitude();
  return (
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
  );
};

export default AppCTA;
