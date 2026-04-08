"use client";

import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { changeUserPassword } from "@/components/server/getUser";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { getUserEmail } from "@/components/server/lib/prismaManager";
import EmailVerificationBlock from "@/components/client/EmailVerificationBlock";

export default function PasswordChangePage() {
  const searchParams = useSearchParams();
  const login = searchParams.get("user") || "невідомого користувача";
  const { user, isLoaded } = useUser();
  const [isEmailPermitted, setIsEmailPermitted] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null | undefined>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");


  useEffect(() => {
      getEmailFromDataBase();
    }, []);
  
    const getEmailFromDataBase = async () => {
      setUserEmail(await getUserEmail());
    };
  

  const passwordSchema = z
  .object({
    currentPassword: z
          .string()
          .min(8, "Пароль мінімум 8 символів")
          .max(25, "Пароль максимум 25 символів")
          .regex(
            /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+]).+$/,
            "Пароль повинен мати одну букву у верхньому регістрі, одну цифру и один спеціальный символ",
          ),
    newPassword: z
          .string()
          .min(8, "Пароль мінімум 8 символів")
          .max(25, "Пароль максимум 25 символів")
          .regex(
            /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+]).+$/,
            "Пароль повинен мати одну букву у верхньому регістрі, одну цифру и один спеціальный символ",
          ),
  })
  .required();

type PasswordFormData = z.infer<typeof passwordSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  }
);

  if (!isLoaded) return <div>Завантаження...</div>;
  if (!user) return <div>Користувач не знайдений</div>;

  const emailStatus = user.primaryEmailAddress;
  const isVerified = emailStatus?.verification.status === "verified";
  const isPasswordNotEmpty = oldPassword !== "" && newPassword !== "";

  if (!isVerified) {
    return (
      <div>
        Будь ласка,{" "}
        <Link
          href="/profile/user_settings"
          className="text-blue-500 hover:text-blue-300"
        >
          підтвердіть
        </Link>{" "}
        свою електронну адресу, щоб змінити пароль.
      </div>
    );
  }

  const onSubmit: SubmitHandler<PasswordFormData> = async (data) => {
    if (!isEmailPermitted) {
      alert("Будь ласка, підтвердіть старий email для зміни пароля.");
      return;
    }
    const pass = new FormData();
    pass.append("currentPassword", data.currentPassword);
    pass.append("newPassword", data.newPassword);
    try {
      const response = await changeUserPassword(pass);
      if (response.result) {
        setSuccessMessage(response.message);
        setErrorMessage("");
        reset();
      } else {
        setErrorMessage(response.message);
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("Помилка при зміні пароля: " + (error as Error).message);
      setSuccessMessage("");
    }
  };

  return (
    <div>
      <h1 className="pt-20 pb-5 text-center uppercase">Зміна пароля</h1>
      <p className="pb-5 text-center">
        Привіт, ви змінюєте пароль для користувача {login}.
      </p>
      {/* Тут можна додати форму для зміни пароля */}
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 pb-20">
        <label htmlFor="currentPassword">Поточний пароль</label>
        <input
          className="min-h-10 border-2 border-amber-50 rounded-xl"
          type="password"
          {...register("currentPassword")}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        {errors.currentPassword && (
          <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>
        )}
        <label htmlFor="newPassword">Новий пароль</label>
        <input
          className="min-h-10 border-2 border-amber-50 rounded-xl"
          type="password"
          {...register("newPassword")}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {errors.newPassword && (
          <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
        )}
        {errors.currentPassword === undefined && errors.newPassword === undefined && !isEmailPermitted && isPasswordNotEmpty && (<div><EmailVerificationBlock
            email={userEmail as string} // ✅ СТАРИЙ EMAIL
            onSuccess={() => {
              setIsEmailPermitted(true);
            }}
          /><p className="text-yellow-400 text-sm">
            🔐 Підтвердіть старий email для зміни
          </p></div>)}
        <button
          type="submit"
          disabled={!isPasswordNotEmpty && !isEmailPermitted && errors.currentPassword !== undefined && errors.newPassword !== undefined}
          className={isPasswordNotEmpty && isEmailPermitted && errors.currentPassword === undefined && errors.newPassword === undefined ? `min-w-1/2 min-h-10 rounded-xl mx-auto bg-green-700` : `min-w-1/2 min-h-10 rounded-xl mx-auto bg-gray-500`}
        >
          Змінити пароль
        </button>
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
      </form>
    </div>
  );
}
