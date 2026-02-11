'use client'
import { Fragment } from "react/jsx-runtime";

export default function Aplication() {
  return (
    <Fragment>
      <section className="w-full h-auto" id="apllication">
        <form action="" className="w-full h-auto grid grid-cols-[30%_1fr] gap-y-5 p-10 justify-center mx-auto" id="aplication-form">
          <h2 className="col-span-2 text-center" id="form-header">Залиште заявку на консультацію</h2>
          <label htmlFor="" className="text-left px-5 m" id="name-form-label">Введіть своє ім'я:</label>
          <input type="text" className="border-2 border-amber-100 min-h-10" id="name-form-input" />
          <label htmlFor="" className="text-left px-5" id="email-form-label">Введіть пошту для зворотнього звязку:</label>
          <input type="text" className="border-2 border-amber-100 min-h-10" id="email-form-input" />
          <label htmlFor="" className="text-left px-5" id="category-form-label">Виберіть тип проблеми:</label>
          <select name="" id="category-form-select" className="border-2 border-amber-100 min-h-10"></select>
          <label htmlFor="" className="text-left px-5" id="textarea-form-label">Детально опишіть проблему:</label>
          <textarea name="" id="ploblem-form-textarea" className="border-2 border-amber-100 min-h-50"></textarea>
          <button type="submit" className="col-span-2 mx-auto">Відправити заявку</button>
        </form>
      </section>
    </Fragment>
  );
}
