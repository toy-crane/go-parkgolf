"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAmplitude } from "@/libs/amplitude";
import type { GolfCourse } from "@/types";
import { Share2 } from "lucide-react";
import { StaticMap } from "react-kakao-maps-sdk";

import type { Review } from "../types";
import CourseDetailTab from "./course-detail-tab";

const CourseDetail = ({
  course,
  nearCourses,
  reviews,
  selectedTab,
}: {
  course: GolfCourse;
  nearCourses: GolfCourse[];
  reviews: Review[];
  selectedTab: string;
}) => {
  return (
    <div>
      <CourseDetailTab
        course={course}
        selectedTab={selectedTab}
        nearCourses={nearCourses}
        reviews={reviews}
      />
    </div>
  );
};

export default CourseDetail;
