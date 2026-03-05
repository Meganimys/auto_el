"use client";
import { Fragment } from "react/jsx-runtime";

export default function Aplication() {
  return (
    <Fragment>
      <section className="w-full h-auto bg-gray-900" id="applay">
        <form
          action=""
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
          <input
            type="text"
            className="border-2 border-amber-100 min-h-10 p-2 rounded-md bg-amber-50 text-gray-950"
            id="name-form-input"
            name="name"
            minLength={3}
            required
          />
          <label htmlFor="" className="text-left md:px-5 text-amber-50" id="email-form-label">
            Введіть пошту для зворотнього звязку:
          </label>
          <input
            type="text"
            className="border-2 border-amber-100 min-h-10 p-2 rounded-md bg-amber-50 text-gray-950"
            id="email-form-input"
            name="email"
            minLength={3}
            required
          />
          <label htmlFor="" className="text-left md:px-5 text-amber-50" id="category-form-label">
            Виберіть тип проблеми:
          </label>
          <select
            id="category-form-select"
            className="border-2 border-amber-100 min-h-10 p-2 rounded-md bg-amber-50 text-gray-950"
            name="category"
            required
          >
            <option value="Проблема з електронікою">Проблема з електронікою</option>
            <option value="Проблема з двигуном">Проблема з двигуном</option>
            <option value="Проблема з підвіскою">Проблема з підвіскою</option>
            <option value="Проблема з паливною системою">Проблема з паливною системою</option>
            <option value="Інше">Інше</option>
          </select>
          <label htmlFor="" className="text-left block md:px-5 text-amber-50" id="textarea-form-label">
            Детально опишіть проблему:
          </label>
          <textarea
            id="ploblem-form-textarea"
            className="border-2 border-amber-100 min-h-50 p-2 rounded-md bg-amber-50 text-gray-950"
            name="problem-description"
            maxLength={10}
            required
          ></textarea>
          <button
            type="submit"
            className="md:col-span-2 block mx-auto bg-[#191970] h-12.5 p-3 rounded-2xl font-bold hover:bg-[#256590] hover:scale-[1.05] active:bg-[#252550] active:scale-[1.0] shadow-md shadow-[#252550] transition-colors duration-300 ease-in-out text-amber-50"
          >
            Відправити заявку
          </button>
        </form>
      </section>
    </Fragment>
  );
}
