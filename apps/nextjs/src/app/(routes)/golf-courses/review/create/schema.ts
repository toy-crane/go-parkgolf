import * as z from "zod";

export const formSchema = z.object({
  courseConditionRating: z
    .number()
    .min(1, { message: "코스 상태 별점을 선택해 주세요" })
    .max(5), // 코스 상태: 1에서 5까지의 숫자
  courseDifficultyRating: z
    .number()
    .min(1, { message: "코스 난이도 별점을 선택해 주세요" })
    .max(5), // 코스 난이도: 1에서 5까지의 숫자
  facilitiesRating: z
    .number()
    .min(1, { message: "편의 시설 별점을 선택해 주세요" })
    .max(5), // 편의시설: 1에서 5까지의 숫자
  text: z
    .string()
    .min(10, { message: "최소 10자 이상 작성해주세요." })
    .max(500, { message: "최대 500자까지만 입력이 가능합니다." }), // 리뷰 텍스트: 최소 1자에서 최대 1000자
});
