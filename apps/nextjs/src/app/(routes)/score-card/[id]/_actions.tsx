"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/libs/supabase/server";

import type { Score } from "./type";

export async function saveScore(scores: Score[]) {
  console.log("RUNNING SERVER ACTION");
  const supabase = await createSupabaseServerClient();
  const scoreMutation = supabase
    .from("game_score")
    .upsert(
      scores.map((score) => ({
        id: score.id,
        game_course_id: score.gameCourseId,
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
    .map((score) => {
      const keys = Object.keys(score) as (keyof typeof score)[];
      return keys.flatMap((key) => {
        const commonKeys = ["id", "gameCourseId", "holeNumber", "par"];
        if (!commonKeys.includes(String(key))) {
          return {
            score: Number(score[key]),
            game_score_id: score.id,
            game_player_id: String(key),
          };
        }
        return [];
      });
    })
    .flat();

  const scorePlaymerMutation = supabase
    .from("game_player_score")
    .upsert(player_scores)
    .select();

  const scorePlayerResponse = await scorePlaymerMutation;
  if (scorePlayerResponse.error) {
    throw new Error(scorePlayerResponse.error.message);
  }

  revalidatePath("/score-card/[id]", "page");
  console.log("SERVER ACTION DONE");
  return { success: true };
}
