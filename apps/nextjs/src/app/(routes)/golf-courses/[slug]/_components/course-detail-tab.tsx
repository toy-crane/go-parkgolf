"use client";

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
  return (
    <Tabs defaultValue={selectedTab} className="mb-28 space-y-4">
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
