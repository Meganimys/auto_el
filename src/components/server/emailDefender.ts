"use server";

import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { prisma } from "./lib/prisma";

export async function sendVerificationCode(email: string) {
  if (!email) throw new Error("Email required");

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const codeHash = await bcrypt.hash(code, 10);

  // Видаляємо старі
  await prisma.emailVerification.deleteMany({
    where: { email },
  });

  await prisma.emailVerification.create({
    data: {
      email,
      codeHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Код підтвердження",
    html: `<b>${code}</b>`,
  });

  return { success: true };
}

export async function verifyCode(email: string, code: string) {
  const record = await prisma.emailVerification.findFirst({
    where: { email },
    orderBy: { createdAt: "desc" },
  });

  if (!record) return { success: false, error: "Код не знайдено" };

  if (new Date() > record.expiresAt) {
    return { success: false, error: "Код прострочений" };
  }

  const isValid = await bcrypt.compare(code, record.codeHash);

  if (!isValid) {
    return { success: false, error: "Невірний код" };
  }

  await prisma.emailVerification.deleteMany({
    where: { email },
  });

  return { success: true };
}