"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
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

import { createGolfCourseQnA } from "./actions";
import { formSchema } from "./schema";

type Inputs = z.infer<typeof formSchema>;

const QnAForm = ({ course }: { course: Tables<"golf_courses"> }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      text: "",
    },
  });

  function onSubmit(data: Inputs) {
    startTransition(async () => {
      await createGolfCourseQnA(course.id, data);
      router.back();
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 pb-12 pt-4"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Q&A</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={`${course.name}에 대한 궁금한 점을 입력해주세요.`}
                  className="h-24 resize-none"
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
          <Label htmlFor="message-3">Q&A 정책</Label>
          <p className="text-muted-foreground text-sm">
            파크 골프장과 무관한 내용이나 허위 및 과장, 비방이 포함된 내용은
            관리자에 의해 삭제될 수 있습니다.
          </p>
        </div>
        <Button type="submit" size="lg" disabled={isPending} className="w-full">
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" size={24} />
          ) : (
            "등록"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default QnAForm;
