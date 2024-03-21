"use client";

import React, { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/libs/tailwind";
import type { GolfCourse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { generateStorage } from "@toss/storage";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import type * as z from "zod";

import RecentBadge from "../_components/recent-badge";
import { makeGame } from "./actions";
import { formSchema } from "./schema";

type Inputs = z.infer<typeof formSchema>;

interface FormProps {
  courses: GolfCourse[];
  golfCourseId?: string;
}

const safeLocalStorage = generateStorage();

function updateRecentGolfCourses(newGolfCourseId: string) {
  const maxCourses = 3;
  const recentGolfCourse = safeLocalStorage.get("recent_golf_course");
  const recentGolfCourses = recentGolfCourse?.split(",") ?? [];

  // 중복 제거: 새로운 골프 코스 ID가 이미 배열에 있다면 먼저 제거
  const filteredGolfCourses = recentGolfCourses.filter(
    (course) => course !== newGolfCourseId,
  );

  // 최신 5개 유지: 필터링된 배열에 새로운 ID를 추가하고, 마지막 3개 요소만 유지
  const updatedRecentGolfCourses = [
    ...filteredGolfCourses,
    newGolfCourseId,
  ].slice(-maxCourses);

  safeLocalStorage.set(
    "recent_golf_course",
    updatedRecentGolfCourses.join(","),
  );
}

const CourseForm = ({ courses, golfCourseId }: FormProps) => {
  const [openSearch, setOpenSearch] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const recentGolfCourse = safeLocalStorage.get("recent_golf_course");
  const [recentGolfCourses, setRecentGolfCourses] = useState<string[]>([]);

  React.useEffect(() => {
    setRecentGolfCourses(recentGolfCourse?.split(",") ?? []);
  }, []);

  const runCommand = useCallback((command: () => unknown) => {
    command();
    setOpenSearch(false);
  }, []);

  const courseOptions = courses.map((course) => ({
    title: `${course.name} (${
      course.lot_number_addresses?.region_1depth_name ?? ""
    }${
      course.lot_number_addresses?.region_2depth_name
        ? ` ${course.lot_number_addresses?.region_2depth_name}`
        : ""
    })`,
    value: course.id,
  }));

  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      golfCourseId,
    },
  });

  const isValid = form.formState.isValid;

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const result = await makeGame(values);
      if (result.success) {
        const params = new URLSearchParams();
        params.set("gameId", String(result.data.id));
        updateRecentGolfCourses(values.golfCourseId);
        router.replace(`/score-card/create/player?${params.toString()}`);
      }
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-20">
        <FormField
          control={form.control}
          name="golfCourseId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>파크 골프장 이름</FormLabel>
              {recentGolfCourses.length !== 0 && (
                <div className="mb-1">
                  <div className="text-muted-foreground mb-0.5 text-xs">
                    최근 선택한 골프장
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {recentGolfCourses.map((id) => (
                      <RecentBadge
                        key={id}
                        onClick={() => {
                          form.setValue("golfCourseId", id, {
                            shouldValidate: true,
                          });
                          setRecentGolfCourses((prev) =>
                            prev.filter((p) => p !== id),
                          );
                        }}
                      >
                        {courses.find((c) => c.id === id)?.name}
                        <PlusCircledIcon className="ml-1 h-3 w-3" />
                      </RecentBadge>
                    ))}
                  </div>
                </div>
              )}
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  onClick={() => setOpenSearch(true)}
                  type="button"
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {field.value
                    ? courseOptions.find((c) => c.value === field.value)?.title
                    : "파크골프장 선택"}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
              <CommandDialog open={openSearch} onOpenChange={setOpenSearch}>
                <CommandInput placeholder="주소 또는 이름을 입력해주세요." />
                <CommandList>
                  <CommandEmpty>해당하는 검색 결과가 없습니다.</CommandEmpty>
                  <CommandGroup>
                    {courseOptions.map(({ value, title }) => (
                      <CommandItem
                        key={value}
                        value={title}
                        onSelect={() => {
                          runCommand(() =>
                            form.setValue("golfCourseId", value, {
                              shouldValidate: true,
                            }),
                          );
                        }}
                      >
                        {title}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </CommandDialog>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="bottom-cta content-grid">
          <Button type="submit" size="lg" disabled={isPending || !isValid}>
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" size={24} />
            ) : (
              "다음 단계로"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CourseForm;
