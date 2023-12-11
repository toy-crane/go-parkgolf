"use client";

import React, { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/libs/tailwind";
import type { Tables } from "@/types/generated";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, CaretSortIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import type * as z from "zod";

import { makeGame } from "./actions";
import { formSchema } from "./schema";

type Inputs = z.infer<typeof formSchema>;

interface FormProps {
  courses: Tables<"golf_course">[];
}

const CourseForm = ({ courses }: FormProps) => {
  const [openSearch, setOpenSearch] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const runCommand = useCallback((command: () => unknown) => {
    command();
    setOpenSearch(false);
  }, []);

  const courseOptions = courses.map((course) => ({
    title: course.name,
    value: course.id,
  }));

  const form = useForm<Inputs>({
    shouldUnregister: false,
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      startedAt: new Date(),
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const result = await makeGame(values);
      if (result.success) {
        const params = new URLSearchParams();
        params.set("gameId", String(result.data.id));
        router.replace(`/score-card/create/player?${params.toString()}`);
      }
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-12">
        <FormField
          control={form.control}
          name="golfCourseId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>파크 골프장 이름</FormLabel>
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
                            form.setValue("golfCourseId", value),
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
        <FormField
          control={form.control}
          name="startedAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>게임 날짜</FormLabel>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP p", { locale: ko })
                      ) : (
                        <span>날짜 선택</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    locale={ko}
                    selected={field.value}
                    onSelect={(e) => {
                      field.onChange(e);
                      setIsCalendarOpen(false);
                    }}
                    disabled={(date) => date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="bottom-cta content-grid">
          <Button type="submit" size="lg" disabled={isPending}>
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
