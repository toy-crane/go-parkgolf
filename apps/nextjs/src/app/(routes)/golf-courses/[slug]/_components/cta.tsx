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
    <Button asChild size="sm" className="mx-2 w-full text-sm">
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
