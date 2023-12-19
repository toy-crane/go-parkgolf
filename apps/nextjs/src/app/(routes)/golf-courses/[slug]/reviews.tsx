"use client";

import { useEffect, useState } from "react";
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
import createSupabaseBrowerClient from "@/libs/supabase/client";
import type { Tables } from "@/types/generated";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

import ReviewContent from "./review-content";
import ReviewRating from "./review-rating";

const supabase = createSupabaseBrowerClient();

const Reviews = ({
  golfCourseId,
  slug,
}: {
  golfCourseId: number;
  slug: string;
}) => {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Tables<"golf_course_reviews">[]>([]);
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    getReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getReviews() {
    const { data, error } = await supabase
      .from("golf_course_reviews")
      .select("*")
      .eq("golf_course_id", golfCourseId);
    if (error) throw error;
    setReviews(data);
    setLoading(false);
  }

  if (loading) {
    return null;
  }

  return (
    <div>
      {reviews.length === 0 ? (
        <div className="mt-20 flex flex-col items-center justify-center gap-4">
          <span className="text-center text-lg font-semibold">
            다른 파크골퍼들을 위해 <br />
            리뷰를 등록해 주세요
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
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/avatars/01.png" alt="Image" />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">Sofia Davis</p>
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
          <CardContent className="space-y-4">
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
