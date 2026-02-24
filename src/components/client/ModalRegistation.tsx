"use client";
import React, {
  useImperativeHandle,
  useRef,
  forwardRef,
  Fragment,
} from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { saveUserToDatabase } from "../server/lib/prismaManager";
import { Link } from "lucide-react";

const RegistarionSchema = z.object({
  login: z
    .string()
    .min(3, "Логін мінімум 3 символа")
    .max(20, "Логін максимум 20 символов")
    .regex(/^[a-zA-Z0-9_-]+$/, "Только буквы, цифры, дефис и подчеркивание"),
  email: z
    .email("Неверный формат электронной почты")
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Неверный формат электронной почты"),
  password: z
    .string()
    .min(6, "Пароль минимум 6 символов")
    .max(25, "Пароль максимум 25 символов")
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+]).+$/, "Пароль должен содержать хотя бы одну заглавную букву, одну цифру и один специальный символ"),
  passwordRepeat: z
    .string()
    .min(6, "Пароль минимум 6 символов")
    .max(25, "Пароль максимум 25 символов")
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+]).+$/, "Пароль должен содержать хотя бы одну заглавную букву, одну цифру и один специальный символ"),
}).refine((data) => data.password === data.passwordRepeat, {
  message: "Пароли не совпадают"});

type RegistrationFormData = z.infer<typeof RegistarionSchema>;

const ModalRegistration = forwardRef((props, ref) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<RegistrationFormData>({
    resolver: zodResolver(RegistarionSchema),
    defaultValues: {
      login: "",
      email: "",
      password: "",
      passwordRepeat: "",
    },
  });

  const onSubmit: SubmitHandler<RegistrationFormData> = async (data) => {
    const formData = new FormData();
    formData.append("login", data.login);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("passwordRepeat", data.passwordRepeat);
    await saveUserToDatabase(formData);
    console.log("Форма отправлена с данными:", data);
  }

  useImperativeHandle(ref, () => ({
    openModal: () => {
      dialogRef.current?.showModal();
    },
  }));

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      dialogRef.current?.close();
    }
  };
  const dialogStyle: string =
    "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0 p-0  border-none bg-transparent outline-none z-50 w-[90vw] md:w-[35%] min-h-[50vh] hidden open:grid place-items-center backdrop:bg-black/50";
  const divStyle: string =
    "overflow-hidden w-[34vw] min-w-[320px] font-bold p-6 text-amber-100 bg-gray-900 grid place-items-center rounded-[20px] border-2 border-yellow-800";
  const inputTextStyle: string =
    "min-h-10 pl-2 border-2 border-solid border-gray-800 rounded-xl";
  const formStyle: string =
    "my-10 max-w-[80%] grid col-auto items-center text-center gap-6.25";
  const submitButtonStyle: string =
    "min-h-10  bg-purple-700 rounded-xl text-amber-100 hover:bg-purple-600 active:bg-purple-500";
  const closeDialogButtonStyle: string =
    "absolute top-5 right-5 min-h-10 min-w-10 border-2 border-yellow-800 rounded-xl text-3xl hover:bg-amber-300 hover:text-red-500 active:bg-amber-200";

  return (
    <Fragment>
      <dialog
        className={dialogStyle}
        ref={dialogRef}
        onClick={handleBackdropClick}
      >
        <div className={divStyle} onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handleSubmit(onSubmit)} className={formStyle}>
            <label htmlFor="login-input" className="">
              Введіть логін:
            </label>
            <input
              type="text"
              id="login-input"
              className={inputTextStyle}
              minLength={3}
              maxLength={20}
              pattern="[a-zA-Z0-9_-]+"
              placeholder="Enter your login"
              title="Логін не може бути коротшим за 3 літери"
              required
              {...register("login")}
            />
              {errors.login && (
                <p className="text-red-500">{errors.login.message}</p>
              )}
            <label htmlFor="email-input" className="">
              Введіть свою електронну пошту:
            </label>
            <input
              type="email"
              id="email-input"
              className={inputTextStyle}
              pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
              title="Введіть корректну пошту в форматі domain@domain.name"
              required
              placeholder="Enter you email"
              {...register("email")}
            />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            <label htmlFor="password-input" className="">
              Введіть пароль:
            </label>
            <input
              type="password"
              id="password-input"
              className={inputTextStyle}
              minLength={6}
              maxLength={25}
              pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+]).+$"
              title="Пароль має містити велику літеру, цифру та спецсимвол"
              required
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
              minLength={6}
              maxLength={25}
              pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+]).+$"
              title="Пароль має містити велику літеру, цифру та спецсимвол"
              required
              placeholder="Repeat your password"
              {...register("passwordRepeat")}
            />
              {errors.passwordRepeat && (
                <p className="text-red-500">{errors.passwordRepeat.message}</p>
              )}
            <button type="submit" className={submitButtonStyle}>
              Зареєструватися
            </button>
            <Link href="/login" className="text-sm text-gray-400 hover:text-gray-200">
              Вже є акаунт? Увійти
            </Link>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className={closeDialogButtonStyle}
            >
              x
            </button>
          </form>
        </div>
      </dialog>
    </Fragment>
  );
});

ModalRegistration.displayName = "ModalRegistration";
export default ModalRegistration;
