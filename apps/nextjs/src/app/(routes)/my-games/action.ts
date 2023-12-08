"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/libs/supabase/server";

export const deleteGame = async (gameId: string) => {
  const supabase = await createSupabaseServerClient();
  const response = await supabase.from("games").delete().match({ id: gameId });
  if (response.error) throw response.error;
  revalidatePath("/my-games", "page");
  return { success: true };
};
