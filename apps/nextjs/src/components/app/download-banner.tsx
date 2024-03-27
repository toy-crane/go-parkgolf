"use client";

import { useState } from "react";
import Image from "next/image";
import { useUserAgentStore } from "@/libs/store/user-agent";
import { generateSessionStorage } from "@toss/storage";
import { track } from "@vercel/analytics/react";
import { X } from "lucide-react";

import { Button } from "../ui/button";

const safeLocalStorage = generateSessionStorage();

const DownloadBanner = ({ isApp }: { isApp: boolean }) => {
  const isMobileApp = useUserAgentStore((state) => state.isMobileApp);
  const [showInstallBanner, setShowInstallBanner] = useState(
    safeLocalStorage.get("show-install-banner") ? false : true,
  );
  if (!showInstallBanner || isMobileApp) return null;
  return (
    <div className="bg-muted content-grid z-header sticky top-0">
      <div className="content flex items-center justify-between py-2">
        <div className="flex items-center gap-4">
          <Image
            src="/logo.png"
            width={36}
            height={36}
            alt="Logo"
            className="align-middle"
          />
          <div className="text-muted-foreground text-[0.6rem] leading-tight tracking-tight">
            파크 골프장 검색, 스코어 기록까지 한번에!
            <br />앱 설치 후 사용해보세요
            <a
              href="https://play.google.com/store/apps/details?id=app.goparkgolf.www"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 underline underline-offset-2"
              onClick={() => track("download-banner-click")}
            >
              앱 다운로드
            </a>
          </div>
        </div>
        <Button
          variant={"ghost"}
          size="smIcon"
          onClick={() => {
            setShowInstallBanner(false);
            safeLocalStorage.set("show-install-banner", "false");
          }}
        >
          <X className="bg-muted h-4 w-4" color="#BBB" />
        </Button>
      </div>
    </div>
  );
};

export default DownloadBanner;
