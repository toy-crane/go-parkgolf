import { Icons } from "@/components/icons";
import type { GolfCourse } from "@/types";

import { GetReviews } from "../action";
import CreateReviewButton from "./create-review-button";
import EmptyReview from "./empty-review";
import ReviewCard from "./review-card";

const Reviews = async ({ course }: { course: GolfCourse }) => {
  const reviews = await GetReviews(course?.id);
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
            <CreateReviewButton course={course} />
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
