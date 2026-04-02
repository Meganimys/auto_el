"use client"; // Указываем, что это клиентский компонент

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getUserEmail } from "@/components/server/lib/prismaManager";
import { useForm, SubmitHandler } from "react-hook-form";
import { ImagePlus } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changeUserData,
  changeUserEmail,
} from "@/components/server/changeUserProfile";
import { checkAvailability } from "@/components/server/lib/checkUser";
import { generateEmailDefenderCode, checkEmailDefenderCode } from "@/components/server/emailDefender";

export default function UserSettings() {
  const { isLoaded, user } = useUser();
  const [isVerifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const login = searchParams.get("user") || "Гість";
  const [userEmail, setUserEmail] = useState<string | null | undefined>(null);
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "same"
  >("idle");
  const [isChangeEmail, setIsChangeEmail] = useState(false);
  const [changeEmailCode, setChangeEmailCode] = useState("");
  const [userCode, setUserCode] = useState("");
  const [isPermittedToChangeEmail, setIsPermittedToChangeEmail] = useState(false);

  useEffect(() => {
    getEmailFromDataBase();
  }, []);

  const getEmailFromDataBase = async () => {
    setUserEmail(await getUserEmail());
  };

  useEffect(() => {
    if (!newEmail || !userEmail) return;

    const normalizedInput = newEmail.trim().toLowerCase();
    const normalizedUser = userEmail.trim().toLowerCase();

    // ❗ Якщо той самий емейл — ВИХІД БЕЗ debounce
    if (normalizedInput === normalizedUser) {
      setEmailStatus("same");
      return;
    }

    if (newEmail.length < 3) {
      setEmailStatus("idle");
      return;
    }

    setEmailStatus("checking");

    const timeout = setTimeout(async () => {
      const isTaken = await checkAvailability("email", newEmail);

      // ❗ ПЕРЕВІРКА ЩЕ РАЗ перед setState
      if (newEmail.trim().toLowerCase() === userEmail.trim().toLowerCase()) {
        setEmailStatus("same");
        return;
      }

      setEmailStatus(isTaken ? "taken" : "available");
    }, 500);

    return () => clearTimeout(timeout);
  }, [newEmail, userEmail]);

  const changeEmailSchema = z.object({
    userEmail: z
      .string()
      .min(1, "Поле не може бути порожнім")
      .email("Неправильний формат"),
  });

  const changeUserDataSchema = z.object({
    userName: z.union([
      z
        .string()
        .min(3, "Мінімум 3 символи")
        .max(30)
        .regex(/^[a-zA-Zа-яА-Я]+$/, "Тільки букви"),
      z.literal(""), // Дозволяємо пустий рядок
    ]),
    userPhone: z.union([
      z.string().regex(/^\+[0-9]{12}$/, "Формат +380000000000"),
      z.literal(""),
    ]),

    userImage: z
      .array(z.instanceof(File))
      .max(1, "Максимум 1 зображення")
      .refine(
        (files) => files.every((f) => f.type.startsWith("image/")),
        "Тільки зображення",
      )
      .refine(
        (files) => files.every((f) => f.size <= 5 * 1024 * 1024),
        "Максимум 5MB",
      ),
  });

  type changeEmailData = z.infer<typeof changeEmailSchema>;
  type changeUserData = z.infer<typeof changeUserDataSchema>;

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
    setValue: setEmailValue,
    trigger: triggerEmail,
    reset: resetEmail,
  } = useForm<changeEmailData>({
    resolver: zodResolver(changeEmailSchema),
    mode: "onChange",
    defaultValues: {
      userEmail: "",
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    reset,
  } = useForm<changeUserData>({
    resolver: zodResolver(changeUserDataSchema),
    mode: "onChange",
    defaultValues: {
      userName: "",
      userImage: [],
      userPhone: "",
    },
  });

  if (!isLoaded || !user) return null;

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
      await emailResource?.prepareVerification({ strategy: "email_code" });
      setVerifying(true);
    } catch (err: any) {
      setError(err.errors[0]?.message || "Помилка відправки");
    }
  };

  const handleVerifyEmail = async () => {
    try {
      setError("");
      const result = await emailResource?.attemptVerification({ code });
      if (result?.verification.status === "verified") {
        setError("Емейл успішно підтверджено!");
      } else {
        setError("Помилка верифікації!");
      }
    } catch (err) {
      console.error("Невірний код:", err);
      setError("Невірний код:" + err);
    }
  };

  const getEmailCode = async () => {
    const code = await generateEmailDefenderCode(userEmail as string);
    setChangeEmailCode(code);
    setIsChangeEmail(true);
  };

  const handleVerifyChangeEmailCode = async () => {
    const isValid = await checkEmailDefenderCode(changeEmailCode, userCode);
    setIsPermittedToChangeEmail(isValid);
    setIsChangeEmail(false);
    setChangeEmailCode("");
     if (!isValid) {
      setError("Невірний код підтвердження для зміни емейлу!");
      setIsPermittedToChangeEmail(false);
      setUserCode("");
    } else {
      setError("");
    }
  };


  const onSubmitEmail: SubmitHandler<changeEmailData> = async (data) => {
    if (!user || !data.userEmail) return;
    const formData = new FormData();
    formData.append("userEmail", data.userEmail as string);
    formData.append("userId", user?.id);
    await changeUserEmail(formData);
    resetEmail();
    getEmailFromDataBase();
    setIsChangeEmail(false);
    setIsPermittedToChangeEmail(false);
  };

  const onSubmit: SubmitHandler<changeUserData> = async (data) => {
    if (!user) return;
    const formData = new FormData();

    formData.append("userName", data.userName);
    formData.append("userPhone", data.userPhone);
    formData.append("userId", user?.id);
    formData.append("userImage", data.userImage[0] as File); // Додаємо 'as File'
    await changeUserData(formData);

    reset();
    setImgUrls([]);
  };

  const { ref: galleryRef, ...galleryRest } = register("userImage");
  const isDisabled = emailStatus !== "available" || !isVerifyed;

  return (
    <div className="p-4 bg-cyan-950 text-amber-100 rounded-t-xl">
      <h1 className="my-10 uppercase text-center text-xl md:text-2xl">
        {`Налаштування сторінки ${login}`}
      </h1>

      {/* action={updateUserInfo} использует серверный экшн */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-2 md:max-w-2/3 md:mx-auto"
      >
        <label htmlFor="avatar" className="">
          Виберіть картинку для аватару:
        </label>
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

        <label htmlFor="name" className="">
          Введіть нове ім я:
        </label>
        <input
          {...register("userName")}
          type="text"
          className="border-2 border-amber-50 h-10 rounded-xl p-4 text-black"
        />

        {errors.userName && (
          <p className="text-red-500">{errors.userName.message as string}</p>
        )}

        <label htmlFor="userPhone" className="">
          Додати номер телефону:
        </label>
        {isVerifyed ? (
          <input
            {...register("userPhone")}
            type="text"
            className="border-2 border-amber-50 h-10 rounded-xl p-4 text-black"
          />
        ) : (
          <p className="h-10 text-red-500">
            ⚠️ Неможливо додати/змінити номер телефону, без підтвердження пошти!
          </p>
        )}
        {isVerifyed && errors.userPhone && (
          <p className="text-red-500">{errors.userPhone.message as string}</p>
        )}
        <button
          type="submit"
          className="cursor-pointer bg-orange-800 md:max-w-1/2 md:min-w-1/2 md:mx-auto h-10 rounded-xl hover:bg-orange-700 my-5"
        >
          Змінити інформацію
        </button>
      </form>

      <form
        onSubmit={handleSubmitEmail(onSubmitEmail)}
        className="flex flex-col gap-y-2 md:max-w-2/3 md:mx-auto"
      >
        <label htmlFor="userEmail">Змінити емейл:</label>

        {isVerifyed && (
          <p className="text-sm text-amber-200">
            {userEmail} <span className="text-green-400">✅ Верифіковано!</span>
          </p>
        )}

        {isVerifyed ? (
          <input
            {...registerEmail("userEmail")}
            onChange={(e) => {
              const val = e.target.value;
              setNewEmail(val);
              // ВИКОРИСТОВУЙ setEmailValue замість setValue
              setEmailValue("userEmail", val, { shouldValidate: true });
            }}
            type="email"
            placeholder="Новий емейл"
            className="border-2 border-amber-50 h-10 rounded-xl p-4 text-black focus:outline-none focus:border-orange-500"
          />
        ) : (
          <p className="h-10 text-red-500">
            ⚠️ Пошта{" "}
            <span className="text-orange-300 font-bold">{userEmail}</span> не
            підтверджена!
          </p>
        )}

        {emailErrors.userEmail && (
          <p className="text-red-500 text-sm">
            {emailErrors.userEmail.message}
          </p>
        )}

        {emailStatus === "same" && (
          <p className="text-red-500 text-sm font-semibold">
            Це ваш поточний емейл
          </p>
        )}

        {emailStatus === "checking" && (
          <p className="text-yellow-400 text-sm">Перевірка...</p>
        )}

        {emailStatus === "taken" && (
          <p className="text-red-500 text-sm font-semibold">
            Цей емейл вже зайнятий
          </p>
        )}

        {emailStatus === "available" && (
          <p className="text-green-500 text-sm font-semibold">
            Емейл доступний ✅
          </p>
        )}

        {/* Блок верифікації */}
        {isVerifying && (
          <div className="flex flex-col gap-y-2 mt-4">
            <label>Введіть код з пошти:</label>
            <input
              type="text"
              onChange={(e) => setCode(e.target.value)}
              className="border-2 border-amber-50 h-10 rounded-xl p-4 text-black"
            />
            <button
              type="button"
              onClick={handleVerifyEmail}
              className="bg-orange-800 h-10 rounded-xl hover:bg-orange-700 transition-colors"
            >
              Підтвердити код
            </button>
          </div>
        )}

        <p className="text-orange-400 text-xs italic">{error}</p>

        {!isVerifyed && !isVerifying && (
          <button
            type="button"
            onClick={handleSendEmailCode}
            className="bg-orange-800 h-10 rounded-xl hover:bg-orange-700 transition-all mt-2"
          >
            Надіслати код підтвердження
          </button>
        )}
        {isChangeEmail && <label htmlFor="newEmail">Введіть код підтвердження з пошти {userEmail}:</label>}
        {isChangeEmail && <input type="text" onChange={(e) => setUserCode(e.target.value)}/>}
        {isChangeEmail && <button type="button" onClick={handleVerifyChangeEmailCode} className="bg-green-700 h-10 rounded-xl hover:bg-green-600 transition-colors">Підтвердити код</button>}
        {!isDisabled && !emailErrors.userEmail && !isChangeEmail && <button 
        type="button"
        className="bg-green-700 md:max-w-1/2 md:min-w-1/2 md:mx-auto h-10 rounded-xl hover:bg-green-600 cursor-pointer" onClick={getEmailCode}
        >Відправити код підтвердження</button>}
        {/* Кнопка "Змінити" активна тільки якщо емейл верифіковано і поле валідне */}
        <button
          type="submit"
          disabled={isDisabled && emailErrors.userEmail ? true : false}
          className={`h-10 rounded-xl my-5 transition-all ${
            isDisabled && emailErrors.userEmail && isPermittedToChangeEmail
              ? "bg-gray-600 cursor-not-allowed md:max-w-1/2 md:min-w-1/2 md:mx-auto h-10 rounded-xl opacity-50"
              : "bg-green-700 md:max-w-1/2 md:min-w-1/2 md:mx-auto h-10 rounded-xl hover:bg-green-600 cursor-pointer"
          }`}
        >
          Змінити емейл
        </button>
      </form>

      <Link
        href={`/pass_change?user=${login}`}
        className="text-center mx-auto block mt-2"
      >
        Змінити пароль
      </Link>
    </div>
  );
}
