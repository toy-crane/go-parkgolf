import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { GolfCourse } from "@/types";

import CourseCommonInfo from "./course-common-info";
import NaverReviews from "./naver-review";
import NearCourseInfo from "./near-course-info";
import Reviews from "./reviews";

const CourseDetailTab = ({
  course,
  selectedTab,
}: {
  course: GolfCourse;
  selectedTab: string;
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
        <CourseCommonInfo course={course} />
      </TabsContent>
      <TabsContent value="review" className="min-h-[25vh] space-y-12">
        <Reviews course={course} />
        <Suspense
          fallback={
            <div className="mb-6">
              <h2 className="text-foreground text-xl font-bold">
                네이버 블로그 리뷰
              </h2>
              <div className="flex flex-col">
                {[...Array(5).keys()].map((_, index) => (
                  <Skeleton
                    key={index}
                    className="h-[36px] w-full rounded-md"
                  />
                ))}
              </div>
            </div>
          }
        >
          <NaverReviews courseName={course.name} />
        </Suspense>
      </TabsContent>
      <TabsContent value="near" className="min-h-[25vh] space-y-6">
        <NearCourseInfo course={course} />
      </TabsContent>
    </Tabs>
  );
};

export default CourseDetailTab;
