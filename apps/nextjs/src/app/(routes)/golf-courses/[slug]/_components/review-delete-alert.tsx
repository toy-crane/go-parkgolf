"use client";

import type { ChangeEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import createSupabaseBrowerClient from "@/libs/supabase/client";
import { Loader2 } from "lucide-react";

const DeleteAlert = ({
  golfCourseReviewId,
}: {
  golfCourseReviewId: string;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createSupabaseBrowerClient();
    const response = await supabase
      .from("golf_course_reviews")
      .delete()
      .match({ id: golfCourseReviewId });
    setLoading(false);
    if (response.error) throw response.error;
    router.refresh();
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="secondary">
          삭제하기
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg">리뷰 삭제하기</AlertDialogTitle>
          <AlertDialogDescription>
            이 리뷰를 정말 삭제하시겠어요?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <form onSubmit={onSubmit}>
            <Button
              className="flex w-full items-center gap-2"
              disabled={loading}
              variant="destructive"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" size={24} />
              ) : (
                "삭제"
              )}
            </Button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAlert;
