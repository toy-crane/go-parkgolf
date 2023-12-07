import * as z from "zod";

export const gameSchema = z.object({
  startedAt: z.coerce.date({
    required_error: "게임 날짜를 선택해 주세요.",
  }),
  courseId: z.coerce.number({
    required_error: "골프장을 선택해 주세요.",
    invalid_type_error: "골프장을 선택해 주세요.",
  }),
});

export const gamePlayerSchema = z.object({
  gamePlayers: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      }),
      { required_error: "게임 참여자를 입력해주세요." },
    )
    .min(1, { message: "게임 참여자 이름을 1명 이상 입력해주세요." })
    .max(4, { message: "게임 참여자는 최대 4명까지 입력 가능합니다." }),
});

const gameCourseShema = z.object({
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

export const formSchema = gameSchema
  .merge(gamePlayerSchema)
  .merge(gameCourseShema);
