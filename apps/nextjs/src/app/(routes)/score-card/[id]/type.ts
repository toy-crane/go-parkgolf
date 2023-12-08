import type { Tables } from "@/types/supabase-helper";

export interface Score {
  id: string;
  gameCourseId: string;
  holeNumber: number;
  par: number;
  [key: string]: number | string;
}

export type GameCourse = Tables<"game_courses"> & {
  game_scores: (Tables<"game_scores"> & {
    game_player_scores: (Tables<"game_player_scores"> & {
      game_players: Tables<"game_players"> | null;
    })[];
  })[];
};

export interface Cell {
  row: string;
  colName: string;
}
