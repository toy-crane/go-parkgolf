"use server";

import { createSupabaseServerClient } from "@/libs/supabase/server";
import type { z } from "zod";

import type { formSchema } from "./schema";

type Inputs = z.infer<typeof formSchema>;

export async function makeGame({ golfCourseId }: Inputs) {
  const supabase = await createSupabaseServerClient();
  const gameMutation = supabase
    .from("games")
    .insert({
      golf_course_id: golfCourseId,
    })
    .select()
    .single();
  const gameResponse = await gameMutation;
  if (gameResponse.error) {
    throw new Error(gameResponse.error.message);
  }
  return { success: true, data: gameResponse.data };
}
