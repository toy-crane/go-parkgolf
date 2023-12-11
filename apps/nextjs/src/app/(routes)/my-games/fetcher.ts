import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import { Tables } from "@/types/generated";
import camelcaseKeys from "camelcase-keys";
import type camalcaseKeys from "camelcase-keys";

export const getMyGames = async () => {
  const supabase = await createSupabaseServerClientReadOnly();

  const { data: response, error } = await supabase
    .from("games")
    .select("*, golf_course(name), game_courses(*), game_players(*)")
    .in("status", ["in_progress", "completed"])
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;
  const data = camelcaseKeys(response, { deep: true });
  if (!data) throw error;
  return data;
};
