import type { Review } from "../types";
import EmptyReview from "./empty-review";
import ReviewCard from "./review-card";

const Reviews = ({ reviews }: { reviews: Review[] }) => {
  return (
    <div>
      {reviews.length === 0 ? (
        <EmptyReview />
      ) : (
        reviews.map((review) => <ReviewCard review={review} key={review.id} />)
      )}
    </div>
  );
};

export default Reviews;
