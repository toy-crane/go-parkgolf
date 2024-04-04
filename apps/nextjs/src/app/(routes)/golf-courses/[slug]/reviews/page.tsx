import { Icons } from "@/components/icons";

import CreateReviewButton from "../_components/create-review-button";
import EmptyReview from "../_components/empty-review";
import NaverReviews from "../_components/naver-review";
import ReviewCard from "../_components/review-card";
import { GetReviews } from "../action";
import { getCourse } from "../fetcher";

const ReviewInfo = async ({ params }: { params: { slug: string } }) => {
  const course = await getCourse(params.slug);
  const reviews = await GetReviews(course.id);
  return (
    <div className="min-h-[25vh] space-y-6">
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
            <ReviewCard review={review} key={review.id} />
          ))}
        </div>
      )}
      <NaverReviews courseName={course.name} />
    </div>
  );
};

export default ReviewInfo;
