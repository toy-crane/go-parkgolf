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
    .max(4, { message: "코스는 최대 4개까지 입력 가능합니다." })
    .refine(
      (gameCourses) => {
        const gameCourseNames = gameCourses.map(
          (gameCourse) => gameCourse.name,
        );
        return new Set(gameCourseNames).size === gameCourseNames.length;
      },
      { message: "동일한 코스 이름이 존재합니다. 고유한 이름을 사용해주세요." },
    ),
});
