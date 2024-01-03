"use client";

import { useParams, useRouter } from "next/navigation";
import { Icons } from "@/components/icons";
import type { GolfCourse } from "@/types";
import { Pencil } from "lucide-react";

import type { Review } from "../types";
import EmptyReview from "./empty-review";
import ReviewCard from "./review-card";

const Reviews = ({
  reviews,
  course,
}: {
  reviews: Review[];
  course: GolfCourse;
}) => {
  const router = useRouter();

  // TODO: 리뷰의 갯수가 많아지면 개선
  const totalAverage =
    reviews.reduce((acc, review) => {
      return (
        acc +
        (review.course_condition_rating +
          review.course_difficulty_rating +
          review.facilities_rating) /
          3
      );
    }, 0) / reviews.length;

  return (
    <div>
      {reviews.length === 0 ? (
        <EmptyReview course={course} />
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icons.starFilled className="mr-1 h-6 w-6" />
              <span className="mr-2 font-semibold">
                {totalAverage.toFixed(1)}
              </span>
              <span>리뷰 {reviews.length}</span>
            </div>
            <button
              className="flex items-center gap-1 text-sm font-semibold"
              onClick={() =>
                router.push(`/golf-courses/${course.slug}/reviews/create`)
              }
            >
              <span>리뷰 작성하기</span>
              <Pencil className="h-3 w-3" />
            </button>
          </div>
          {reviews.map((review) => (
            <ReviewCard review={review} key={review.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
