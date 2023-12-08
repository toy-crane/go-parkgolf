import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import camelcaseKeys from "camelcase-keys";

export const getMyGames = async () => {
  const supabase = await createSupabaseServerClientReadOnly();

  const { data: response, error } = await supabase
    .from("games")
    .select(
      "id, started_at, golf_course(name), game_courses(*), game_players(*)",
    )
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;
  return response ? camelcaseKeys(response, { deep: true }) : null;
};
