"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useUserStore } from "@/libs/store/user";
import createSupabaseBrowerClient from "@/libs/supabase/client";
import type { Tables } from "@/types/generated";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronRight } from "lucide-react";

import ReviewContent from "./review-content";

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
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/avatars/01.png" alt="Image" />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">Sofia Davis</p>
              </div>
            </div>
            <div>
              {formatDistanceToNow(new Date(review.created_at), {
                addSuffix: true,
                locale: ko,
              })}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-1 md:flex-row md:gap-4">
              <div className="flex items-center gap-1">
                <span className="text-xs">코스 난이도</span>
                <div className="flex">
                  {[...Array(review.course_difficulty_rating).keys()].map(
                    (key) => (
                      <Icons.starFilled
                        className="h-4 w-4"
                        key={`${review.id}-${key}`}
                      />
                    ),
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs">코스 상태</span>
                <div className="flex">
                  {[...Array(review.course_condition_rating).keys()].map(
                    (key) => (
                      <Icons.starFilled
                        className="h-4 w-4"
                        key={`${review.id}-${key}`}
                      />
                    ),
                  )}
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
            <ReviewContent text={review.text} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Reviews;
