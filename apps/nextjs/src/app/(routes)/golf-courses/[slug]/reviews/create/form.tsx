"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Tables } from "@/types/generated";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { createGolfCourseReview } from "./actions";
import { formSchema } from "./schema";

type StarProps = {
  active: boolean;
} & React.HTMLAttributes<SVGElement>;

const Star = ({ active, ...props }: StarProps) => {
  return active ? (
    <Icons.starFilled {...props} />
  ) : (
    <Icons.starOutline {...props} />
  );
};

const RatingItems = [
  {
    label: "코스 상태",
    name: "courseConditionRating",
    value: 1,
  },
  {
    label: "코스 난이도",
    name: "courseDifficultyRating",
    value: 2,
  },
  {
    label: "편의시설",
    name: "facilitiesRating",
    value: 3,
  },
] as const;

type Inputs = z.infer<typeof formSchema>;

const ReviewForm = ({
  course,
  review,
  courseConditionRating,
}: {
  course: Tables<"golf_courses">;
  review?: Inputs;
  courseConditionRating?: number;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      text: review?.text ?? "",
      facilitiesRating: review?.facilitiesRating ?? 0,
      courseConditionRating:
        courseConditionRating ?? review?.courseConditionRating ?? 0,
      courseDifficultyRating: review?.courseDifficultyRating ?? 0,
    },
  });

  function onSubmit(data: Inputs) {
    startTransition(async () => {
      await createGolfCourseReview(course.id, data);
      router.back();
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-10 pb-12 pt-8"
      >
        <div className="space-y-4">
          {RatingItems.map((item) => (
            <FormField
              key={item.name}
              control={form.control}
              name={item.name}
              render={({ field: { onChange, value } }) => (
                <>
                  <div className="space-y-2">
                    <div
                      className="flex items-center justify-center gap-3"
                      key={value}
                    >
                      <span className="w-24 text-lg font-semibold">
                        {item.label}
                      </span>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            active={i <= value}
                            key={i}
                            className="h-6 w-6 cursor-pointer transition-all"
                            onClick={() => onChange(i)}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <FormMessage />
                    </div>
                  </div>
                </>
              )}
            />
          ))}
        </div>
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>리뷰</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="파크 골퍼들에게 도움이 되는 따뜻한 리뷰를 작성해 주세요."
                  className="h-48 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                {form.getValues("text").length}/500
              </FormDescription>
            </FormItem>
          )}
        />
        <div>
          <Label htmlFor="message-3">파크골프가자 리뷰정책</Label>
          <p className="text-muted-foreground text-sm">
            파크 골프장과 무관한 내용이나 허위 및 과장, 비방이 포함된 내용은
            관리자에 의해 삭제될 수 있습니다.
          </p>
        </div>
        <Button type="submit" size="lg" disabled={isPending} className="w-full">
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" size={24} />
          ) : review ? (
            "수정"
          ) : (
            "등록"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ReviewForm;
