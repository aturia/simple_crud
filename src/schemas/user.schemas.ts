import { z } from "zod";

export const getUserParamsSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/)
  }),
});