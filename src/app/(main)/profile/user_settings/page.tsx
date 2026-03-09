"use server";

import Link from "next/link";
import { Fragment } from "react/jsx-runtime";

export default async function UserSettings({
  searchParams,
}: {
  searchParams: Promise<{ user?: string }>; // Next.js 15 очікує Promise
}) {
  const params = await searchParams;
  const login = params.user || "Гість";

  return (
    <div className="p-4 bg-cyan-950 text-amber-100 rounded-t-xl">
      <h1 className="my-10 uppercase text-center text-xl md:text-2xl">{`Налаштування сторінки ${login}`}</h1>
      <form action="" className="flex flex-col gap-y-2 md:max-w-2/3 md:mx-auto">
        <label htmlFor="" className="">Введіть посилання на аватар:</label>
        <input type="text" className="border-2 border-amber-50 h-10 rounded-xl p-4" />
        <label htmlFor="" className="">Введіть нове ім'я:</label>
        <input type="text" className="border-2 border-amber-50 h-10 rounded-xl p-4" />
        <label htmlFor="" className="">Додати номер телефону:</label>
        <input type="text" className="border-2 border-amber-50 h-10 rounded-xl p-4" />
        <label htmlFor="" className="">Змінити емейл:</label>
        <input type="text" className="border-2 border-amber-50 h-10 rounded-xl p-4" />
        <button type="submit" className="cursor-pointer bg-orange-800 md:max-w-1/2 md: min-w-1/2 md:mx-auto h-10 rounded-xl hover:bg-orange-700">Змінити інформацію</button>
      </form>
      <Link href={`/pass_change?user=${login}`} className="text-center mx-auto block mt-2">Змінити пароль</Link>
    </div>
  );
}
