import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";

export const getGameCourses = async ({ gameId }: { gameId: string }) => {
  const supabase = await createSupabaseServerClientReadOnly();

  const { data: response, error } = await supabase
    .from("games")
    .select(
      "user_id, game_players(id, nickname),started_at, golf_courses(name), game_courses(*, game_scores(*, game_player_scores(*, game_players(*))))",
    )
    .order("hole_number", {
      foreignTable: "game_courses.game_scores",
      ascending: true,
    })
    .eq("id", gameId)
    .single();

  if (error) throw error;
  const {
    game_courses: gameCourses,
    started_at,
    golf_courses,
    user_id,
    game_players: gamePlayers,
  } = response;
  return {
    gameCourses,
    gamePlayers,
    startedAt: started_at,
    name: golf_courses?.name,
    userId: user_id,
  };
};
