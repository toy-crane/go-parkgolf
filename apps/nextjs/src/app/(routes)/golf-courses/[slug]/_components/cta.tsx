"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { isApp } from "@/libs/user-agent";
import { track } from "@vercel/analytics/react";

const CTA = ({ courseId }: { courseId: string }) => {
  const routeUrl = isApp(navigator.userAgent)
    ? `/score-card/create/golf-course?golfCourseId=${courseId}`
    : "/score-card";
  return (
    <Button className="min-w-[320px]" asChild>
      <Link href={routeUrl} onClick={() => track("create game CTA clicked")}>
        파크골프 스코어 기록하기
      </Link>
    </Button>
  );
};

export default CTA;
