"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { track } from "@vercel/analytics/react";

const CTA = ({
  courseId,
  courseName,
}: {
  courseId: string;
  courseName: string;
}) => {
  return (
    <Button className="w-full" asChild>
      <Link
        href={`/score-card/create/golf-course?golfCourseId=${courseId}`}
        onClick={() => track("create game CTA clicked")}
      >
        <span className="hidden md:inline-flex">
          {courseName} 스코어 기록하기
        </span>
        <span className="inline-flex md:hidden">파크골프 스코어 기록하기</span>
      </Link>
    </Button>
  );
};

export default CTA;
