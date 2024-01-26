import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { GolfCourse } from "@/types";

import type { Review } from "../types";
import CourseCommonInfo from "./course-common-info";
import NearCourseInfo from "./near-course-info";
import Reviews from "./reviews";

const CourseDetailTab = ({
  course,
  selectedTab,
}: {
  course: GolfCourse;
  reviews: Review[];
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
      <TabsContent value="review" className="min-h-[25vh] space-y-6">
        <Reviews course={course} />
      </TabsContent>
      <TabsContent value="near" className="min-h-[25vh] space-y-6">
        <NearCourseInfo course={course} />
      </TabsContent>
    </Tabs>
  );
};

export default CourseDetailTab;
