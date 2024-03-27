"use client";

import React, { useTransition } from "react";
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
import { Separator } from "@/components/ui/separator";
import { alertDiscord } from "@/libs/discord";
import type { Course } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { MinusCircledIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { track } from "@vercel/analytics";
import { Loader2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import type * as z from "zod";

import BottomCTA from "../_components/bottom-cta";
import RecentBadge from "../_components/recent-badge";
import {
  createGameCourse,
  createGamePlayerScores,
  createGameScores,
  updateGameStatus,
} from "./actions";
import { formSchema } from "./schema";

type Inputs = z.infer<typeof formSchema>;

interface FormProps {
  gameId: string;
  courses?: Course[];
  courseName: string;
}

const GameCourseForm = ({ gameId, courses, courseName }: FormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<Inputs>({
    shouldUnregister: true,
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const error =
    form.formState.errors.game_courses?.root ??
    form.formState.errors.game_courses;
  const isValid = form.formState.isValid;

  const { fields, append, remove } = useFieldArray({
    name: "game_courses",
    control: form.control,
  });

  // 키 다운 이벤트를 처리하는 함수
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.nativeEvent.isComposing) {
      event.preventDefault();
      (event.currentTarget as HTMLInputElement).blur();
    }
  };
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const { data: gameCourses } = await createGameCourse(gameId, values);
      const { data: gameScores } = await createGameScores(gameCourses, courses);
      const { data: _ } = await createGamePlayerScores(gameId, gameScores);
      await updateGameStatus(gameId);
      await alertDiscord(
        "https://discord.com/api/webhooks/1214862790557302855/VswlUCBgVgoZq1nrRLWNh6x-XFaWIXMty9wSfegDYF7IwxBbDwK_h5kmq-B3eXJPBRSy",
        `new game created. URL: https://www.goparkgolf.app/score-card/${gameId}`,
      );
      track("game created");
      router.replace(`/score-card/${gameId}`);
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col pb-20"
      >
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="justify-start pl-0 hover:bg-white"
          disabled={fields.length >= 4}
          onClick={() =>
            append({
              name: "",
              hole_count: 9,
            })
          }
        >
          <PlusCircledIcon className="mr-1 h-4 w-4" />
          나만의 코스 추가하기
        </Button>
        <Separator className="mb-4 mt-1" />
        <div className="flex flex-col">
          <div className="mb-0.5 flex gap-x-3">
            <FormLabel className="flex-1">코스 이름</FormLabel>
            <FormLabel className="flex-1">홀 수</FormLabel>
            <div className="w-4"></div>
          </div>
          <div className="mb-3 flex flex-col gap-2">
            <FormDescription>최대 4개 코스까지 입력 가능합니다</FormDescription>
            <FormMessage>{error?.message}</FormMessage>
          </div>
          {fields.length !== 0 && (
            <div className="mb-3 flex flex-col gap-2">
              {fields.map((_, index) => {
                return (
                  <div key={index}>
                    <div className="flex gap-x-3">
                      <FormField
                        control={form.control}
                        key={index}
                        name={`game_courses.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...field} onKeyDown={handleKeyDown} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        key={index + 1}
                        name={`game_courses.${index}.hole_count`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                pattern="[0-9]*"
                                inputMode="numeric"
                                onKeyDown={handleKeyDown}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <button onClick={() => remove(index)} type="button">
                        <MinusCircledIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {courses && courses.length > 0 && (
            <div>
              <div className="text-muted-foreground mb-0.5 text-xs">
                정규 코스 추가
              </div>
              <div className="flex flex-wrap gap-1">
                {courses.map(({ name, holes }) => {
                  const isDuplicate = fields.some(
                    (field) => field.name === name,
                  );
                  const newName = isDuplicate
                    ? `${name}-${
                        fields.filter((field) => field.name.startsWith(name))
                          .length + 1
                      }`
                    : name;
                  return (
                    <RecentBadge
                      key={name}
                      onClick={() => {
                        append(
                          {
                            name: newName,
                            hole_count: holes?.length ?? 0,
                          },
                          {
                            shouldFocus: false,
                          },
                        );
                      }}
                    >
                      {newName} 코스
                      <PlusCircledIcon className="ml-1 h-3 w-3" />
                    </RecentBadge>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <BottomCTA
          label="다음 단계로"
          disabled={isPending || !isValid}
          loading={isPending}
        />
      </form>
    </Form>
  );
};

export default GameCourseForm;
