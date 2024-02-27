"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
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
import { generateStorage } from "@toss/storage";
import { Loader2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import type * as z from "zod";

import { createGamePlayer } from "./actions";
import { formSchema } from "./schema";

type Inputs = z.infer<typeof formSchema>;

interface FormProps {
  gameId: string;
}

const safeLocalStorage = generateStorage();

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

  const [recentPlayers, setRecentPlayers] = React.useState<string[]>([]);

  React.useEffect(() => {
    setRecentPlayers(safeLocalStorage.get("recent_players")?.split(",") ?? []);
  }, []);

  const error =
    form.formState.errors.players?.root ?? form.formState.errors.players;

  const { fields, append, remove } = useFieldArray({
    name: "players",
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
      const result = await createGamePlayer(gameId, values);
      if (result.success) {
        const params = new URLSearchParams();
        params.set("gameId", gameId);
        router.replace(`/score-card/create/game-course?${params.toString()}`);
      }
      safeLocalStorage.set(
        "recent_players",
        values.players.map((p) => p.nickname).join(","),
      );
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-12 pb-12"
      >
        <div className="flex flex-col">
          <div className="mb-4 flex flex-col space-y-1">
            <FormLabel className="flex-1">선수 이름</FormLabel>
            <FormDescription>최대 4명까지 입력 가능합니다</FormDescription>
          </div>
          {fields.length !== 0 && (
            <div className="mb-8 space-y-2">
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
                              <Input {...field} onKeyDown={handleKeyDown} />
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
          )}
          {recentPlayers.length !== 0 && (
            <div className="mb-1">
              <div className="text-muted-foreground text-xs">
                최근 함께한 선수들
              </div>
              {recentPlayers.map((name) => (
                <Badge
                  key={name}
                  variant="secondary"
                  className="mr-2 cursor-pointer"
                  onClick={() => {
                    append({
                      nickname: name,
                    });
                    setRecentPlayers((prev) => prev.filter((p) => p !== name));
                  }}
                >
                  {name} <PlusCircledIcon className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          )}
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
          <FormMessage className="mt-1">{error?.message}</FormMessage>
        </div>
        <div className="flex gap-2">
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

export default PlayerForm;
