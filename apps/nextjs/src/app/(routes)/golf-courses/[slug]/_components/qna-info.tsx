"use client";

import type { Course, GolfCourse } from "@/types";

import CreateQnAButton from "./create-qna-button";

const QnaInfo = ({ course }: { course: GolfCourse }) => {
  return (
    <div className="flex justify-end">
      <CreateQnAButton course={course} />
    </div>
  );
};

export default QnaInfo;
