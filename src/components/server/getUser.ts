'use server'
import { auth } from "@clerk/nextjs/server";
import { prisma } from "./lib/prisma"; // шлях до вашого prisma client

export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;
  
  return await prisma.user.findUnique({
    where: { id: userId },
  });
}