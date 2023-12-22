import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(6, "Name Should be atleast 6 characters"),
  email: z.string().email(),
  password: z.string().min(5, "Password should be atleast 6 characters"),
});

export const questionSchema = z.object({
  question: z.string().min(6, "Question Should be atleast 6 characters"),
  ans: z.string(),
  opt1: z.string(),
  opt2: z.string(),
  opt3: z.string().optional(),
  opt4: z.string().optional(),
});

export const questionSchemaArray = z.array(questionSchema);
