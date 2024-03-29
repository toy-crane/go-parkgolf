"use server";

import { revalidatePath } from "next/cache";
import { alertDiscord } from "@/libs/discord";
import { createSupabaseServerClient } from "@/libs/supabase/server";

export const deleteGame = async (gameId: string) => {
  const supabase = await createSupabaseServerClient();
  const response = await supabase
    .from("games")
    .update({ status: "deleted" })
    .eq("id", gameId)
    .select();
  await alertDiscord(
    "https://discord.com/api/webhooks/1220250085560946788/pcl_NCPpZOUTEJ2jt3gpAN4ovmoAskXEKF-XrBrq5OnrnpOtP1TKOPDzotr_RSHylpiq",
    `game delted. URL: https://www.goparkgolf.app/score-card/${gameId}`,
  );
  if (response.error) throw response.error;
  revalidatePath("/my-games", "page");
  return { success: true };
};
