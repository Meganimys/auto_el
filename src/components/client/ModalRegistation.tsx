"use client";
import React, {
  useImperativeHandle,
  useRef,
  forwardRef,
  Fragment,
  useEffect,
  useState,
} from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { saveUserToDatabase } from "../server/lib/prismaManager";
import Link from "next/link";
import { checkAvailability } from "../server/lib/checkUser";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const RegistarionSchema = z
  .object({
    login: z
      .string()
      .min(3, "Логін мінімум 3 символа")
      .max(20, "Логін максимум 20 символов")
      .regex(/^[a-zA-Z0-9_-]+$/, "Только буквы, цифры, дефис и подчеркивание"),
    email: z
      .email("Неверный формат электронной почты")
      .regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Неверный формат электронной почты",
      ),
    password: z
      .string()
      .min(6, "Пароль минимум 6 символов")
      .max(25, "Пароль максимум 25 символов")
      .regex(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+]).+$/,
        "Пароль должен содержать хотя бы одну заглавную букву, одну цифру и один специальный символ",
      ),
    passwordRepeat: z
      .string()
      .min(6, "Пароль минимум 6 символов")
      .max(25, "Пароль максимум 25 символов")
      .regex(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+]).+$/,
        "Пароль должен содержать хотя бы одну заглавную букву, одну цифру и один специальный символ",
      ),
  })
  .refine((data) => data.password === data.passwordRepeat, {
    message: "Пароли не совпадают",
    path: ["passwordRepeat"], // ТЕПЕР ПОМИЛКА БУДЕ ТУТ
  });

type RegistrationFormData = z.infer<typeof RegistarionSchema>;

const ModalRegistration = forwardRef(
  ({ onSwitchToLogin }: { onSwitchToLogin?: () => void }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const { isLoaded, signUp, setActive } = useSignUp(); // Ініціалізація Clerk
    const router = useRouter();
    const [isLoginAvailable, setIsLoginAvailable] = useState<boolean | null>(
      null,
    );
    const [isLoginChecking, setIsLoginChecking] = useState(false);
    const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(
      null,
    );
    const [isEmailChecking, setIsEmailChecking] = useState(false);

    const {
      register,
      handleSubmit,
      watch,
      setError,
      clearErrors,
      formState: { errors },
    } = useForm<RegistrationFormData>({
      resolver: zodResolver(RegistarionSchema),
      mode: "onChange",
      defaultValues: {
        login: "",
        email: "",
        password: "",
        passwordRepeat: "",
      },
    });

    const watchLogin = watch("login");
    const watchEmail = watch("email");

    useEffect(() => {
      setIsLoginAvailable(null);
      const delayDebounceFn = setTimeout(async () => {
        if (watchLogin.length >= 3 && !errors.login) {
          setIsLoginChecking(true);
          const isTaken = await checkAvailability("login", watchLogin);
          console.log("Is taken from DB:", isTaken);
          setIsLoginChecking(false);
          if (isTaken) {
            setError("login", {
              type: "manual",
              message: "Цей логін вже зайнятий",
            });
            setIsLoginAvailable(false);
          } else {
            clearErrors("login");
            setIsLoginAvailable(true);
          }
        }
      }, 500); // Перевірка через 0.5 сек після зупинки вводу

      return () => clearTimeout(delayDebounceFn);
    }, [watchLogin, errors.login]);

    useEffect(() => {
      setIsEmailAvailable(null);
      const delayDebounceFn = setTimeout(async () => {
        if (watchEmail.length > 0 && !errors.login) {
          setIsEmailChecking(true);
          const isTaken = await checkAvailability("email", watchEmail);
          setIsEmailChecking(false);
          if (isTaken) {
            setError("email", {
              type: "manual",
              message: "Ця електронна пошта вже зайнята",
            });
            setIsEmailAvailable(false);
          } else {
            clearErrors("email");
            setIsEmailAvailable(true);
          }
        }
      }, 500); // Перевірка через 0.5 сек після зупинки вводу

      return () => clearTimeout(delayDebounceFn);
    }, [watchEmail, errors.email]);

    const onSubmit: SubmitHandler<RegistrationFormData> = async (data) => {
      if (!isLoaded) return; // Чекаємо, поки Clerk завантажиться

      try {
        const result = await signUp.create({
          emailAddress: data.email,
          password: data.password,
          username: data.login,
        });

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          const formData = new FormData();
          formData.append("id", result.createdUserId as string); // Передаємо ID від Clerk
          formData.append("login", data.login);
          formData.append("email", data.email);
          const saveResult = await saveUserToDatabase(formData);
          if (!saveResult.success) {
            alert("Помилка збереження користувача в базі даних");
          } else {
            dialogRef.current?.close();
            router.push("/");
          }
        } else {
          console.error("Помилка реєстрації:", result);
          alert("Помилка реєстрації. Спробуйте ще раз.");
        }
      } catch (error) {
        console.error("Помилка реєстрації:", error);
        alert("Помилка реєстрації. Спробуйте ще раз.");
      }
    };

    useImperativeHandle(ref, () => ({
      openModal: () => {
        dialogRef.current?.showModal();
      },
      closeModal: () => {
        dialogRef.current?.close();
      },
    }));

    const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) {
        dialogRef.current?.close();
      }
    };
    // 1. Убираем фиксированную высоту. Добавляем h-auto. 
// overflow-visible гарантирует, что тени и текст не вызовут полос.
const dialogStyle: string =
  "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0 p-0 border-none bg-transparent outline-none z-50 w-full max-w-fit h-auto hidden open:grid place-items-center backdrop:bg-black/50 overflow-visible";

// 2. В divStyle убираем w-[34vw]. max-h-[90vh] на случай очень маленьких экранов (телефонов), 
// чтобы модалка не ушла за границы экрана.
const divStyle: string =
  "relative w-[95vw] max-w-[450px] font-bold p-6 md:p-8 text-amber-100 bg-gray-900 flex flex-col items-center rounded-[20px] border-2 border-yellow-800 shadow-2xl overflow-y-auto max-h-[95vh]";

// 3. Инпуты должны занимать всю ширину контейнера формы.
const inputTextStyle: string =
  "w-full min-h-10 px-4 border-2 border-solid border-gray-800 rounded-xl bg-gray-800 text-white focus:border-purple-500 outline-none transition-colors";

// 4. В formStyle меняем grid на flex для более мягкого распределения высоты.
// max-w-[90%] даёт отступы по бокам внутри divStyle.
const formStyle: string =
  "w-full max-w-[350px] flex flex-col items-stretch text-center gap-3 py-4";

const submitButtonStyle: string =
  "min-h-12 mt-4 bg-purple-700 rounded-xl text-amber-100 font-bold hover:bg-purple-600 active:bg-purple-500 transition-all";

const closeDialogButtonStyle: string =
  "absolute top-4 right-4 h-10 w-10 flex items-center justify-center border-2 border-yellow-800 rounded-xl text-2xl hover:bg-amber-300 hover:text-red-500 transition-colors";


    return (
      <Fragment>
        <dialog
          className={dialogStyle}
          ref={dialogRef}
          onClick={handleBackdropClick}
        >
          <div className={divStyle} onClick={(e) => e.stopPropagation()}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={formStyle}
              noValidate
            >
              <label htmlFor="login-input" className="">
                Введіть логін:
              </label>
              <input
                type="text"
                id="login-input"
                className={inputTextStyle}
                placeholder="Enter your login"
                {...register("login")}
              />
              {/* Приоритет 1: Ошибка (от Zod или ручная) */}
              {errors.login && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.login.message}
                </p>
              )}

              {/* Приоритет 2: Идет проверка */}
              {isLoginChecking && (
                <p className="text-blue-400 text-sm mt-1">
                  Перевірка доступності...
                </p>
              )}

              {/* Приоритет 3: Логин свободен (только если нет ошибок и проверка завершена) */}
              {!errors.login && isLoginAvailable && !isLoginChecking && (
                <p className="text-green-500 text-sm mt-1">
                  ✨ Цей логін вільний!
                </p>
              )}
              <label htmlFor="email-input" className="">
                Введіть свою електронну пошту:
              </label>
              <input
                type="email"
                id="email-input"
                className={inputTextStyle}
                placeholder="Enter you email"
                {...register("email")}
              />
              {/* Приоритет 1: Ошибка (от Zod или ручная) */}
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}

              {/* Приоритет 2: Идет проверка */}
              {isEmailChecking && (
                <p className="text-blue-400 text-sm mt-1">
                  Перевірка доступності...
                </p>
              )}

              {/* Приоритет 3: Логин свободен (только если нет ошибок и проверка завершена) */}
              {!errors.login && isEmailAvailable && !isEmailChecking && (
                <p className="text-green-500 text-sm mt-1">
                  ✨  Ця пошта вільна!
                </p>
              )}
              <label htmlFor="password-input" className="">
                Введіть пароль:
              </label>
              <input
                type="password"
                id="password-input"
                className={inputTextStyle}
                placeholder="Enter your password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
              <label htmlFor="password-repeat-input" className="">
                Введіть пароль повторно:
              </label>
              <input
                type="password"
                id="password-repeat-input"
                className={inputTextStyle}
                placeholder="Repeat your password"
                {...register("passwordRepeat")}
              />
              {errors.passwordRepeat && (
                <p className="text-red-500">{errors.passwordRepeat.message}</p>
              )}
              <button type="submit" className={submitButtonStyle}>
                Зареєструватися
              </button>
              <Link
                href="#"
                onClick={() => {
                  onSwitchToLogin?.();
                }}
                className="text-sm text-gray-400 hover:text-gray-200"
              >
                Вже є акаунт? Увійти
              </Link>
            </form>
            <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className={closeDialogButtonStyle}
              >
                x
              </button>
          </div>
        </dialog>
      </Fragment>
    );
  },
);

ModalRegistration.displayName = "ModalRegistration";
export default ModalRegistration;
