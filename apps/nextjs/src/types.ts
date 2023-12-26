import type { Tables } from "./types/supabase-helper";

export type GolfCourse = Tables<"golf_courses"> & {
  lot_number_addresses?: Tables<"lot_number_addresses">;
  road_address?: Tables<"road_addresses">;
  contacts?: Tables<"contacts">[];
  operations?: Tables<"operations">;
};

export interface Position {
  level: number;
  center: { lat: number; lng: number };
}
