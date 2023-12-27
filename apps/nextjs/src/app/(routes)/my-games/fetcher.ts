import { readUserSession } from "@/libs/auth";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import camelcaseKeys from "camelcase-keys";

export const getMyGames = async () => {
  const session = await readUserSession();

  if (!session) throw new Error("User session not found");

  const supabase = await createSupabaseServerClientReadOnly();

  const { data: response, error } = await supabase
    .from("games")
    .select("*, golf_courses(*), game_courses(*), game_players(*)")
    .eq("user_id", session.user.id)
    .in("status", ["in_progress", "completed"])
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;
  const data = camelcaseKeys(response, { deep: true });
  if (!data) throw error;
  return data;
};
