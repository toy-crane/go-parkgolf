"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { track } from "@vercel/analytics/react";

const CTA = ({
  courseName,
  courseId,
}: {
  courseName: string;
  courseId: string;
}) => {
  return (
    <Button className="w-[360px]" asChild>
      <Link
        href={`/score-card/create/golf-course?golfCourseId=${courseId}`}
        onClick={() => track("create game CTA clicked")}
      >
        {courseName} 스코어 기록하기
      </Link>
    </Button>
  );
};

export default CTA;
