"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAmplitude } from "@/libs/amplitude";
import { generateFormUrl } from "@/libs/google-form";
import { ArrowLeft, Pencil, Share2 } from "lucide-react";

const Nav = ({ courseName }: { courseName: string }) => {
  const router = useRouter();
  const { track } = useAmplitude();

  return (
    <header className="content-grid full h-header flex items-center border-b bg-white">
      <nav className="flex flex-1 items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft size={24} />
        </Button>
        <Button
          size="sm"
          onClick={() => {
            router.push("/score-card/create/golf-course");
            track("create game button clicked");
          }}
        >
          게임 기록하기
        </Button>
      </nav>
    </header>
  );
};

export default Nav;
