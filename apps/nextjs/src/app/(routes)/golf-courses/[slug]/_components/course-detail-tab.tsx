"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { GolfCourse } from "@/types";
import { track } from "@vercel/analytics";

const CourseDetailTab = ({
  selectedTab,
  nearCourseInfo,
}: {
  course: GolfCourse;
  selectedTab: string;
  nearCourseInfo: React.ReactNode;
}) => {
  return (
    <Tabs
      defaultValue={selectedTab}
      className="mb-40 space-y-4"
      onValueChange={(value) => track(`golf-course-${value}-tab-clicked`)}
    >
      <TabsList className="flex">
        <TabsTrigger value="course" className="flex-1">
          코스
        </TabsTrigger>
        <TabsTrigger value="nearCourse" className="flex-1">
          주변
        </TabsTrigger>
      </TabsList>
      <TabsContent value="nearCourse" className="min-h-[25vh] space-y-6">
        {nearCourseInfo}
      </TabsContent>
    </Tabs>
  );
};

export default CourseDetailTab;
