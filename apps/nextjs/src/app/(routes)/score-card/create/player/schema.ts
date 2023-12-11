import * as z from "zod";

export const formSchema = z.object({
  players: z
    .array(
      z.object({
        nickname: z.string().nonempty("이름을 입력해주세요."),
      }),
      { required_error: "게임 참여자를 입력해주세요." },
    )
    .min(1, { message: "게임 참여자 이름을 1명 이상 입력해주세요." })
    .max(4, { message: "게임 참여자는 최대 4명까지 입력 가능합니다." }),
});
