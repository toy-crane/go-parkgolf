"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { useAmplitude } from "@/libs/amplitude";
import type { GolfCourse } from "@/types";
import type { Tables } from "@/types/generated";
import { Share2 } from "lucide-react";
import { StaticMap } from "react-kakao-maps-sdk";

import CourseDetailTab from "../../golf-courses/[slug]/_components/course-detail-tab";

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
  const { track } = useAmplitude();
  const { toast } = useToast();
  const tab = searchParams.get("tab") ?? "home";

  if (selectedCourse === undefined) return null;

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        const params = new URLSearchParams(searchParams);
        params.set("modal", String(open));
        router.replace(`?${params.toString()}`);
      }}
    >
      <SheetContent
        className=" w-full px-4 pb-4 md:px-48"
        side={"bottom"}
        scrollable
      >
        <section className="mt-2">
          <StaticMap // 지도를 표시할 Container
            className="mb-8"
            marker={[
              {
                position: {
                  lat: Number(selectedCourse.lat),
                  lng: Number(selectedCourse.lng),
                },
                text: selectedCourse.name,
              },
            ]}
            center={{
              // 지도의 중심좌표
              lat: Number(selectedCourse.lat),
              lng: Number(selectedCourse.lng),
            }}
            style={{
              // 지도의 크기
              width: "100%",
              height: "280px",
            }}
            level={6} // 지도의 확대 레벨
          />
        </section>
        <div className="mb-6 flex flex-col justify-between gap-2 md:flex-row md:items-center md:gap-1">
          <div className="flex justify-between gap-1 md:items-center">
            <h1 className="text-foreground text-balance break-keep text-left text-2xl font-bold">
              {selectedCourse.name}
            </h1>
            <Button
              variant={"ghost"}
              size="smIcon"
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
          <Button
            size="sm"
            className=""
            onClick={() => {
              router.push(
                `/score-card/create/golf-course?golfCourseId=${selectedCourse.id}`,
              );
              track("create game button clicked");
            }}
          >
            스코어 기록하기
          </Button>
        </div>
        <CourseDetailTab
          course={selectedCourse}
          selectedTab={tab}
          nearCourses={nearCourses}
          reviews={reviews}
        />
      </SheetContent>
    </Sheet>
  );
};

export default CourseDetailSheet;
