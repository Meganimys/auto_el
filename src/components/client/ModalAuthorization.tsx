"use client";
import Link from "next/link";
import React, {
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
  forwardRef,
  Fragment,
} from "react";
import * as z from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email("Неверный формат"),
  password: z.string().min(8, "Минимум 8 символов"),
});

type AuthorizationFormData = z.infer<typeof formSchema>;

const ModalAuthorization = forwardRef(
  ({ onSwitchToLogin }: { onSwitchToLogin?: () => void }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const { signIn, isLoaded, setActive } = useSignIn();

    const router = useRouter();

    const [authError, setAuthError] = useState<string | null>(null);

    const [isAuthorization, setAuthStatus] = useState<boolean>(false);

    const { register, handleSubmit, formState: { errors } } = useForm<AuthorizationFormData>({
    // 4. Сюди передаємо СХЕМУ (formSchema), а не тип
    resolver: zodResolver(formSchema), 
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

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

    const onSubmit: SubmitHandler<AuthorizationFormData> = async (data) => {
      if(!isLoaded) return;

      setAuthStatus(true)

      try{
        const result = await signIn.create({
          identifier: data.email,
          password: data.password
        });

        if(result.status==="complete") {
          await setActive({session: result.createdSessionId});
          dialogRef.current?.close();
          router.push("/");
          router.refresh();
        } else {
      console.log("Додаткові кроки валідації:", result.status);
    } 
    
      } catch (err: any) {
        const msg = err.errors?.[0]?.longMessage || "Невірний логін або пароль";
        setAuthError(msg);
    console.error("Помилка логіну:", err.errors);
  }
  setAuthStatus(false);
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
            <form onSubmit={handleSubmit(onSubmit)} className={formStyle}>
              <label htmlFor="" className="">
                Введіть свою електронну пошту:
              </label>
              <input
                type="email"
                className={inputTextStyle}
                placeholder="Enter your email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
              <label htmlFor="" className="">
                Введіть пароль:
              </label>
              <input
                type="password"
                className={inputTextStyle}
                placeholder="Enter your password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
              <button type="submit" className={submitButtonStyle} disabled={isAuthorization}>
                {isAuthorization ? "Виконується вхід..." : "Увійти"}
              </button>
              {authError && <p className="text-red-500">{authError}</p>}
              <Link
                href="#"
                onClick={() => {
                  onSwitchToLogin?.();
                }}
                className="text-sm text-gray-400 hover:text-gray-200"
              >
                Немає акаунта? Зареєструватися
              </Link>
              <button
                type="button"
                className={closeDialogButtonStyle}
                onClick={() => dialogRef.current?.close()}
              >
                x
              </button>
            </form>
          </div>
        </dialog>
      </Fragment>
    );
  },
);

ModalAuthorization.displayName = "ModalAvtorization";
export default ModalAuthorization;
