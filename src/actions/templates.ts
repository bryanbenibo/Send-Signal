"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function createTemplate(data: { name: string; body: string }) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  if (!data.name?.trim()) {
    return { error: "Template name is required" }
  }

  if (!data.body?.trim()) {
    return { error: "Template body is required" }
  }

  try {
    const template = await prisma.template.create({
      data: {
        user_id: session.user.id,
        name: data.name.trim(),
        body: data.body.trim(),
        version: 1,
      },
    })

    return { success: true, template }
  } catch (error) {
    console.error("Create Template Error:", error)
    return { error: "Failed to create template" }
  }
}
