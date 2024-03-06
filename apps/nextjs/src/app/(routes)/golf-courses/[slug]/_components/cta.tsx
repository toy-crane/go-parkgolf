"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUserAgentStore } from "@/libs/store/user-agent";
import { track } from "@vercel/analytics/react";

const CTA = ({ courseId }: { courseId: string }) => {
  const isMobileApp = useUserAgentStore((state) => state.isMobileApp);
  const route = isMobileApp
    ? `/score-card/create/golf-course?golfCourseId=${courseId}`
    : "/score-card";
  return (
    <Button className="min-w-[320px]" asChild>
      <Link href={route} onClick={() => track("create game CTA clicked")}>
        파크골프 스코어 기록하기
      </Link>
    </Button>
  );
};

export default CTA;
