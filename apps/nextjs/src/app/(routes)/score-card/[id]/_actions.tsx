"use server";

import { createSupabaseServerClient } from "@/libs/supabase/server";

import type { Score } from "./type";

export async function saveScore(gameId: number, scores: Score[]) {
  const supabase = createSupabaseServerClient();
  const scoreMutation = supabase
    .from("score")
    .upsert(
      scores.map((score) => ({
        id: score.id,
        game_course_id: gameId,
        hole_number: score.holeNumber,
        par: score.par,
      })),
    )
    .select();
  const scoreResponse = await scoreMutation;
  if (scoreResponse.error) {
    throw new Error(scoreResponse.error.message);
  }

  const player_scores = scores
    .map((score) =>
      Object.keys(score).flatMap((key) => {
        const keyAsNumber = Number(key);
        if (!isNaN(keyAsNumber)) {
          return {
            player_score: score[key]!,
            score_id: score.id,
            participant_id: Number(key),
          };
        }
        return [];
      }),
    )
    .flat();

  const scorePlaymerMutation = supabase
    .from("player_score")
    .upsert(player_scores)
    .select();

  const scorePlayerResponse = await scorePlaymerMutation;
  if (scorePlayerResponse.error) {
    throw new Error(scorePlayerResponse.error.message);
  }
}
