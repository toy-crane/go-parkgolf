import * as z from "zod";

export const formSchema = z.object({
  name: z.string().nonempty("이름을 입력해주세요."),
  hole_count: z.coerce.number(),
  address: z.string().nonempty("주소를 입력해주세요."),
  opening_hours: z.string().optional(),
  regular_closed_days: z.string().optional(),
  website: z.string().optional(),
  registration_method: z.string().optional(),
  reference: z.string().optional(),
  phone_number: z.string().optional(),
});
