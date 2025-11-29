import { z } from "zod";

export const getUserParamsSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/)
  }),
});

export const UserSchema = z.object({
  id: z.string().uuid().describe('ID duy nhất của người dùng'),
  name: z.string().min(3).max(50).describe('Tên người dùng'),
  email: z.string().email().describe('Địa chỉ email'),
});