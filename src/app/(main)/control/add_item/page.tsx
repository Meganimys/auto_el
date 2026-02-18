import { redirect } from "next/navigation";

export default function AddItemPage() {
  const isAdmin = true; // Replace with actual admin check logic
  const categories: string[] = [
    "Запчастини для ТО",
    "Масла та технічні рідини",
    "Автохімія та косметика",
    "Аксесуари та інструмент",
    "Ходова частина та підвіскаа",
    "Сезонні товари",
    "Акумулятори та електрика",
  ]; // Replace with actual categories data

  const itemTypes: string[] = [
    "Фільтри",
    "Гальмівна система",
    "Запалювання",
    "Привід",
    "Моторні масла",
    "Трансмісійні масла",
    "Охолоджуючі рідини",
    "Гальмівні рідини",
    "Омивачі",
    "Догляд за кузовом",
    "Догляд за салоном",
    "Засоби для миття",
    "Полірування та захист",
    "Автоаксесуари",
    "Інструменти та обладнання",
    "Аварійний набір",
    "Амортизатори",
    "Пружини",
    "Рульове управління",
    "Підшипники",
    "Зимові товари",
    "Літні товари",
    "Універсальні товари",
    "Акумулятори",
    "Свічки запалювання",
    "Генератори та стартери",
    "Електричні компоненти",
  ]; // Replace with actual item types data

  if (isAdmin) {
    return (
      <div className="min-w-full flex flex-col justify-center py-20 px-5">
        <h1 className="text-2xl font-bold uppercase text-center text-red-600">
          Додати товар
        </h1>
        {/* Add your form or content for adding an item here */}
        <form action="" className="">
          <label htmlFor="item_name" className="block mb-2">
            Назва товару
          </label>
          <input
            id="item_name"
            name="item_name"
            type="text"
            className="border border-gray-300 rounded p-2 w-full"
          />
          <label htmlFor="item_price" className="block mb-2">
            Ціна
          </label>
          <input
            id="item_price"
            name="item_price"
            type="number"
            className="border border-gray-300 rounded p-2 w-full"
          />
          <label htmlFor="item_category" className="block mb-2">
            Категорія товару
          </label>
          <select
            id="item_category"
            name="item_category"
            className="border border-gray-300 rounded p-2 w-full"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <label htmlFor="item_type" className="block mb-2">
            Тип товару
          </label>
          <select
            id="item_type"
            name="item_type"
            className="border border-gray-300 rounded p-2 w-full"
          >
            {itemTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <label htmlFor="item_description" className="block mb-2">
            Опис товару
          </label>
          <textarea
            id="item_description"
            name="item_description"
            className="border border-gray-300 rounded p-2 w-full"
          ></textarea>
          <label htmlFor="item_image" className="block mb-2">
            Зображення товару
          </label>
          <input
            id="item_image"
            name="item_image"
            type="file"
            className="border border-gray-300 rounded p-2 w-full"
          />
          <label htmlFor="item_gallery" className="block mb-2">
            Галерея зображень
          </label>
          <input
            id="item_gallery"
            name="item_gallery"
            type="file"
            className="border border-gray-300 rounded p-2 w-full"
            multiple
          />
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded mt-4"
          >
            Додати товар
          </button>
        </form>
      </div>
    );
  } else {
    redirect("/"); // Redirect to home page if not admin
  }
}
