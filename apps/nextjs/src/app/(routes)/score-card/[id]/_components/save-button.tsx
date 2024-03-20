"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { generateStorage } from "@toss/storage";
import { Loader2 } from "lucide-react";
import { z } from "zod";

import { saveScore } from "../actions";
import { createSchema } from "../schema";
import type { Score } from "../type";

const safeLocalStorage = generateStorage();

const SaveButton = ({
  gameId,
  playerIds,
}: {
  gameId: string;
  playerIds: string[];
}) => {
  const [isPending, startTransition] = useTransition();
  const handleSave = () => {
    const scoreSchema = z.array(
      createSchema({
        id: z.string(),
        gameCourseId: z.string(),
        holeNumber: z.number(),
        par: z.number(),
        ...playerIds.reduce((acc: Record<string, z.ZodType<any>>, id) => {
          acc[id] = z.number();
          return acc;
        }, {}),
      }),
    );
    const changedScoresGroup = JSON.parse(
      safeLocalStorage.get(`${gameId}-changed-scores`) ?? "[]",
    ) as Score[];
    const result = scoreSchema.safeParse(changedScoresGroup);
    if (result.success === false) {
      return;
    }
    if (result.success) {
      startTransition(async () => {
        await saveScore(gameId, result.data as Score[]);
      });
      safeLocalStorage.remove(`${gameId}-changed-scores`);
    }
  };
  return (
    <Button
      size="sm"
      className="h-8 px-2"
      onClick={handleSave}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="h-5 w-5 animate-spin" size={24} />
      ) : (
        "게임 종료"
      )}
    </Button>
  );
};

export default SaveButton;
