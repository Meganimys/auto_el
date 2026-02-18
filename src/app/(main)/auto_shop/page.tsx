'use client';

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function AutoShop() {

  const [visibleId, setVisibleId] = useState<number|null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const isAdmin = true; // Змінна для перевірки прав адміністратора

  const handleMouseEnter = (id: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisibleId(id);
  };

const handleMouseLeave = () => {
  // Устанавливаем задержку в 200мс перед закрытием
  timeoutRef.current = setTimeout(() => {
    setVisibleId(null);
  }, 200);
};

  const autoShopLinks: {
    id: number;
    name: string;
    uncategory: string[];
    uncategoryUrl: string[];
  }[] = [
    {
      id: 1,
      name: "Запчастини для ТО",
      uncategory: ["Фільтри", "Гальмівна система", "Запалювання", "Привід"],
      uncategoryUrl: [
        "auto_shop/filters",
        "auto_shop/brakes",
        "auto_shop/ignition",
        "auto_shop/drive",
      ],
    },
    {
      id: 2,
      name: "Масла та технічні рідини",
      uncategory: [
        "Моторні масла",
        "Трансмісійні масла",
        "Охолоджуючі рідини",
        "Гальмівні рідини",
        "Омивачі",
      ],
      uncategoryUrl: [
        "auto_shop/engine_oils",
        "auto_shop/transmission_oils",
        "auto_shop/coolants",
        "auto_shop/brake_fluids",
        "auto_shop/wipers",
      ],
    },
    {
      id: 3,
      name: "Автохімія та косметика",
      uncategory: [
        "Догляд за кузовом",
        "Догляд за салоном",
        "Засоби для миття",
        "Полірування та захист",
      ],
      uncategoryUrl: [
        "auto_shop/body_care",
        "auto_shop/interior_care",
        "auto_shop/washing_products",
        "auto_shop/polishing_protection",
      ],
    },
    {
      id: 4,
      name: "Аксесуари та інструмент",
      uncategory: [
        "Автоаксесуари",
        "Інструменти та обладнання",
        "Аварійний набір",
      ],
      uncategoryUrl: [
        "auto_shop/accessories",
        "auto_shop/tools_equipment",
        "auto_shop/emergency_kit",
      ],
    },
    {
      id: 5,
      name: "Ходова частина та підвіскаа",
      uncategory: [
        "Амортизатори",
        "Пружини",
        "Рульове управління",
        "Підшипники",
      ],
      uncategoryUrl: [
        "auto_shop/shock_absorbers",
        "auto_shop/springs",
        "auto_shop/steering",
        "auto_shop/bearings",
      ],
    },
    {
      id: 6,
      name: "Сезонні товари",
      uncategory: ["Зимові товари", "Літні товари", "Універсальні товари"],
      uncategoryUrl: [
        "auto_shop/winter_products",
        "auto_shop/summer_products",
        "auto_shop/universal_products",
      ],
    },
    {
      id: 7,
      name: "Акумулятори та електрика",
      uncategory: [
        "Акумулятори",
        "Свічки запалювання",
        "Генератори та стартери",
        "Електричні компоненти",
      ],
      uncategoryUrl: [
        "auto_shop/batteries",
        "auto_shop/spark_plugs",
        "auto_shop/generators_starters",
        "auto_shop/electrical_components",
      ],
    },
  ];

  const toggleVisibility = (id: number) => {
    setVisibleId(visibleId === id ? null : id);
  }

  return (
    <div className="p-4 py-20">
      <h1 className="text-center w-full mb-20 text-2xl font-bold uppercase">
        Auto Shop
      </h1>
      {
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {autoShopLinks.map((link) => (
    /* 1. Картка має relative і фіксовану висоту h-fit або конкретну h-14 */
    <li key={link.id} className="relative border rounded p-2 h-14 flex items-center justify-center cursor-pointer"
    onMouseEnter={() => handleMouseEnter(link.id)}
    onMouseLeave={handleMouseLeave}
    >
      
      <div 
        className="text-blue-500 hover:underline w-full text-center"
        onClick={() => toggleVisibility(link.id)}
      >
        {link.name}
      </div>

      {/* 2. СПИСОК: ставимо absolute, щоб він випав з контексту картки */}
      {visibleId === link.id && (
        <ul 
          className="absolute -left-px top-full z-50 w-[calc(100%+2px)] bg-black border border-white rounded-b p-2"
          /* top-full ставить список рівно під нижню межу картки */
          /* left-[-1px] та w-[calc(100%+2px)] компенсують товщину рамки */
          onMouseEnter={() => handleMouseEnter(link.id)} // Отменяем закрытие при входе в список
          onMouseLeave={handleMouseLeave}
        >
          {link.uncategory.map((subLink, index) => (
            <li key={subLink} className="mb-1 last:mb-0">
              <Link
                href={`/${link.uncategoryUrl[index]}?id=${link.id}&page=1`} // Передаем id категории для динамического роутинга
                className="text-gray-400 hover:text-white text-sm block"
              >
                {subLink}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  ))}
</ul>

      }
      {isAdmin && <button className="bg-red-500 block mx-auto my-20 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors" onClick={() => {router.push('/control/add_item')}} type="button">Додати товар</button>}
    </div>
  );
}
