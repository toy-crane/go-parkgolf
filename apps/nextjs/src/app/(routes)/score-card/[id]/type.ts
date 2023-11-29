import type { Tables } from "@/types/supabase-helper";

export interface Score {
  id: number;
  gameCourseId: number;
  holeNumber: number;
  par: number;
  [key: string]: number;
}

export type GameCourse = Tables<"game_course"> & {
  score: (Tables<"score"> & {
    player_score: (Tables<"player_score"> & {
      participant: Tables<"participant">;
    })[];
  })[];
};
