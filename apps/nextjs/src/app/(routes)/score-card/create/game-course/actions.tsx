"use server";

import { createSupabaseServerClient } from "@/libs/supabase/server";
import type { Course } from "@/types";
import type { Tables } from "@/types/generated";
import type { z } from "zod";

import type { formSchema } from "./schema";

type Inputs = z.infer<typeof formSchema>;

export const createGameCourse = async (gameId: string, inputs: Inputs) => {
  const supabase = await createSupabaseServerClient();
  const gameCourses = inputs.game_courses;
  const response = await supabase
    .from("game_courses")
    .insert(
      gameCourses.map((p) => ({
        game_id: gameId,
        name: p.name,
        hole_count: p.hole_count,
      })),
    )
    .select();

  if (response.error) {
    throw new Error(response.error.message);
  }
  return { success: true, data: response.data };
};

export const createGameScores = async (
  gameCourses: Tables<"game_courses">[],
  courses?: Course[],
) => {
  const supabase = await createSupabaseServerClient();

  const game_scores = gameCourses.flatMap((course) => {
    // DB에 저장된 course 정보와 맵핑. 없는 경우, hole_count만큼 0으로 채움
    const holes = courses?.find((c) => course.name.startsWith(c.name))?.holes;
    return (
      holes?.map((hole) => {
        return {
          game_course_id: course.id,
          hole_number: hole.hole_number,
          par: hole.par,
        };
      }) ??
      Array.from({ length: course.hole_count }).map((_, index) => ({
        game_course_id: course.id,
        hole_number: index + 1,
        par: 0,
      }))
    );
  });

  const scoreMutation = supabase
    .from("game_scores")
    .insert(game_scores)
    .select();
  const scoreResponse = await scoreMutation;

  if (scoreResponse.error) {
    throw new Error(scoreResponse.error.message);
  }
  return { success: true, data: scoreResponse.data };
};

export const createGamePlayerScores = async (
  gameId: string,
  gameScores: Tables<"game_scores">[],
) => {
  const supabase = await createSupabaseServerClient();
  const { data: players, error } = await supabase
    .from("game_players")
    .select()
    .eq("game_id", gameId);

  if (error) {
    throw new Error(error.message);
  }

  const gamePlayerScores = gameScores.flatMap((score) => {
    return players.map((p) => {
      return {
        game_score_id: score.id,
        game_player_id: p.id,
        score: 0,
      };
    });
  });

  const playerScoreMutation = supabase
    .from("game_player_scores")
    .upsert(gamePlayerScores)
    .select();

  const playerScoreResponse = await playerScoreMutation;

  if (playerScoreResponse.error) {
    throw new Error(playerScoreResponse.error.message);
  }
  return { success: true, data: playerScoreResponse.data };
};

export const updateGameStatus = async (gameId: string) => {
  const supabase = await createSupabaseServerClient();
  const response = await supabase
    .from("games")
    .update({ status: "in_progress" })
    .eq("id", gameId)
    .select();

  if (response.error) {
    throw new Error(response.error.message);
  }
  return { success: true, data: response.data };
};
