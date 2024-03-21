"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/libs/supabase/server";
import type { Tables } from "@/types/generated";

import type { Score } from "./type";

async function updateHoles(scores: Score[]) {
  const supabase = await createSupabaseServerClient();
  const scoreMutation = supabase
    .from("game_scores")
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
}

const updatePlayersScore = async (scores: Score[]) => {
  const supabase = await createSupabaseServerClient();
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

  const scorePlayerMutation = supabase
    .from("game_player_scores")
    .upsert(player_scores, { onConflict: "game_score_id, game_player_id" })
    .select();

  const scorePlayerResponse = await scorePlayerMutation;
  if (scorePlayerResponse.error) {
    throw new Error(scorePlayerResponse.error.message);
  }
};

const completedGame = async (
  gameId: string,
  status: Tables<"games">["status"],
) => {
  const supabase = await createSupabaseServerClient();
  const game = {
    status,
    ...(status === "completed" && { finished_at: new Date().toISOString() }),
  };
  const gameMutation = supabase
    .from("games")
    .update(game)
    .eq("id", gameId)
    .select();
  const gameMutationResponse = await gameMutation;
  if (gameMutationResponse.error) {
    throw new Error(gameMutationResponse.error.message);
  }
};

export async function saveScore(
  gameId: string,
  scores: Score[],
  status: Tables<"games">["status"],
) {
  await Promise.all([updateHoles(scores), updatePlayersScore(scores)]);
  await completedGame(gameId, status);

  revalidatePath(`/score-card/${gameId}`, "page");
  revalidatePath(`/score-card/${gameId}/completed`, "page");
  revalidatePath("/my-games");
  return { success: true };
}
