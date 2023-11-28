"use server";

import { cookies } from "next/headers";
import { createFetch } from "@/libs/cache";
import type { Database } from "@/types/generated";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

import type { Player, PlayerKey, Score } from "./columns";

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
  const playerScoreData = scores.flatMap((score) => {
    return Object.keys(score).flatMap((key) => {
      if (key.startsWith("player")) {
        const playerKey = key as PlayerKey;
        const player = score[playerKey]!;
        return {
          score_id: score.id,
          participant_id: player?.id,
          player_score: player.score,
        };
      }
      return [];
    });
  });

  console.log("player score", playerScoreData);

  const scorePlaymerMutation = supabase
    .from("player_score")
    .upsert(playerScoreData)
    .select();

  const scorePlayerResponse = await scorePlaymerMutation;
  if (scorePlayerResponse.error) {
    throw new Error(scorePlayerResponse.error.message);
  }
}
