"use client";

import { useRouter } from "next/navigation";
import type { GolfCourse } from "@/types";
import { Pencil } from "lucide-react";

const CreateReviewButton = ({ course }: { course: GolfCourse }) => {
  const router = useRouter();
  return (
    <button
      className="flex items-center gap-1 text-sm font-semibold"
      onClick={() => router.push(`/golf-courses/review/create?id=${course.id}`)}
    >
      <span>리뷰 작성하기</span>
      <Pencil className="h-3 w-3" />
    </button>
  );
};

export default CreateReviewButton;
