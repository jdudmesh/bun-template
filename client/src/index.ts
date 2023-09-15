// stub file for webpack entry point
import "./css/style.css"
import "htmx.org"
import "./htmx.js"
import Alpine from "alpinejs"
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

declare global {
  interface Window {
    Alpine: typeof Alpine
  }
}

window.Alpine = Alpine

document.body.addEventListener("user-logged-out", function (evt) {
  window.location.reload()
})

document.addEventListener("alpine:initialized", () => {
  document.body.attributes.removeNamedItem("x-cloak")
})

Alpine.data("signup", () => ({
  csrfToken: "",
  name: "",
  email: "",
  password: "",
  password2: "",
  nameErr: "",
  emailErr: "",
  passwordErr: "",
  password2Err: "",
  submitErr: "",
  init: async function () {
    const res = await fetch("/api/csrf")
    const { csrfToken } = await res.json()
    this.csrfToken = csrfToken
  },
  submit: async function () {
    try {
      const params = SignupSchema.parse(this.$data)
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      })
      if (res.status === 201) {
        window.location.href = "/"
        return
      }
      const { error, csrfToken } = await res.json()
      this.submitErr = error
      this.csrfToken = csrfToken
    } catch (err) {
      if (err && err instanceof ZodError) {
        const e = err.flatten()
        if (e.fieldErrors) {
          Object.keys(e.fieldErrors).forEach((key) => {
            this[`${key}Err`] = e.fieldErrors[key]?.join(", ")
          })
        }
      }
    }
  },
}))

Alpine.data("login", () => ({
  csrfToken: "",
  email: "",
  password: "",
  emailErr: "",
  passwordErr: "",
  submitErr: "",
  init: async function () {
    // const res = await fetch("/api/csrf")
    // const { csrfToken } = await res.json()
    // this.csrfToken = csrfToken
  },
  submit: async function () {
    try {
      const params = LoginSchema.parse(this.$data)
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      })
      console.log(res)
      if (res.status === 200) {
        window.location.href = "/"
        return
      }
      const { error, csrfToken } = await res.json()
      this.submitErr = error
      // this.csrfToken = csrfToken
    } catch (err) {
      if (err && err instanceof ZodError) {
        const e = err.flatten()
        if (e.fieldErrors) {
          Object.keys(e.fieldErrors).forEach((key) => {
            this[`${key}Err`] = e.fieldErrors[key]?.join(", ")
          })
        }
      }
    }
  },
}))

Alpine.start()
