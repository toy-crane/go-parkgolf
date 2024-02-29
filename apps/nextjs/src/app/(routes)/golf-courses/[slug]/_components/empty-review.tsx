"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { GolfCourse } from "@/types";
import Balancer from "react-wrap-balancer";

const EmptyReview = ({ course }: { course: GolfCourse }) => {
  const router = useRouter();
  return (
    <div className="my-16 flex flex-col items-center justify-center gap-4 md:my-24">
      <span className="text-center text-lg font-semibold">
        <Balancer>소중한 파크골프가자의 첫 리뷰를 작성해주세요</Balancer>
      </span>
      <Button
        variant="outline"
        onClick={() =>
          router.push(`/golf-courses/${course.slug}/reviews/create`)
        }
      >
        첫 리뷰 등록하기
      </Button>
    </div>
  );
};

export default EmptyReview;
