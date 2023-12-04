import type { Tables } from "@/types/supabase-helper";

export interface Score {
  id: string;
  gameCourseId: string;
  holeNumber: number;
  par: number;
  [key: string]: number | string;
}

export type GameCourse = Tables<"game_course"> & {
  game_score: (Tables<"game_score"> & {
    game_player_score: (Tables<"game_player_score"> & {
      game_player: Tables<"game_player"> | null;
    })[];
  })[];
};

export interface Cell {
  row: string;
  colName: string;
}
