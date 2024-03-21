"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { generateStorage } from "@toss/storage";
import { Loader2 } from "lucide-react";

import { saveScore } from "../actions";
import { createScoreSchema } from "../schema";
import type { Score } from "../type";

const safeLocalStorage = generateStorage();

const SaveButton = ({
  gameId,
  playerIds,
  temporary = false,
}: {
  gameId: string;
  playerIds: string[];
  temporary?: boolean;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const scoreSchema = createScoreSchema(playerIds);
  const handleSave = () => {
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
      if (!temporary) router.replace(`/score-card/${gameId}/completed`);
    }
  };
  return (
    <Button
      size="sm"
      className="h-8 px-2"
      onClick={handleSave}
      disabled={isPending}
      variant={temporary ? "secondary" : "default"}
    >
      {isPending ? (
        <Loader2 className="h-5 w-12 animate-spin" size={24} />
      ) : temporary ? (
        "임시 저장"
      ) : (
        "게임 종료"
      )}
    </Button>
  );
};

export default SaveButton;
