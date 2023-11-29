"use server";

import { createSupabaseServerClient } from "@/libs/supabase/server";
import type { z } from "zod";

import { formSchema } from "./forms/schema";

type Inputs = z.infer<typeof formSchema>;

export async function createGame(data: Inputs) {
  const result = formSchema.safeParse(data);
  if (!result.success) {
    throw new Error("Validation failed");
  }

  const supabase = createSupabaseServerClient();

  const gameMutation = supabase
    .from("game")
    .insert({
      start_date: result.data.startDate.toISOString(),
      course_id: result.data.courseId,
    })
    .select()
    .single();
  const gameResponse = await gameMutation;
  if (gameResponse.error) {
    throw new Error(gameResponse.error.message);
  }
  const game = gameResponse.data;
  const participantsQuery = result.data.participants.map((participant) => ({
    game_id: game.id,
    nickname: participant.text,
  }));

  const participantMutation = supabase
    .from("participant")
    .insert(participantsQuery)
    .select();
  const participantResponse = await participantMutation;
  if (participantResponse.error) {
    throw new Error(participantResponse.error.message);
  }
  const participants = participantResponse.data;

  const gameCourseMutation = supabase
    .from("game_course")
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

  const scores = game_courses.flatMap((course) => {
    return Array.from({ length: course.hole_count }).map((_, index) => {
      return {
        game_course_id: course.id,
        hole_number: index + 1,
        par: 0,
      };
    });
  });

  const scoreMutation = supabase.from("score").insert(scores).select();
  const scoreResponse = await scoreMutation;

  if (scoreResponse.error) {
    throw new Error(scoreResponse.error.message);
  }

  const scoreData = scoreResponse.data;

  const playerScoreData = scoreData.flatMap((score) => {
    return participants.map((p) => {
      return {
        score_id: score.id,
        participant_id: p.id,
        player_score: 0,
      };
    });
  });

  const playerScoreMutation = supabase
    .from("player_score")
    .upsert(playerScoreData)
    .select();

  const playerScoreResponse = await playerScoreMutation;

  if (playerScoreResponse.error) {
    throw new Error(playerScoreResponse.error.message);
  }

  return { success: true, data: { ...game, participants, game_courses } };
}
