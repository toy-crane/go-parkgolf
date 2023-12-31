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
  const { track } = useAmplitude();
  const { toast } = useToast();

  return (
    <div>
      <section className="mt-2">
        <StaticMap // 지도를 표시할 Container
          className="mb-8"
          marker={[
            {
              position: {
                lat: Number(course.lat),
                lng: Number(course.lng),
              },
              text: course.name,
            },
          ]}
          center={{
            // 지도의 중심좌표
            lat: Number(course.lat),
            lng: Number(course.lng),
          }}
          style={{
            // 지도의 크기
            width: "100%",
            height: "280px",
          }}
          level={6} // 지도의 확대 레벨
        />
      </section>
      <div className="mb-4 flex items-center justify-between gap-1">
        <h1 className="text-foreground text-balance break-keep text-left text-3xl font-bold">
          {course.name}
        </h1>
        <Button
          variant={"ghost"}
          size="icon"
          onClick={async () => {
            await navigator.clipboard.writeText(`${window.location.href}`);
            toast({
              title: "주소가 복사되었습니다",
              description: "원하는 곳에 붙여넣기(Ctrl+V)해주세요.",
              duration: 1000,
            });
            track("share button clicked");
          }}
        >
          <Share2 size={24} />
        </Button>
      </div>
      
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
