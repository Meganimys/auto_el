'use server'
import { prisma } from "../lib/prisma"

// 1. Добавлен явный тип возвращаемого значения Promise<boolean>
export async function checkAvailability(type: 'login' | 'email', value: string): Promise<boolean> {
  // 2. Используем findFirst, так как он лучше подходит для динамических условий
  const user = await prisma.user.findFirst({
    where: { 
      [type]: value // TS теперь понимает, что [type] - это 'login' или 'email'
    }
  });
  
  return !!user; // поверне true, якщо зайнято
}
