import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";

export const getGameCourses = async ({ gameId }: { gameId: string }) => {
  const supabase = await createSupabaseServerClientReadOnly();

  const { data: response, error } = await supabase
    .from("game")
    .select(
      "started_at, golf_course(name), game_course(*, game_score(*, game_player_score(*, game_player(*))))",
    )
    .order("hole_number", {
      foreignTable: "game_course.game_score",
      ascending: true,
    })
    .eq("id", gameId)
    .single();

  if (error) throw error;
  const { game_course: gameCourses, started_at, golf_course } = response;
  return {
    gameCourses,
    startedAt: started_at,
    name: golf_course?.name,
  };
};

export const getScores = async ({ gameCourseId }: { gameCourseId: number }) => {
  const supabase = await createSupabaseServerClientReadOnly();
  const { data: scores, error } = await supabase
    .from("score")
    .select("*, player_score(*, participant(*))")
    .eq("game_course_id", gameCourseId);
  if (error) throw error;
  return scores;
};
