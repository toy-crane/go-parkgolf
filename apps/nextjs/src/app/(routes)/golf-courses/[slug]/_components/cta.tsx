"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUserAgentStore } from "@/libs/store/user-agent";
import { track } from "@vercel/analytics/react";

const CTA = ({
  courseId,
  courseName,
}: {
  courseId: string;
  courseName: string;
}) => {
  const isMobileApp = useUserAgentStore((state) => state.isWebview);
  const route = isMobileApp
    ? `/score-card/create/golf-course?golfCourseId=${courseId}`
    : "/score-card";
  return (
    <Button className="mx-2 w-full" asChild>
      <Link href={route} onClick={() => track("create game CTA clicked")}>
        <span className="hidden md:inline-flex">
          {courseName} 스코어 기록하기
        </span>
        <span className="inline-flex md:hidden">파크골프 스코어 기록하기</span>
      </Link>
    </Button>
  );
};

export default CTA;
