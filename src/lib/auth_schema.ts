import { ZodError, z } from "zod"

export const SignupSchema = z
  .object({
    name: z
      .string({ required_error: "Name is required" })
      .min(3, { message: "Name must be at least 3 characters" })
      .max(64, { message: "Name must be less than 64 characters" })
      .trim(),
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .max(64, { message: "Name must be less than 64 characters" })
      .email({ message: "Email must be a valid email address" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" })
      .trim(),
    password2: z
      .string({ required_error: "Password confirmation is required" })
      .min(8, { message: "Password confirmation must be at least 8 characters" })
      .trim(),
    csrfToken: z.string({ required_error: "CSRF token is required" }),
  })
  .refine((data) => data.password === data.password2, {
    message: "Passwords don't match",
    path: ["password2"],
  })

export type SignupParams = z.infer<typeof SignupSchema>

export const LoginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .max(64, { message: "Name must be less than 64 characters" })
    .email({ message: "Email must be a valid email address" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
})

export type LoginParams = z.infer<typeof SignupSchema>
