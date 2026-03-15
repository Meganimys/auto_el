'use client'; // Указываем, что это клиентский компонент

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { getUserEmail } from '@/components/server/lib/prismaManager';

export default function UserSettings() {
  const { isLoaded, user } = useUser();
  const [isVerifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const login = searchParams.get('user') || 'Гість';
  const [userEmail, setUserEmail] = useState<string|null>();

  useEffect(() => {getEmailFromDataBase()}, []);

  const getEmailFromDataBase = async () => {
      setUserEmail(await getUserEmail());
  }

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

  const handleVerifyEmail = async () => {
    try {
      setError("");
      const result = await emailResource?.attemptVerification({code});
      if(result?.verification.status === "verified") {
        setError("Емейл успішно підтверджено!");
      } else {
        setError("Помилка верифікації!");
      }
    } catch(err) {
      console.error("Невірний код:", err);
      setError("Невірний код:" + err);
    }
  }

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
        {isVerifyed ? <input name="phone" type="text" className="border-2 border-amber-50 h-10 rounded-xl p-4 text-black" /> : <p className="h-10 text-red-500">⚠️ Неможливо додати/змінити номер телефону, без підтвердження пошти!</p>}
        
        <label htmlFor="email" className="">Змінити емейл:</label>
        {isVerifyed && <p>{userEmail} ✅ Емейл верифіковано!</p>}
        {isVerifyed ? <input name="email" type="text" className="border-2 border-amber-50 h-10 rounded-xl p-4 text-black" /> : <p className="h-10 text-red-500">⚠️ Ектронна пошта <span className='text-green-800 font-bold'>{userEmail}</span> не підтверджена! Потрібна верифікація</p>}

        {isVerifying && <div>
            <label htmlFor="email" className="">Введіть код підтвердження відправлений на пошту:</label>
            <input name="code" type="text" onChange={(e) => setCode(e.target.value)} className="border-2 border-amber-50 h-10 rounded-xl p-4 text-black" />
            <button type='button' onClick={handleVerifyEmail} className="cursor-pointer bg-orange-800 md:max-w-1/2 md:min-w-1/2 md:mx-auto h-10 rounded-xl hover:bg-orange-700 my-5">Верифікувати пошту</button>
          </div>}
          <p>{error}</p>
        {!isVerifyed && !isVerifying && <button type="button" onClick={handleSendEmailCode} className="cursor-pointer bg-orange-800 md:max-w-1/2 md:min-w-1/2 md:mx-auto h-10 rounded-xl hover:bg-orange-700">Верифікувати електронну пошту</button>}
        
        <button type="submit" className="cursor-pointer bg-orange-800 md:max-w-1/2 md:min-w-1/2 md:mx-auto h-10 rounded-xl hover:bg-orange-700 my-5">
          Змінити інформацію
        </button>
      </form>
      
      <Link href={`/pass_change?user=${login}`} className="text-center mx-auto block mt-2">
        Змінити пароль
      </Link>
    </div>
  );
}
