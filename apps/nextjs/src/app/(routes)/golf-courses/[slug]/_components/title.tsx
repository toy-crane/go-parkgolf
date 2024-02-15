"use client";

import { cn } from "@/libs/tailwind";
import type { GolfCourse } from "@/types";

import ShareDrawer from "./share-drawer";

const Title = ({
  course,
  className,
}: {
  course: GolfCourse;
  className?: string;
}) => {
  return (
    <div
      className={cn(className, "mb-4 flex items-center justify-between gap-1")}
    >
      <h1 className="text-foreground text-balance break-keep text-left text-3xl font-bold">
        {course.name}
      </h1>
      <ShareDrawer golfCourse={course} />
    </div>
  );
};

export default Title;
