import { redirect } from "next/navigation";
import AddProductForm from "@/components/client/AddProductForm";


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
        <AddProductForm categories={categories} itemTypes={itemTypes} />
      </div>
    );
  } else {
    redirect("/"); // Redirect to home page if not admin
  }
}
