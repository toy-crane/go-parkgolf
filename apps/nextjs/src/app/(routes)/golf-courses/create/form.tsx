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
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";

import { createGolfCourse } from "./actions";
import { formSchema } from "./schema";

export function GolfCourseForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const { golfCourseSlug } = await createGolfCourse(values);
      router.replace(`/golf-courses/${golfCourseSlug}`);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pb-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>파크골프장 이름</FormLabel>
              <FormControl>
                <Input
                  placeholder="파크골프장 이름을 입력해주세요."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hole_count"
          render={({ field }) => (
            <FormItem>
              <FormLabel>홀 수</FormLabel>
              <FormControl>
                <Input placeholder="홀 수를 입력해주세요." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>파크 골프장 주소</FormLabel>
              <FormControl>
                <Input
                  placeholder="도로명 혹은 지번 주소 입력해주세요"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>연락처</FormLabel>
              <FormControl>
                <Input
                  placeholder="파크골프장 연락처 입력해주세요"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="opening_hours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>영업 시간</FormLabel>
              <FormControl>
                <Input placeholder="영업 시간을 입력해주세요" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                예시: 09:00 ~ 18:00 (매주 월요일 휴무)
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="regular_close_days"
          render={({ field }) => (
            <FormItem>
              <FormLabel>정기 휴장 기간</FormLabel>
              <FormControl>
                <Input placeholder="정기 휴장 기간" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>예시: 매주 월요일</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>예약 페이지</FormLabel>
              <FormControl>
                <Input placeholder="예약 페이지를 입력해주세요" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>전체 URL을 입력해주세요</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="registration_method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>접수 방법</FormLabel>
              <FormControl>
                <Input placeholder="접수 방법를 입력해주세요" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                예시: 전화 접수, 성남 시민만 사용 가능
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>참고한 링크</FormLabel>
              <FormControl>
                <Input placeholder="참고 했던 링크를 입력해주세요" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>예시: 전체 URL 입력해주세요.</FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          저장
        </Button>
      </form>
    </Form>
  );
}
