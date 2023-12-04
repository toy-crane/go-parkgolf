import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";

export const getGameCourses = async ({ gameId }: { gameId: string }) => {
  const supabase = createSupabaseServerClientReadOnly();

  const { data: response, error } = await supabase
    .from("game")
    .select(
      "start_date, game_course(*, score(*, player_score(*, participant(*)))), golf_course(name)",
    )
    .eq("id", gameId)
    .single();

  if (error) throw error;
  const { game_course: gameCourses, golf_course, start_date } = response;
  return { gameCourses, ...golf_course, startDate: start_date };
};

export const getScores = async ({ gameCourseId }: { gameCourseId: number }) => {
  const supabase = createSupabaseServerClientReadOnly();
  const { data: scores, error } = await supabase
    .from("score")
    .select("*, player_score(*, participant(*))")
    .eq("game_course_id", gameCourseId);
  if (error) throw error;
  return scores;
};
