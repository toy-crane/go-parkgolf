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
import { zodResolver } from "@hookform/resolvers/zod";
import { MinusCircledIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import type * as z from "zod";

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
}

const GameCourseForm = ({ gameId }: FormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<Inputs>({
    shouldUnregister: true,
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      game_courses: [],
    },
  });

  const error = form.formState.errors.game_courses;

  const { fields, append, remove } = useFieldArray({
    name: "game_courses",
    control: form.control,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const { data: gameCourses } = await createGameCourse(gameId, values);
      const { data: gameScores } = await createGameScores(gameCourses);
      const { data: _ } = await createGamePlayerScores(gameId, gameScores);
      await updateGameStatus(gameId);
      router.replace(`/score-card/${gameId}`);
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-8 pb-12"
      >
        <div className="flex flex-col gap-2">
          <div className="flex gap-x-3">
            <FormLabel className="flex-1">코스 이름</FormLabel>
            <FormLabel className="flex-1">홀 수</FormLabel>
            <div className="w-4"></div>
          </div>
          {fields.length !== 0 && (
            <div className="mb-8 flex flex-col gap-2">
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
                              <Input {...field} />
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
          <div className="flex flex-col gap-2">
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
              <PlusCircledIcon className="mr-1 h-4 w-4" />
              코스 추가하기
            </Button>
            <FormDescription>최대 4개 코스까지 입력 가능합니다</FormDescription>
            <FormMessage>{error?.message}</FormMessage>
          </div>
        </div>

        <div className="flex">
          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            className="w-full"
          >
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

export default GameCourseForm;
