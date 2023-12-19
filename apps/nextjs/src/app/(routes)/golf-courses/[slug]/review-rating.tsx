"use client";

import { Icons } from "@/components/icons";
import type { Tables } from "@/types/generated";

const ReviewRating = ({
  review,
}: {
  review: Tables<"golf_course_reviews">;
}) => {
  return (
    <div className="flex flex-col gap-1 md:flex-row md:gap-4">
      <div className="flex items-center gap-1">
        <span className="text-xs">코스 난이도</span>
        <div className="flex">
          {[...Array(review.course_difficulty_rating).keys()].map((key) => (
            <Icons.starFilled className="h-4 w-4" key={`${review.id}-${key}`} />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs">코스 상태</span>
        <div className="flex">
          {[...Array(review.course_condition_rating).keys()].map((key) => (
            <Icons.starFilled className="h-4 w-4" key={`${review.id}-${key}`} />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs">편의시설</span>
        <div className="flex">
          {[...Array(review.facilities_rating).keys()].map((key) => (
            <Icons.starFilled className="h-4 w-4" key={`${review.id}-${key}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewRating;
