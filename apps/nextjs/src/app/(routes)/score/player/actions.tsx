"use server";

import { createSupabaseServerClient } from "@/libs/supabase/server";
import type { z } from "zod";

import type { formSchema } from "./schema";

type Inputs = z.infer<typeof formSchema>;

export async function createGamePlayer(gameId: string, inputs: Inputs) {
  const supabase = await createSupabaseServerClient();
  const players = inputs.players;
  const response = await supabase
    .from("game_players")
    .insert(
      players.map((p) => ({
        game_id: gameId,
        nickname: p.nickname,
      })),
    )
    .select();

  if (response.error) {
    throw new Error(response.error.message);
  }
  return { success: true, data: response.data };
}
