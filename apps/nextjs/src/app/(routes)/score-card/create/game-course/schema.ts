import * as z from "zod";

export const formSchema = z.object({
  game_courses: z
    .array(
      z.object({
        name: z.string(),
        hole_count: z.coerce.number(),
      }),
    )
    .min(1, { message: "코스를 1개 이상 입력해주세요." })
    .max(4, { message: "코스는 최대 4개까지 입력 가능합니다." }),
});
