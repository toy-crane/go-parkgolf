import type { Tables } from "@/types/generated";

export type Review = Tables<"golf_course_reviews"> & {
  profiles?: Tables<"profiles"> | null;
};
