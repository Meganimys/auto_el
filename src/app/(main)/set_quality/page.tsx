"use client";

import { Fragment } from "react/jsx-runtime";
import { ChevronDown } from "lucide-react";

export default function QualityApp() {
  return (
    <Fragment>
      <form
        className="grid gap-y-5 grid-cols-1 items-start py-20 px-5 bg-gray-900"
        style={{ borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}
      >
        <h2 className="text-center text-2xl font-bold uppercase">
          Заповніть форму для відгуку
        </h2>
        <label htmlFor="" className="">
          Введіть своє ім'я:
        </label>
        <input
          name="name"
          type="text"
          className="border h-10 border-gray-300 rounded-xl p-2 w-full bg-amber-50 text-gray-950"
          minLength={3}
          required
        />
        <label htmlFor="" className="">
          Опишіть свої враження від обслуговування:
        </label>
        <textarea
          name="description"
          id=""
          cols={30}
          rows={10}
          className="border border-gray-300 rounded-xl p-2 w-full bg-amber-50 text-gray-950"
          minLength={10}
          required
        ></textarea>
        <label htmlFor="" className="">
          Виберіть категорію послуги:
        </label>
        <div className="relative max-w-100">
          <select
            name="category"
            id=""
            className="appearance-none w-full border border-gray-300 rounded-xl p-2 bg-amber-50 text-gray-950"
            style={{
              WebkitAppearance: "none",
              MozAppearance: "none",
            }}
          >
            <option value="Автоелектроніка">Автоелектроніка</option>
            <option value="Автомобільний ключ">Автомобільний ключ</option>
            <option value="Монтаж аксесуарів">Монтаж аксесуарів</option>
            <option value="Ремонт двигуна">Ремонт двигуна</option>
            <option value="Ремонт трансмісії">Ремонт трансмісії</option>
            <option value="Ремонт підвіски">Ремонт підвіски</option>
            <option value="Ремонт паливної системи">Ремонт паливної системи</option>
            <option value="Ремонт електроприводу">Ремонт електроприводу</option>
            <option value="Комп'ютерна діагностика">Комп'ютерна діагностика</option>
            <option value="Інше">Інше</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <ChevronDown size={20} className="text-gray-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 py-10">
          <section className="grid grid-cols-[1fr_10%] gap-x-5 items-center gap-y-2">
            <h3 className="col-span-2 text-green-300">Плюси:</h3>
            <label
              htmlFor="service_quality"
              className="cursor-pointer hover:text-green-500"
            >
              Якість обслуговування
            </label>
            <input
              name="plus"
              type="checkbox"
              value={"Якість обслуговування"}
              className="cursor-pointer"
              id="service_quality"
            />
            <label
              htmlFor="speed_service"
              className="cursor-pointer hover:text-green-500"
            >
              Швидкість обслуговування
            </label>
            <input
              name="plus"
              type="checkbox"
              value={"Швидкість обслуговування"}
              className="cursor-pointer"
              id="speed_service"
            />
            <label
              htmlFor="cleanliness"
              className="cursor-pointer hover:text-green-500"
            >
              Чистота та порядок
            </label>
            <input
              name="plus"
              type="checkbox"
              id="cleanliness"
              value={"Чистота та порядок"}
              className="cursor-pointer"
            />
            <label
              htmlFor="consultation"
              className="cursor-pointer hover:text-green-500"
            >
              Консультація
            </label>
            <input
              name="plus"
              type="checkbox"
              id="consultation"
              value={"Консультація"}
              className="cursor-pointer"
            />
            <label
              htmlFor="responsibility"
              className="cursor-pointer hover:text-green-500"
            >
              Відповідальність
            </label>
            <input
              name="plus"
              type="checkbox"
              id="responsibility"
              value={"Відповідальність"}
              className="cursor-pointer"
            />
            <label
              htmlFor="price"
              className="cursor-pointer hover:text-green-500"
            >
              Ціна
            </label>
            <input
              name="plus"
              type="checkbox"
              id="price"
              value={"Ціна"}
              className="cursor-pointer"
            />
          </section>
          <section className="grid grid-cols-[1fr_10%] gap-x-5 items-center gap-y-2">
            <h3 className="col-span-2 text-red-500">Мінуси:</h3>
            <label
              htmlFor="low_quality_service"
              className="cursor-pointer hover:text-red-700"
            >
              Низька якість обслуговування
            </label>
            <input
              name="minus"
              type="checkbox"
              id="low_quality_service"
              value={"Низька якість обслуговування"}
              className="cursor-pointer"
            />
            <label
              htmlFor="lack_of_services"
              className="cursor-pointer hover:text-red-700"
            >
              Недоступність певних послуг
            </label>
            <input
              name="minus"
              type="checkbox"
              id="lack_of_services"
              value={"Недоступність певних послуг"}
              className="cursor-pointer"
            />
            <label
              htmlFor="incompetence"
              className="cursor-pointer hover:text-red-700"
            >
              Некомпетентність
            </label>
            <input
              name="minus"
              type="checkbox"
              id="incompetence"
              value={"Некомпетентність"}
              className="cursor-pointer"
            />
            <label
              htmlFor="price_issue"
              className="cursor-pointer hover:text-red-700"
            >
              Ціна
            </label>
            <input
              name="minus"
              type="checkbox"
              id="price_issue"
              value={"Ціна"}
              className="cursor-pointer"
            />
            <label
              htmlFor="slow_service"
              className="cursor-pointer hover:text-red-700"
            >
              Повільність обслуговування
            </label>
            <input
              name="minus"
              type="checkbox"
              id="slow_service"
              value={"Повільність обслуговування"}
              className="cursor-pointer"
            />
            <label
              htmlFor="equipment_unavailability"
              className="cursor-pointer hover:text-red-700"
            >
              Недоступність обладнання
            </label>
            <input
              name="minus"
              type="checkbox"
              id="equipment_unavailability"
              value={"Недоступність обладнання"}
              className="cursor-pointer"
            />
          </section>
        </div>
        <button
          type="submit"
          className="cursor-pointer max-w-50 mx-auto bg-[#191970] h-12.5 p-3 rounded-2xl font-bold hover:bg-[#256590] hover:scale-[1.05] active:bg-[#252550] active:scale-[1.0] shadow-md shadow-[#252550] transition-colors duration-300 ease-in-out"
        >
          Відправити відгук
        </button>
      </form>
    </Fragment>
  );
}
