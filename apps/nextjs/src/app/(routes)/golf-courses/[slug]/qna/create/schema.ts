import * as z from "zod";

export const formSchema = z.object({
  text: z
    .string()
    .min(10, { message: "최소 10자 이상 작성해주세요." })
    .max(500, { message: "최대 500자까지만 입력이 가능합니다." }), // 리뷰 텍스트: 최소 1자에서 최대 1000자
});
