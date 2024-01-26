"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/libs/store/user";
import createSupabaseBrowerClient from "@/libs/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Loader2, MoreHorizontal } from "lucide-react";

import type { Review } from "../types";
import ReviewContent from "./review-content";
import ReviewRating from "./review-rating";

const ReviewCard = ({ review }: { review: Review }) => {
  const user = useUserStore((state) => state.user);
  const params = useParams();
  const isMine = user?.id === review.user_id;

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: FormEvent<HTMLFormElement>, reviewId: string) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createSupabaseBrowerClient();
    const response = await supabase
      .from("golf_course_reviews")
      .delete()
      .match({ id: reviewId });
    setLoading(false);
    if (response.error) throw response.error;
    router.refresh();
  };

  return (
    <Card key={review.id}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pb-2 pt-4">
        <div className="flex items-center space-x-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={`${review.profiles?.avatar_url}`} alt="Image" />
            <AvatarFallback>{review.profiles?.username[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold leading-none">
              {review.profiles?.username}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="flex-1 text-xs font-normal">
            {formatDistanceToNow(new Date(review.created_at), {
              addSuffix: true,
              locale: ko,
            })}
          </span>
          {isMine && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="smIcon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link
                    href={`/golf-courses/${
                      params.slug as string
                    }/reviews/create`}
                  >
                    수정하기
                  </Link>
                </DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      삭제하기
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-lg">
                        리뷰 삭제하기
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        이 리뷰를 정말 삭제하시겠어요?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <form onSubmit={(e) => onSubmit(e, review.id)}>
                        <Button
                          className="flex w-full items-center gap-2"
                          disabled={loading}
                          variant="destructive"
                        >
                          {loading ? (
                            <Loader2
                              className="h-5 w-5 animate-spin"
                              size={24}
                            />
                          ) : (
                            "삭제"
                          )}
                        </Button>
                      </form>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 px-4 pb-2 pt-2">
        <ReviewRating review={review} />
        <ReviewContent text={review.text} />
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
