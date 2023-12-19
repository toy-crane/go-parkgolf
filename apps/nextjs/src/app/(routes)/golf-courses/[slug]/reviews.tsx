"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import Balancer from "react-wrap-balancer";

import ReviewContent from "./review-content";
import ReviewRating from "./review-rating";
import type { Review } from "./types";

const Reviews = ({ slug, reviews }: { reviews: Review[]; slug: string }) => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  return (
    <div>
      {reviews.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center gap-4 md:mt-20">
          <span className="text-center text-lg font-semibold">
            <Balancer>소중한 파크골프가자의 첫 리뷰를 작성해주세요</Balancer>
          </span>
          <Button
            onClick={() => router.push(`/golf-courses/${slug}/reviews/create`)}
          >
            첫 리뷰 등록하기
          </Button>
        </div>
      ) : null}
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center space-x-2">
              <Avatar className="h-7 w-7">
                <AvatarImage
                  src={`${review.profiles?.avatar_url}`}
                  alt="Image"
                />
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
          <CardFooter className="justify-end">
            {user?.id === review.user_id && (
              <Button size="sm" asChild>
                <Link href={`/golf-courses/${slug}/reviews/create`}>
                  수정하기
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Reviews;
