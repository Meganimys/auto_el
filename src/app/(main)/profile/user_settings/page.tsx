'use client'; // Указываем, что это клиентский компонент

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { getUserEmail } from '@/components/server/lib/prismaManager';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ImagePlus } from "lucide-react";
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { changeUserData } from '@/components/server/changeUserProfile';

export default function UserSettings() {
  const { isLoaded, user } = useUser();
  const [isVerifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const login = searchParams.get('user') || 'Гість';
  const [userEmail, setUserEmail] = useState<string|null>();
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {getEmailFromDataBase()}, []);

  const getEmailFromDataBase = async () => {
      setUserEmail(await getUserEmail());
  }

  const changeUserDataSchema = z.object({
  userName: z.union([
    z.string().min(3, "Мінімум 3 символи").max(30).regex(/^[a-zA-Zа-яА-Я]+$/, "Тільки букви"),
    z.literal("") // Дозволяємо пустий рядок
  ]),

  userEmail: z.union([
    z.string().email("Неправильний формат"),
    z.literal("")
  ]),

  userPhone: z.union([
    z.string().regex(/^\+[0-9]{12}$/, "Формат +380000000000"),
    z.literal("")
  ]),

  userImage: z.array(z.instanceof(File))
    .max(1, "Максимум 1 зображення")
    .refine((files) => files.every((f) => f.type.startsWith("image/")), "Тільки зображення")
    .refine((files) => files.every((f) => f.size <= 5 * 1024 * 1024), "Максимум 5MB")
});



  type changeUserData = z.infer<typeof changeUserDataSchema>;

  const {register, handleSubmit, formState: {errors}, setValue, trigger, reset} = useForm<changeUserData>({
    resolver: zodResolver(changeUserDataSchema),
    mode: 'onChange',
    defaultValues: {
      userName: "",
      userEmail: "",
      userImage: [],
      userPhone: "",
    }
  });

  if(!isLoaded || !user) return null;

  const emailResource = user.primaryEmailAddress;
  const isVerifyed = emailResource?.verification.status === "verified";
  
  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    imgUrls.forEach((url) => URL.revokeObjectURL(url));

    const fileArray = Array.from(files).slice(0, 1);

    // Оновлюємо прев'ю
    imgUrls.forEach((url) => URL.revokeObjectURL(url));
    const urls = fileArray.map((file) => URL.createObjectURL(file));

    setImgUrls(urls);

    // ЗАПИСУЄМО МАСИВ У ФОРМУ
    setValue("userImage", fileArray, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    // Примусово перевіряємо
    trigger("userImage");
  };

  
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

  const onSubmit: SubmitHandler<changeUserData> = async (data) => {
    if(!user) return;
      const formData = new FormData();
  
      formData.append("userName", data.userName);
      formData.append("userEmail", data.userEmail);
      formData.append("userPhone", data.userPhone);
      formData.append("userId", user?.id);
      formData.append("userImage", data.userImage[0] as File); // Додаємо 'as File'
      await changeUserData(formData);
  
      reset();
      setImgUrls([]);
    };

  const { ref: galleryRef, ...galleryRest } = register("userImage");

  return (
    <div className="p-4 bg-cyan-950 text-amber-100 rounded-t-xl">
      <h1 className="my-10 uppercase text-center text-xl md:text-2xl">
        {`Налаштування сторінки ${login}`}
      </h1>
      
      {/* action={updateUserInfo} использует серверный экшн */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2 md:max-w-2/3 md:mx-auto">
        <label htmlFor="avatar" className="">Виберіть картинку для аватару:</label>
        {/* IMAGE */}
              <label
                htmlFor="item_gallery"
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (!imageInputRef.current) return;
        
                  imageInputRef.current.files = e.dataTransfer.files;
        
                  processFiles(e.dataTransfer.files);
                }}
                className={`border h-50 p-6 grid place-items-center cursor-pointer rounded border-amber-50 text-amber-50 ${
                  isDragging
                    ? "border-green-500 shadow-md shadow-green-700 text-green-500"
                    : ""
                }`}
              >
                Перетягніть або натисніть
                <ImagePlus className="mx-auto mt-2" />
              </label>
        
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                {...galleryRest}
                ref={(e) => {
                  galleryRef(e);
                  imageInputRef.current = e;
                }}
                onChange={(e) => processFiles(e.target.files)}
                id="item_gallery"
              />
        
              {errors.userImage && (
                <p className="text-red-500">{errors.userImage.message as string}</p>
              )}
        
              {/* PREVIEW */}
              <div className="flex gap-2 mt-4 flex-wrap rounded">
                {imgUrls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    className="w-32 h-32 object-fit border rounded"
                  />
                ))}
              </div>
        
        <label htmlFor="name" className="">Введіть нове ім я:</label>
        <input {...register("userName")} type="text" className="border-2 border-amber-50 h-10 rounded-xl p-4 text-black" />

        {errors.userName && (
                <p className="text-red-500">{errors.userName.message as string}</p>
              )}
        
        <label htmlFor="userPhone" className="">Додати номер телефону:</label>
        {isVerifyed ? <input {...register("userPhone")} type="text" className="border-2 border-amber-50 h-10 rounded-xl p-4 text-black" /> : <p className="h-10 text-red-500">⚠️ Неможливо додати/змінити номер телефону, без підтвердження пошти!</p>}
        {isVerifyed && errors.userPhone && (
                <p className="text-red-500">{errors.userPhone.message as string}</p>
              )}
        
        <label htmlFor="userEmail" className="">Змінити емейл:</label>
        {isVerifyed && <p>{userEmail} ✅ Емейл верифіковано!</p>}
        {isVerifyed ? <input {...register("userEmail")} type="text" className="border-2 border-amber-50 h-10 rounded-xl p-4 text-black" /> : <p className="h-10 text-red-500">⚠️ Ектронна пошта <span className='text-green-800 font-bold'>{userEmail}</span> не підтверджена! Потрібна верифікація</p>}
        {isVerifyed && errors.userEmail && (
                <p className="text-red-500">{errors.userEmail.message as string}</p>
              )}

        {isVerifying && <div className='flex flex-col gap-y-2 md:max-w-2/3 md:mx-auto'>
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
