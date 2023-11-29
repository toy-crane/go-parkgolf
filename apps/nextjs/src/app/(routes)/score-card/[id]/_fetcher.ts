import { cookies } from "next/headers";
import { createClient } from "@/libs/supabase/server";

export const getGameCourses = async ({ gameId }: { gameId: string }) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: response, error } = await supabase
    .from("game")
    .select("*, game_course(*)")
    .eq("id", gameId)
    .single();

  if (error) throw error;
  const { game_course: gameCourses } = response;
  return gameCourses;
};

export const getScores = async ({ gameCourseId }: { gameCourseId: number }) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: scores, error } = await supabase
    .from("score")
    .select("*, player_score(*, participant(*))")
    .eq("game_course_id", gameCourseId);
  if (error) throw error;
  return scores;
};
