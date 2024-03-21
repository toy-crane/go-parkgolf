"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { alertDiscord } from "@/libs/discord";
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
    // 현재 페이지를 revalidate하는 것이 안됨
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
        await alertDiscord(
          "https://discord.com/api/webhooks/1220252481578209310/lkCY71F5jSjdC_BijOL1-XX8-8RaNiMzb37MxI6OUSOMg6x6gO3LgNFm_lZQBAyaeQo6",
          `게임이 종료되었습니다. URL: https://www.goparkgolf.app/score-card/${gameId}/completed`,
        );
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
