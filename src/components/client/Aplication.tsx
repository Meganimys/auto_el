"use client";
import { Fragment } from "react/jsx-runtime";
import { useState } from "react";
import * as z from 'zod';
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendAndSaveMessage } from "../server/sendAndSaveForm";

const formSchema = z.object({
  userName: z.string()
  .min(3, 'Мінімум три символа!')
  .max(20, 'Не більше 20 символів'),
  email: z
        .email("Неправильний формат електронної пошти")
        .regex(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Неправильний формат електронної пошти",
        ),
  category: z.string()
  .refine(categ => categ != "" && categ, "Виберіть категорію!"),
  message: z.string()
  .min(100, "Не менше 100 символів!")
  .max(1000, "Не більше 1000 символів"),
})

type EmailSendFormData = z.infer<typeof formSchema>;

export default function Aplication() {

const [isSend, setSendStatus] = useState<boolean>(false);
const { register, handleSubmit, reset, formState: { errors }} = useForm<EmailSendFormData>({
  resolver: zodResolver(formSchema),
  mode: "onChange",
  defaultValues: {
    userName: "",
    email: "",
    category: "",
    message: "",
  }
});

const onSubmit: SubmitHandler<EmailSendFormData> = async (data) => {
  setSendStatus(true);
  try {
    const formData = new FormData();
    formData.append('userName', data.userName);
    formData.append('email', data.email);
    formData.append('category', data.category);
    formData.append('problem-description', data.message);
  
    await sendAndSaveMessage(formData);
    
    reset({
      userName: "",
      email: "",
      category: "",
      message: "",
    });
  } catch (error) {
    console.error("Помилка відправки:", error);
  } finally {
    setSendStatus(false);
  }
}

  return (
    <Fragment>
      <section className="w-full h-auto bg-gray-900" id="applay">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full h-auto grid md:grid-cols-[30%_1fr] grid-cols-1 gap-y-5 p-10 justify-center mx-auto"
          id="aplication-form"
        >
          <h2
            className="md:col-span-2 text-center text-2xl font-bold uppercase mb-10 text-amber-50"
            id="form-header"
          >
            Залиште заявку на консультацію
          </h2>
          <label htmlFor="" className="text-left md:px-5 text-amber-50" id="name-form-label">
            Введіть своє ім'я:
          </label>
          <div className="w-full"><input
            type="text"
            className="border-2 w-full mb-2 border-amber-100 min-h-10 p-2 rounded-md bg-amber-50 text-gray-950"
            id="name-form-input"
            {...register("userName")}
          />
          {errors.userName && <p className="text-red-800">{errors.userName.message}</p>}</div>
          <label htmlFor="" className="text-left md:px-5 text-amber-50" id="email-form-label">
            Введіть пошту для зворотнього звязку:
          </label>
          <div className="w-full"><input
            type="text"
            className="border-2 w-full mb-2 border-amber-100 min-h-10 p-2 rounded-md bg-amber-50 text-gray-950"
            id="email-form-input"
            {...register("email")}
          />
          {errors.email && <p className="text-red-800">{errors.email.message}</p>}</div>
          <label htmlFor="" className="text-left md:px-5 text-amber-50" id="category-form-label">
            Виберіть тип проблеми:
          </label>
          <div className="w-full"><select
            id="category-form-select"
            className="border-2 w-full mb-2 border-amber-100 min-h-10 p-2 rounded-md bg-amber-50 text-gray-950"
            {...register("category")}
          >
            <option value="">-- Оберіть категорію --</option>
            <option value="Проблема з електронікою">Проблема з електронікою</option>
            <option value="Проблема з двигуном">Проблема з двигуном</option>
            <option value="Проблема з підвіскою">Проблема з підвіскою</option>
            <option value="Проблема з паливною системою">Проблема з паливною системою</option>
            <option value="Інше">Інше</option>
          </select>
          {errors.category && <p className="text-red-800">{errors.category.message}</p>}</div>
          <label htmlFor="" className="text-left block md:px-5 text-amber-50" id="textarea-form-label">
            Детально опишіть проблему:
          </label>
          <div className="w-full"><textarea
            id="ploblem-form-textarea"
            className="border-2 w-full mb-2 border-amber-100 min-h-50 p-2 rounded-md bg-amber-50 text-gray-950"
            {...register("message")}
          ></textarea>
          {errors.message && <p className="text-red-800">{errors.message.message}</p>}</div>
          <button
            type="submit"
            className="md:col-span-2 flex flex-nowrap justify-center items-center mx-auto bg-[#191970] h-12.5 p-3 rounded-2xl font-bold hover:bg-[#256590] hover:scale-[1.05] active:bg-[#252550] active:scale-[1.0] shadow-md shadow-[#252550] transition-colors duration-300 ease-in-out text-amber-50"
            disabled={isSend}
          >
            {isSend ? (
                  <>
                    <div className="w-5 h-5 mr-2 border-2 border-amber-100/30 border-t-amber-100 rounded-full animate-spin-slow"></div>
                    <span>Відправлення...</span>
                  </>
                ) : (
                  "Відправити заявку"
                )}
          </button>
        </form>
      </section>
    </Fragment>
  );
}
