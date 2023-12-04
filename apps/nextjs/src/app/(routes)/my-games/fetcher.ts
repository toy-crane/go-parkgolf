import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import camelcaseKeys from "camelcase-keys";

export const getMyGames = async () => {
  const supabase = await createSupabaseServerClientReadOnly();

  const { data: response, error } = await supabase
    .from("game")
    .select("id, started_at, golf_course(name), game_course(*)")
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;
  return response ? camelcaseKeys(response, { deep: true }) : null;
};
