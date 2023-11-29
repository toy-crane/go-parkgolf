"use server";

import { cookies } from "next/headers";
import { createFetch } from "@/libs/cache";
import type { Database } from "@/types/generated";
import type { Tables } from "@/types/supabase-helper";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

import type { Player, PlayerKey, Score } from "./columns";

type PlayerScore = Tables<"player_score">;

function transformData(data: Score[]): PlayerScore[] {
  const result: PlayerScore[] = [];

  data.forEach((scoreData) => {
    for (let i = 1; i <= 4; i++) {
      const playerKey = `player${i}` as PlayerKey;
      const player = scoreData[playerKey]!;
      if (player) {
        result.push({
          score_id: scoreData.id,
          participant_id: player.participantId,
          player_score: player.playerScore,
        });
      }
    }
  });

  return result;
}

const cookieStore = cookies();

const supabase = createRouteHandlerClient<Database>(
  {
    cookies: () => cookieStore,
  },
  { options: { global: { fetch: createFetch({ cache: "force-cache" }) } } },
);

export async function saveScore(gameId: number, scores: Score[]) {
  console.log(
    scores.map((score) => ({
      id: score.id,
      game_course_id: gameId,
      hole_number: score.hole,
      par: score.par,
    })),
  );
  const scoreMutation = supabase
    .from("score")
    .upsert(
      scores.map((score) => ({
        id: score.id,
        game_course_id: gameId,
        hole_number: score.hole,
        par: score.par,
      })),
    )
    .select();
  const scoreResponse = await scoreMutation;

  if (scoreResponse.error) {
    throw new Error(scoreResponse.error.message);
  }

  const scorePlaymerMutation = supabase
    .from("player_score")
    .upsert(transformData(scores))
    .select();

  const scorePlayerResponse = await scorePlaymerMutation;
  if (scorePlayerResponse.error) {
    throw new Error(scorePlayerResponse.error.message);
  }
}
