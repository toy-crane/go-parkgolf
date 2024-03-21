import * as z from "zod";

export const formSchema = z.object({
  golfCourseId: z.string({
    required_error: "골프장을 선택해 주세요.",
    invalid_type_error: "골프장을 선택해 주세요.",
  }),
});
