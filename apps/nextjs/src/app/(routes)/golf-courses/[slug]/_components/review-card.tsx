import Link from "next/link";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useUserStore } from "@/libs/store/user";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

import type { Review } from "../types";
import ReviewContent from "./review-content";
import ReviewDeleteAlert from "./review-delete-alert";
import ReviewRating from "./review-rating";

const ReviewCard = ({ review }: { review: Review }) => {
  const user = useUserStore((state) => state.user);
  const params = useParams();
  return (
    <Card key={review.id}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center space-x-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={`${review.profiles?.avatar_url}`} alt="Image" />
            <AvatarFallback>
              {review.profiles?.username.split(" ")[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold leading-none">
              {review.profiles?.username}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex-1 text-xs font-normal">
            {formatDistanceToNow(new Date(review.created_at), {
              addSuffix: true,
              locale: ko,
            })}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <ReviewRating review={review} />
        <ReviewContent text={review.text} />
      </CardContent>
      <CardFooter className="justify-end gap-2">
        {user?.id === review.user_id && (
          <>
            <Button size="sm" asChild>
              <Link
                href={`/golf-courses/${params.slug as string}/reviews/create`}
              >
                수정하기
              </Link>
            </Button>
            <ReviewDeleteAlert golfCourseReviewId={review.id} />
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default ReviewCard;
