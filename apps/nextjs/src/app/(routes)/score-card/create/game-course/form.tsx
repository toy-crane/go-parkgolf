"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormDescription,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { alertDiscord } from "@/libs/discord";
import type { Course } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { MinusCircledIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { track } from "@vercel/analytics";
import { fi } from "date-fns/locale";
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
import GameCourseFormDrawer from "./game-course-form-drawer";
import { formSchema } from "./schema";

type Inputs = z.infer<typeof formSchema>;

interface FormProps {
  gameId: string;
  courses?: Course[];
}

const GameCourseForm = ({ gameId, courses }: FormProps) => {
  const [selectedCourseId, setSelectedCourseId] = useState<number>();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const form = useForm<Inputs>({
    shouldUnregister: true,
    mode: "onChange",
    resolver: zodResolver(formSchema),
    values: {
      game_courses: courses?.map(({ name, holes }) => ({
        name,
        hole_count: holes?.length ?? 0,
      })) ?? [{ name: "A", hole_count: 9 }],
    },
  });

  const error =
    form.formState.errors.game_courses?.root ??
    form.formState.errors.game_courses;
  const isValid = form.formState.isValid;

  const { fields, append, remove, replace } = useFieldArray({
    name: "game_courses",
    control: form.control,
  });

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
        <div className="flex flex-col">
          <div className="mb-0.5 flex gap-x-3">
            <FormLabel className="flex-1">코스 이름</FormLabel>
          </div>
          <div className="mb-4 flex flex-col gap-2">
            <FormDescription>최대 4개 코스까지 입력 가능합니다</FormDescription>
          </div>
          {fields.length !== 0 && (
            <div className="mb-3 flex flex-col gap-2">
              {fields.map((_, index) => {
                return (
                  <div key={index}>
                    <div className="flex gap-x-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start pl-0"
                        type="button"
                        onClick={() => {
                          setSelectedCourseId(index);
                          setOpen(true);
                        }}
                      >
                        <div className="flex flex-1 gap-2">
                          <div>{fields[index]?.name} 코스</div>
                          <span className="text-secondary-foreground opacity-20">
                            |
                          </span>
                          <div>{fields[index]?.hole_count} 홀</div>
                        </div>
                      </Button>
                      <Button
                        onClick={() => remove(index)}
                        type="button"
                        variant="ghost"
                        tabIndex={-1}
                      >
                        <MinusCircledIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mb-2 space-y-2">
            <Separator />
            <FormMessage>{error?.message}</FormMessage>
          </div>
          <Button
            variant="secondary"
            disabled={fields.length >= 4}
            className="mb-2"
            onClick={() => {
              setSelectedCourseId(undefined);
              setOpen((prev) => !prev);
            }}
            type="button"
          >
            <PlusCircledIcon className="mr-1 h-4 w-4" />
            나만의 코스 추가하기
          </Button>
          {courses && courses.length > 0 && (
            <div>
              <div className="text-muted-foreground mb-1 text-xs">
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
      <GameCourseFormDrawer
        open={open}
        onOpenChange={setOpen}
        values={
          selectedCourseId !== undefined
            ? fields[selectedCourseId]
            : {
                name: "",
                hole_count: 0,
              }
        }
        onSubmit={(values) => {
          if (selectedCourseId !== undefined) {
            replace([
              ...fields.slice(0, selectedCourseId),
              { ...fields[selectedCourseId], ...values },
              ...fields.slice(selectedCourseId + 1),
            ]);
            setSelectedCourseId(undefined);
          } else {
            append(values);
          }
        }}
      />
    </Form>
  );
};

export default GameCourseForm;
