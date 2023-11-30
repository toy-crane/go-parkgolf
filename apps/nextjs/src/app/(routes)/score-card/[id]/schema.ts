import { z } from "zod";

export function createSchema(fields: Record<string, z.ZodType<any>>) {
  return z.object(fields);
}
