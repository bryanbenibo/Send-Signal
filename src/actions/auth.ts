"use server"

import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

const SignupSchema = z.object({
  companyName: z.string().min(2, "Company Name is too short"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function signup(prevState: any, formData: FormData) {
  const parsed = SignupSchema.safeParse(Object.fromEntries(formData))

  if (!parsed.success) {
    return {
      error: "Invalid fields",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const { companyName, email, password } = parsed.data

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return { error: "Email already in use." }
    }

    const password_hash = await bcrypt.hash(password, 10)
    await prisma.user.create({
      data: {
        company_name: companyName,
        email,
        password_hash,
      },
    })
  } catch (err: any) {
    return { error: "Failed to create account." }
  }

  // Auto sign in
  await signIn("credentials", {
    email,
    password,
    redirectTo: "/dashboard",
  })
}

export async function authenticate(prevState: any, formData: FormData) {
  try {
    await signIn("credentials", formData)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials."
        default:
          return "Something went wrong."
      }
    }
    throw error
  }
}
