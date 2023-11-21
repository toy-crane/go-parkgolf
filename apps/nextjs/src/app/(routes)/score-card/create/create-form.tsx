"use client";

import React, { useState } from "react";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TagInput } from "@/components/ui/tag-input";
import type { Tag } from "@/components/ui/tag-input";
import { cn } from "@/libs/tailwind";
import type { Course } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarIcon,
  CaretSortIcon,
  MinusCircledIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  startDate: z.date(),
  courseId: z.string({
    required_error: "파크 골프장을 선택해 주세요.",
  }),
  members: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      }),
      { required_error: "게임 참여자를 입력해주세요." },
    )
    .min(1, { message: "게임 참여자 이름을 1명 이상 입력해주세요." })
    .max(4, { message: "게임 참여자는 최대 4명까지 입력 가능합니다." }),
  games: z
    .array(
      z.object({
        name: z.string(),
        hole_count: z.coerce.number(),
      }),
    )
    .max(4, { message: "코스는 최대 4개까지 입력 가능합니다." })
    .nonempty({ message: "게임을 하나 이상 등록해 주세요." }),
});

interface CreateFormProps {
  courses: Course[];
}

const CreateForm = ({ courses }: CreateFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: new Date(),
    },
  });

  const { setValue } = form;

  const [openSearch, setOpenSearch] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [tags, setTags] = React.useState<Tag[]>([]);

  const { fields, append, remove } = useFieldArray({
    name: "games",
    control: form.control,
  });

  const runCommand = React.useCallback((command: () => unknown) => {
    command();
    setOpenSearch(false);
  }, []);

  const courseOptions = courses.map((course) => ({
    title: course.name,
    value: String(course.id),
  }));

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    // Add your JSX code here
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="startDate"
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
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="courseId"
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
                          runCommand(() => form.setValue("courseId", value));
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
          name="members"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-left">게임 참여자 이름</FormLabel>
              <FormControl>
                <TagInput
                  {...field}
                  placeholder="참여자의 이름을 추가해주세요"
                  tags={tags}
                  borderStyle={"none"}
                  truncate={5}
                  maxTags={4}
                  minTags={1}
                  setTags={(newTags) => {
                    setTags(newTags);
                    setValue("members", newTags as [Tag, ...Tag[]]);
                  }}
                />
              </FormControl>
              <FormDescription>최대 4명까지 입력 가능합니다</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-2">
          <div className="flex gap-x-3">
            <FormLabel className="flex-1">코스 이름</FormLabel>
            <FormLabel className="flex-1">홀 수</FormLabel>
          </div>
          {fields.map((_, index) => {
            return (
              <div key={index}>
                <div className="flex gap-x-3">
                  <FormField
                    control={form.control}
                    key={index}
                    name={`games.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    key={index + 1}
                    name={`games.${index}.hole_count`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <button onClick={() => remove(index)} type="button">
                    <MinusCircledIcon />
                  </button>
                </div>
              </div>
            );
          })}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            disabled={fields.length >= 4}
            onClick={() =>
              append({
                name: ["A", "B", "C", "D"][fields.length]!,
                hole_count: 9,
              })
            }
          >
            <PlusCircledIcon className="mr-1" />
            코스 추가하기
          </Button>
          <FormDescription>최대 4개 코스까지 입력 가능합니다</FormDescription>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default CreateForm;
