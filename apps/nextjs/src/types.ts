import type { Tables } from "./types/supabase-helper";

export type Course = Tables<"golf_course"> & {
  address: Tables<"address">[];
  road_address?: Tables<"road_address">[];
  contact: Tables<"contact">[];
  operation: Tables<"operation">[];
};

export interface Position {
  level: number;
  center: { lat: number; lng: number };
}
