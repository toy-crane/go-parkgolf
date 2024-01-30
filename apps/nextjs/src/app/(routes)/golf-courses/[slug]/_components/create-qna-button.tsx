"use client";

import { useRouter } from "next/navigation";
import type { GolfCourse } from "@/types";
import { Pencil } from "lucide-react";

const CreateQnAButton = ({ course }: { course: GolfCourse }) => {
  const router = useRouter();
  return (
    <button
      className="flex items-center gap-1 self-end text-sm font-semibold"
      onClick={() => router.push(`/golf-courses/${course.slug}/qna/create`)}
    >
      <span>질문하기</span>
      <Pencil className="h-3 w-3" />
    </button>
  );
};

export default CreateQnAButton;
