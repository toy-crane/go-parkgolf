"use client";

import { useState } from "react";
import { Icons } from "@/components/icons";
import type { Tables } from "@/types/generated";
import { ChevronDown, ChevronUp } from "lucide-react";

const ReviewRating = ({
  review,
}: {
  review: Tables<"golf_course_reviews">;
}) => {
  const [open, setOpen] = useState(false);
  const averageRating =
    (review.course_condition_rating +
      review.course_difficulty_rating +
      review.facilities_rating) /
    3;
  return (
    <>
      <button
        onClick={() => setOpen((open) => !open)}
        className="flex items-center"
      >
        <Icons.starFilled className="mr-1 h-4 w-4" />
        <span className="text-sm font-semibold">
          {averageRating.toFixed(1)}
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      {open && (
        <div className="flex flex-col gap-1 md:flex-row md:gap-4">
          <div className="flex items-center gap-1">
            <span className="text-xs">코스 난이도</span>
            <div className="flex">
              {[...Array(review.course_difficulty_rating).keys()].map((key) => (
                <Icons.starFilled
                  className="h-4 w-4"
                  key={`${review.id}-${key}`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs">코스 상태</span>
            <div className="flex">
              {[...Array(review.course_condition_rating).keys()].map((key) => (
                <Icons.starFilled
                  className="h-4 w-4"
                  key={`${review.id}-${key}`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs">편의시설</span>
            <div className="flex">
              {[...Array(review.facilities_rating).keys()].map((key) => (
                <Icons.starFilled
                  className="h-4 w-4"
                  key={`${review.id}-${key}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewRating;
