"use client";

import Feedback from "@/components/feedback";
import type { GolfCourse } from "@/types";

const EmptyReview = ({ course }: { course: GolfCourse }) => {
  return (
    <div className="my-16 flex flex-col items-center justify-center gap-4">
      <Feedback
        golfCourseId={course.id}
        label={`${course?.name} 어떠셨나요?`}
      />
    </div>
  );
};

export default EmptyReview;
