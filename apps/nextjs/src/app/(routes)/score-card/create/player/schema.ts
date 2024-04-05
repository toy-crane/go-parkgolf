import * as z from "zod";

export const playerSchema = z.object({
  nickname: z
    .string()
    .nonempty("이름을 입력해주세요.")
    .regex(/^[가-힣a-zA-Z]+$/, {
      message: "사용할 수 없는 문자가 포함되어 있습니다",
    }),
});

export const formSchema = z.object({
  players: z
    .array(playerSchema, { required_error: "게임 참여자를 입력해주세요." })
    .min(1, { message: "게임 참여자 이름을 1명 이상 입력해주세요." })
    .max(4, { message: "게임 참여자는 최대 4명까지 입력 가능합니다." })
    .refine(
      (players) => {
        const nicknames = players.map((player) => player.nickname);
        return new Set(nicknames).size === nicknames.length;
      },
      { message: "동일한 이름이 존재합니다. 고유한 이름을 사용해주세요." },
    ),
});
