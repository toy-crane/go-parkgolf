"use server";

import { createSupabaseServerClient } from "@/libs/supabase/server";
import type { z } from "zod";

import { formSchema } from "./forms/schema";

type Inputs = z.infer<typeof formSchema>;

export async function makeGame(startedAt: Date, golfCourseId: number) {
  const supabase = await createSupabaseServerClient();
  const gameMutation = supabase
    .from("games")
    .insert({
      started_at: startedAt.toISOString(),
      golf_course_id: golfCourseId,
    })
    .select()
    .single();
  const gameResponse = await gameMutation;
  if (gameResponse.error) {
    throw new Error(gameResponse.error.message);
  }
  return gameResponse.data;
}

export async function createGamePlayer(gameId: string, nicknames: string[]) {
  const supabase = await createSupabaseServerClient();
  const response = await supabase
    .from("game_players")
    .insert(
      nicknames.map((nickname) => ({
        game_id: gameId,
        nickname,
      })),
    )
    .select();

  if (response.error) {
    throw new Error(response.error.message);
  }
  return response.data;
}

export async function createGame(input: Inputs) {
  const result = formSchema.safeParse(input);
  if (!result.success) {
    throw new Error("Validation failed");
  }
  const { gamePlayers } = result.data;

  const supabase = await createSupabaseServerClient();
  const game = await makeGame(result.data.startedAt, result.data.courseId);
  const players = await createGamePlayer(
    game.id,
    gamePlayers.map((p) => p.text),
  );

  const gameCourseMutation = supabase
    .from("game_courses")
    .insert(
      result.data.game_courses.map((c) => ({
        game_id: game.id,
        name: c.name,
        hole_count: c.hole_count,
      })),
    )
    .select();
  const gameCourseResponse = await gameCourseMutation;
  if (gameCourseResponse.error) {
    throw new Error(gameCourseResponse.error.message);
  }
  const game_courses = gameCourseResponse.data;

  const game_scores = game_courses.flatMap((course) => {
    return Array.from({ length: course.hole_count }).map((_, index) => {
      return {
        game_course_id: course.id,
        hole_number: index + 1,
        par: 0,
      };
    });
  });

  const scoreMutation = supabase
    .from("game_scores")
    .insert(game_scores)
    .select();
  const scoreResponse = await scoreMutation;

  if (scoreResponse.error) {
    throw new Error(scoreResponse.error.message);
  }

  const scoreData = scoreResponse.data;

  const gamePlayerScores = scoreData.flatMap((score) => {
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

  return { success: true, data: { ...game, players, game_courses } };
}
