import { z } from "zod";

export function createSchema(fields: Record<string, z.ZodType<any>>) {
  return z.object(fields);
}

export const createScoreSchema = (playerIds: string[]) =>
  z.array(
    createSchema({
      id: z.string(),
      gameCourseId: z.string(),
      holeNumber: z.number(),
      par: z.number(),
      ...playerIds.reduce((acc: Record<string, z.ZodType<any>>, id) => {
        acc[id] = z.number();
        return acc;
      }, {}),
    }),
  );
