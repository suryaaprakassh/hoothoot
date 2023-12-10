import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(6, "Name Should be atleast 6 characters"),
  email: z.string().email(),
  password: z.string().min(5, "Password should be atleast 6 characters"),
});
