"use client";

import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { changeUserPassword } from "@/components/server/getUser";

export default function PasswordChangePage() {
  const searchParams = useSearchParams();
  const login = searchParams.get("user") || "невідомого користувача";
  const { user } = useUser();

  if (!user) return <div>Завантаження...</div>;

  return (
    <div>
      <h1 className="pt-20 pb-5 text-center uppercase">Зміна пароля</h1>
      <p className="pb-5 text-center">Привіт, ви змінюєте пароль для користувача {login}.</p>
      {/* Тут можна додати форму для зміни пароля */}
      <form action="" className="grid grid-cols-1 gap-4 pb-20">
        <label htmlFor="currentPassword">Поточний пароль</label>
        <input className="min-h-10 border-2 border-amber-50 rounded-xl" id="currentPassword" type="password" />
        <label htmlFor="newPassword">Новий пароль</label>
        <input className="min-h-10 border-2 border-amber-50 rounded-xl" id="newPassword" type="password" />
        <button type="submit" className="min-w-1/2 min-h-10 rounded-xl mx-auto bg-green-700">Змінити пароль</button>
      </form>
    </div>
  );
}
