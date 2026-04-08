'use server'
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "./lib/prisma"; // шлях до вашого prisma client

export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;
  
  return await prisma.user.findUnique({
    where: { id: userId },
  });
}

export async function changeUserPassword(FormData: FormData) {
  const newPassword = FormData.get("newPassword") as string;
  const oldPassword = FormData.get("oldPassword") as string;

  const { userId } = await auth();

  if (!userId) {
    return { result: false, message: "Користувач не автентифікований" };
  }
  try {
    const client = await clerkClient();
    const verification = await client.users.verifyPassword({
      userId,
      password: oldPassword,
    });

    if (!verification.verified) {
      return { result: false, message: "Поточний пароль невірний" };
    }
    await client.users.updateUser(userId, {
      password: newPassword,
    });
    return { result: true, message: "Пароль успішно змінено" };
  } catch (error: any) {
    return { result: false, message: "Помилка сервера: " + error.message };
  }
}
