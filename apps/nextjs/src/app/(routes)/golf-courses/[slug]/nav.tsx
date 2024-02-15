"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAmplitude } from "@/libs/amplitude";
import { ArrowLeft } from "lucide-react";

const Nav = ({ courseId }: { courseId: string }) => {
  const router = useRouter();
  const { track } = useAmplitude();

  return (
    <header className="content-grid h-header full border-b bg-white">
      <nav className="md:content full flex flex-1 items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft size={24} />
        </Button>
        <Button
          size="sm"
          onClick={() => {
            router.push(
              `/score-card/create/golf-course?golfCourseId=${courseId}`,
            );
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
