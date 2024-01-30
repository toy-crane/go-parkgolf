"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { createSupabaseServerClient } from "@/libs/supabase/server";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createGolfCourseQnA } from "../action";
import type { QnA } from "../types";

export const formSchema = z.object({
  text: z
    .string()
    .min(10, { message: "최소 10자 이상 작성해주세요." })
    .max(500, { message: "최대 500자까지만 입력이 가능합니다." }), // 리뷰 텍스트: 최소 1자에서 최대 1000자
});

type Inputs = z.infer<typeof formSchema>;

const QnACard = ({ qna, replies }: { qna: QnA; replies: QnA[] }) => {
  const [isPending, startTransition] = useTransition();
  const [showInput, setShowInput] = useState(false);
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
      await createGolfCourseQnA({
        golfCourseId: qna.golf_course_id,
        text: data.text,
        parentId: qna.id,
        level: qna.level,
      });
      setShowInput(false);
      router.refresh();
    });
  }
  return (
    <Card key={qna.id}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pb-2 pt-4">
        <div className="flex items-center space-x-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={`${qna.profiles?.avatar_url}`} alt="Image" />
            <AvatarFallback>{qna.profiles?.username[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold leading-none">
              {qna.profiles?.username}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="flex-1 text-xs font-normal">
            {formatDistanceToNow(new Date(qna.created_at), {
              addSuffix: true,
              locale: ko,
            })}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col space-y-2 px-4 pb-4 pt-2">
        <p className="text-bg-background text-sm">{qna.content}</p>
        <div>
          {replies.map((reply) => (
            <div className="ml-4" key={reply.id}>
              <div className="flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center">
                  <Avatar className="h-7 w-7">
                    <AvatarImage
                      src={`${reply.profiles?.avatar_url}`}
                      alt="Image"
                    />
                    <AvatarFallback>
                      {reply.profiles?.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm leading-none">
                      {reply.profiles?.username}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="flex-1 text-xs font-normal">
                    {formatDistanceToNow(new Date(reply.created_at), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </span>
                </div>
              </div>
              <div key={reply.id} className="text-bg-background text-sm">
                {reply.content}
              </div>
            </div>
          ))}
        </div>

        {showInput ? (
          <div className="space-y-4">
            <Separator />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col space-y-2"
              >
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder={`댓글을 입력해 주세요`}
                          className="h-24 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="self-end">
                  <Button
                    type="submit"
                    size="xs"
                    disabled={isPending}
                    className="mr-1"
                  >
                    {isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" size={24} />
                    ) : (
                      "등록"
                    )}
                  </Button>
                  <Button
                    size="xs"
                    variant="secondary"
                    onClick={() => setShowInput(false)}
                  >
                    취소
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        ) : (
          <Button
            size="xs"
            className="self-end"
            variant="outline"
            onClick={() => setShowInput((showInput) => !showInput)}
          >
            답글 쓰기
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default QnACard;
