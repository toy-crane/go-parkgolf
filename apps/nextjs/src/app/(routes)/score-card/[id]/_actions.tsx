"use server";

import { cookies } from "next/headers";
import { createFetch } from "@/libs/cache";
import type { Database } from "@/types/generated";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

import type { Score } from "./columns";

const cookieStore = cookies();

const supabase = createRouteHandlerClient<Database>(
  {
    cookies: () => cookieStore,
  },
  { options: { global: { fetch: createFetch({ cache: "force-cache" }) } } },
);

export async function saveScore(gameId: number, scores: Score[]) {
  const scoreMutation = supabase
    .from("score")
    .insert(
      scores.map((score) => ({
        game_id: gameId,
        hole_number: score.hole,
        par: score.par,
      })),
    )
    .select();
  const scoreResponse = await scoreMutation;

  if (scoreResponse.error) {
    throw new Error(scoreResponse.error.message);
  }
  const scoreRows = scoreResponse.data;
  const scorePlaymerMutation = supabase
    .from("player_score")
    .insert(
      scoreRows.map((scoreRow) => ({
        score_id: scoreRow.id,
        participant_id: 1,
        player_score: 10,
      })),
    )
    .select();
  const scorePlayerResponse = await scorePlaymerMutation;
  if (scorePlayerResponse.error) {
    throw new Error(scorePlayerResponse.error.message);
  }
  console.log(scorePlayerResponse.data);
}
