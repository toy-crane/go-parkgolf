import type { Tables } from "@/types/generated";

declare global {
  type GolfCourse = Tables<"golf_course">;
}
