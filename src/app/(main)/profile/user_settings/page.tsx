'use client'; // Указываем, что это клиентский компонент

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function UserSettings() {
  const { isLoaded, user } = useUser();
  const [isVerifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const login = searchParams.get('user') || 'Гість';

  if(!isLoaded || !user) return null;

  const emailResource = user.primaryEmailAddress;
  const isVerifyed = emailResource?.verification.status === "verified";

  const handleSendEmailCode = async () => {
    try {
      setError("");
      await emailResource?.prepareVerification({strategy: "email_code"});
      setVerifying(true);
    } catch (err: any) {
      setError(err.errors[0]?.message || "Помилка відправки");
    }
  };

  return (
    <div className="p-4 bg-cyan-950 text-amber-100 rounded-t-xl">
      <h1 className="my-10 uppercase text-center text-xl md:text-2xl">
        {`Налаштування сторінки ${login}`}
      </h1>
      
      {/* action={updateUserInfo} использует серверный экшн */}
      <form action="" className="flex flex-col gap-y-2 md:max-w-2/3 md:mx-auto">
        <label htmlFor="avatar" className="">Введіть посилання на аватар:</label>
        <input name="avatar" type="text" className="border-2 border-amber-50 h-10 rounded-xl p-4 text-black" />
        
        <label htmlFor="name" className="">Введіть нове ім я:</label>
        <input name="name" type="text" className="border-2 border-amber-50 h-10 rounded-xl p-4 text-black" />
        
        <label htmlFor="phone" className="">Додати номер телефону:</label>
        {isVerifyed ? <input name="phone" type="text" className="border-2 border-amber-50 h-10 rounded-xl p-4 text-black" /> : <p className="border-2 border-amber-50 h-10 rounded-xl p-4 text-black">⚠️ Потрібна верифікація</p>}
        
        <label htmlFor="email" className="">Змінити емейл:</label>
        {isVerifyed ? <input name="email" type="text" className="border-2 border-amber-50 h-10 rounded-xl p-4 text-black" /> : <p className="border-2 border-amber-50 h-10 rounded-xl p-4 text-black">⚠️ Потрібна верифікація</p>}
        
        <button type="submit" className="cursor-pointer bg-orange-800 md:max-w-1/2 md:min-w-1/2 md:mx-auto h-10 rounded-xl hover:bg-orange-700">
          Змінити інформацію
        </button>
      </form>
      
      <Link href={`/pass_change?user=${login}`} className="text-center mx-auto block mt-2">
        Змінити пароль
      </Link>
    </div>
  );
}
