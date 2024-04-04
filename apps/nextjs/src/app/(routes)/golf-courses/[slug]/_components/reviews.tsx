import { Icons } from "@/components/icons";
import type { GolfCourse } from "@/types";

import { GetReviews } from "../action";
import CreateReviewButton from "./create-review-button";
import EmptyReview from "./empty-review";
import NaverReviews from "./naver-review";
import ReviewCard from "./review-card";

const ReviewInfo = async ({ course }: { course: GolfCourse }) => {
  const reviews = await GetReviews(course?.id);
  return (
    <section className="mb-8 space-y-8">
      {reviews.length === 0 ? (
        <EmptyReview course={course} />
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icons.starFilled className="mr-1 h-6 w-6" />
              <span>리뷰 {reviews.length}</span>
            </div>
            <CreateReviewButton course={course} />
          </div>
          {reviews.map((review) => (
            <ReviewCard review={review} key={review.id} courseId={course.id} />
          ))}
        </div>
      )}
      <NaverReviews courseName={course.name} />
    </section>
  );
};

export default ReviewInfo;
