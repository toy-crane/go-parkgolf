"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { GolfCourse } from "@/types";

const CourseDetailTab = ({
  selectedTab,
  courseCommonInfo,
  nearCourseInfo,
  reviewInfo,
}: {
  course: GolfCourse;
  selectedTab: string;
  courseCommonInfo: React.ReactNode;
  reviewInfo: React.ReactNode;
  nearCourseInfo: React.ReactNode;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", String(value));
    router.replace(`?${params.toString()}`);
  };

  return (
    <Tabs
      defaultValue={selectedTab}
      className="mb-28 space-y-4"
      onValueChange={handleTabChange}
    >
      <TabsList className="flex">
        <TabsTrigger value="home" className="flex-1">
          홈
        </TabsTrigger>
        <TabsTrigger value="review" className="flex-1">
          리뷰
        </TabsTrigger>
        <TabsTrigger value="near" className="flex-1">
          주변
        </TabsTrigger>
      </TabsList>
      <TabsContent value="home" className="min-h-[25vh] space-y-6">
        {courseCommonInfo}
      </TabsContent>
      <TabsContent value="review" className="min-h-[25vh] space-y-12">
        {reviewInfo}
      </TabsContent>
      <TabsContent value="near" className="min-h-[25vh] space-y-6">
        {nearCourseInfo}
      </TabsContent>
    </Tabs>
  );
};

export default CourseDetailTab;
