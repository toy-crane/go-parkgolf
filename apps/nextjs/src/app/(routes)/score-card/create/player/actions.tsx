"use server";

import { createSupabaseServerClient } from "@/libs/supabase/server";
import { addMilliseconds } from "date-fns";
import type { z } from "zod";

import type { formSchema } from "./schema";

type Inputs = z.infer<typeof formSchema>;

export async function createGamePlayer(gameId: string, inputs: Inputs) {
  const supabase = await createSupabaseServerClient();
  const players = inputs.players;
  const response = await supabase
    .from("game_players")
    .insert(
      players.map((p, index) => ({
        game_id: gameId,
        nickname: p.nickname,
        // 밀리초 단위로 created_at 값에 차이를 줌
        created_at: addMilliseconds(new Date(), index).toISOString(),
      })),
    )
    .select();
  if (response.error) {
    throw new Error(response.error.message);
  }
  return { success: true, data: response.data };
}
