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

import { createGamePlayer } from "./actions";
import { formSchema } from "./schema";

type Inputs = z.infer<typeof formSchema>;

interface FormProps {
  gameId: string;
}

const PlayerForm = ({ gameId }: FormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<Inputs>({
    shouldUnregister: false,
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      players: [],
    },
  });

  const error = form.formState.errors.players;

  const { fields, append, remove } = useFieldArray({
    name: "players",
    control: form.control,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      console.log(values);
      const result = await createGamePlayer(gameId, values);
      if (result.success) {
        const params = new URLSearchParams();
        params.set("gameId", gameId);
        router.replace(`/score-card/create/game-course?${params.toString()}`);
      }
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 pb-12"
      >
        <div className="flex flex-col space-y-1">
          <FormLabel className="flex-1">선수 이름</FormLabel>
          <FormDescription>최대 4명까지 입력 가능합니다</FormDescription>
        </div>
        <div className="space-y-2">
          {fields.map((_, index) => {
            return (
              <div key={index}>
                <div className="flex gap-x-3">
                  <FormField
                    control={form.control}
                    key={index}
                    name={`players.${index}.nickname`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={fields.length >= 4}
          onClick={() =>
            append({
              nickname: "",
            })
          }
        >
          <PlusCircledIcon className="mr-1 h-4 w-4" />
          선수 추가하기
        </Button>
        <FormMessage>{error?.message}</FormMessage>
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

export default PlayerForm;
