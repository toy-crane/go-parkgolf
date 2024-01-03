"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { GolfCourse } from "@/types";
import type { Tables } from "@/types/generated";

import CourseDetail from "../../golf-courses/[slug]/_components/course-detail";

interface CourseSheetProps {
  selectedCourse?: GolfCourse;
  nearCourses: GolfCourse[];
  reviews: Tables<"golf_course_reviews">[];
  open: boolean;
}

const CourseDetailSheet = ({
  open,
  selectedCourse,
  nearCourses,
  reviews,
}: CourseSheetProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "home";

  if (selectedCourse === undefined) return null;

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        const params = new URLSearchParams(searchParams);
        params.set("modal", String(open));
        if (!open) {
          params.delete("courseId");
        }
        router.replace(`?${params.toString()}`);
      }}
    >
      <SheetContent
        className=" w-full px-4 pb-4 md:px-48"
        side={"bottom"}
        scrollable
      >
        <CourseDetail
          course={selectedCourse}
          nearCourses={nearCourses}
          reviews={reviews}
          selectedTab={tab}
        />
      </SheetContent>
    </Sheet>
  );
};

export default CourseDetailSheet;
