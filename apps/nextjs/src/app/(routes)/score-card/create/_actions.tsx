"use server";

import { cookies } from "next/headers";
import { createFetch } from "@/libs/cache";
import type { Database } from "@/types/generated";
import type { DbResultOk } from "@/types/supabase-helper";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { z } from "zod";

import { formSchema } from "./forms/schema";

type Inputs = z.infer<typeof formSchema>;
const cookieStore = cookies();

const supabase = createRouteHandlerClient<Database>(
  {
    cookies: () => cookieStore,
  },
  { options: { global: { fetch: createFetch({ cache: "force-cache" }) } } },
);

export async function createGame(data: Inputs) {
  const result = formSchema.safeParse(data);
  if (!result.success) {
    throw new Error("Validation failed");
  }

  console.log(result.data.startDate);

  const gameMutation = supabase
    .from("game")
    .insert({
      start_date: result.data.startDate.toISOString(),
      course_id: result.data.courseId,
    })
    .select()
    .single();
  type Game = DbResultOk<typeof gameMutation>;
  const gameResponse = await gameMutation;
  if (gameResponse.error) {
    throw new Error(gameResponse.error.message);
  }
  const game: Game = gameResponse.data;
  const participantMutation = supabase
    .from("participant")
    .insert(
      result.data.participants.map((participant) => ({
        game_id: game.id,
        nickname: participant.text,
      })),
    )
    .select();
  const participantResponse = await participantMutation;
  if (participantResponse.error) {
    throw new Error(participantResponse.error.message);
  }
  const participants: DbResultOk<typeof participantMutation> =
    participantResponse.data;

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
  const game_courses: DbResultOk<typeof gameCourseMutation> =
    gameCourseResponse.data;

  return { success: true, data: { ...game, participants, game_courses } };
}
