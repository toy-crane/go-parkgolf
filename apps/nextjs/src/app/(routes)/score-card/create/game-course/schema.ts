import * as z from "zod";

export const gameCourseSchema = z.object({
  name: z
    .string()
    .nonempty("코스 이름을 입력해주세요.")
    .regex(/^[가-힣a-zA-Z0-9\s-]+$/, {
      message: "사용할 수 없는 문자가 포함되어 있습니다",
    }),
  hole_count: z.coerce
    .number()
    .min(1, { message: "홀 수는 최소 1이상 입력해주세요." })
    .max(9, { message: "홀 수는 최대 9까지 입력 가능합니다." }),
});

export const formSchema = z.object({
  game_courses: z
    .array(gameCourseSchema)
    .min(1, { message: "코스를 최소 1개 이상 입력해주세요." })
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
