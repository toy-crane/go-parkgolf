import type { Tables } from "@/types/generated";
import type { CamelCaseKeys } from "camelcase-keys";

export type Game = CamelCaseKeys<Tables<"games">, true> & {
  golfCourses: { name: string; holeCount: number } | null;
  gameCourses: CamelCaseKeys<Tables<"game_courses">, true>[];
  gamePlayers: CamelCaseKeys<Tables<"game_players">, true>[];
};
