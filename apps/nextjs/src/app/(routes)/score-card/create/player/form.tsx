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
import { zodResolver } from "@hookform/resolvers/zod";
import { MinusCircledIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { generateStorage } from "@toss/storage";
import { useFieldArray, useForm } from "react-hook-form";
import type * as z from "zod";

import BottomCTA from "../_components/bottom-cta";
import RecentBadge from "../_components/recent-badge";
import { createGamePlayer } from "./actions";
import PlayerFormDrawer from "./player-form-drawer";
import { formSchema } from "./schema";

type Inputs = z.infer<typeof formSchema>;

interface FormProps {
  gameId: string;
}

const safeLocalStorage = generateStorage();

const PlayerForm = ({ gameId }: FormProps) => {
  const [open, setOpen] = React.useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number>();
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

  const { fields, append, remove, update } = useFieldArray({
    name: "players",
    control: form.control,
  });

  const isValid = form.formState.isValid;

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
        className="flex flex-col space-y-12 pb-20"
      >
        <div className="flex flex-col">
          <div className="mb-4 flex flex-col space-y-1">
            <FormLabel className="flex-1">선수 이름</FormLabel>
            <FormDescription>최대 4명까지 입력 가능합니다</FormDescription>
          </div>
          {fields.length !== 0 && (
            <div className="mb-1 space-y-1">
              {fields.map((_, index) => {
                return (
                  <div key={index}>
                    <div className="flex gap-x-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start pl-0"
                        type="button"
                        onClick={() => {
                          setSelectedPlayerId(index);
                          setOpen(true);
                        }}
                      >
                        {fields[index]?.nickname}
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
            type="button"
            onClick={() => {
              setSelectedPlayerId(undefined);
              setOpen((prev) => !prev);
            }}
          >
            <PlusCircledIcon className="mr-1 h-4 w-4" />
            새로운 선수 추가하기
          </Button>
          {recentPlayers.length !== 0 && (
            <div className="mb-2">
              <div className="text-muted-foreground mb-1 text-xs">
                최근 함께한 선수
              </div>
              <div className="flex flex-wrap gap-2">
                {recentPlayers.map((name) => (
                  <RecentBadge
                    key={name}
                    onClick={() => {
                      append(
                        {
                          nickname: name,
                        },
                        {
                          shouldFocus: false,
                        },
                      );
                      setRecentPlayers((prev) =>
                        prev.filter((p) => p !== name),
                      );
                    }}
                  >
                    {name} <PlusCircledIcon className="ml-1 h-3 w-3" />
                  </RecentBadge>
                ))}
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
      <PlayerFormDrawer
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
        }}
        values={
          selectedPlayerId !== undefined
            ? fields[selectedPlayerId]
            : {
                nickname: "",
              }
        }
        onSubmit={(values) => {
          if (selectedPlayerId !== undefined) {
            update(selectedPlayerId, values);
          } else {
            append(values);
          }
        }}
      />
    </Form>
  );
};

export default PlayerForm;
