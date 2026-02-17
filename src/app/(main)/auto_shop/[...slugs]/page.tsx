"use client";

import { PackageSearch } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { use } from "react";
import { useRouter } from "next/navigation";

interface CategoryProps {
  params: Promise<{ slugs: string[] }>;
}

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
    uncategory: ["Амортизатори", "Пружини", "Рульове управління", "Підшипники"],
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

const unCategory = [];
export default function CategoryPage({ params }: CategoryProps) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const page = searchParams.get("page") || "1";
  const { slugs } = use(params);
  const router = useRouter();

  // Знаходимо основну категорію за ID
  const currentMainCategory = autoShopLinks.find(
    (link) => link.id === Number(id),
  );
  const subCatIndex = currentMainCategory?.uncategoryUrl.findIndex((url) =>
    url.includes(slugs[slugs.length - 1]),
  );

  const displayName =
    subCatIndex !== undefined && subCatIndex !== -1
      ? currentMainCategory?.uncategory[subCatIndex]
      : "Категорія";
    const searchItems = (FormData: FormData
    ) => {
      router.push(`/auto_shop/search?query=${FormData.get("search")}&page=1`);
    }
  return (
    <div className="py-8 relative">
      {/* Додаємо flex та justify-between, щоб рознести елементи по боках */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Хлібні крихти (Breadcrumbs) */}
        <h2 className="flex flex-wrap items-center gap-2">
          <Link className="hover:underline text-blue-600" href="/auto_shop">
            {`Категорії | ${currentMainCategory?.name || "Категорія"}`}
          </Link>
          {" > "}
          {slugs.map((slug, index) => {
  const isLast = index === slugs.length - 1;
  
  // 1. Визначаємо початкове ім'я (якщо slug це "search", то "Пошук", інакше сам slug)
  let displayName: string = slug;

  // 2. Шукаємо індекс у вашому масиві
  const subCatIndex = currentMainCategory?.uncategoryUrl.findIndex(
    (url) => url.includes(slug)
  );

  // 3. Якщо індекс знайдено, беремо назву з масиву uncategory. 
  // Додаємо "?? slug", щоб гарантувати тип string, якщо раптом у масиві буде undefined
  if (subCatIndex !== undefined && subCatIndex !== -1) {
    displayName = currentMainCategory?.uncategory[subCatIndex] ?? slug;
  }

  return isLast ? (
    <span key={index} className="text-gray-500">
      {displayName}
    </span>
  ) : (
    <span key={index} className="flex items-center gap-2">
      <Link
        className="hover:underline text-blue-600"
        href={`/auto_shop/${slug}?id=${id}`}
      >
        {displayName}
      </Link>
      {" > "}
    </span>
  );
})}

        </h2>

        {/* Форма: видалено absolute, додано відносне позиціонування для іконки */}
        <form action={searchItems} className="relative flex items-center min-w-75">
          <input
            type="search"
            name="search"
            placeholder="Пошук..."
            className="p-2 border rounded w-full pr-10 focus:text-green-700"
          />
          {/* Іконка тепер прикріплена до інпуту всередині флекс-контейнера */}
          <PackageSearch className="absolute right-25 top-1/2 -translate-y-1/2 text-gray-400" />
          <button
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            type="submit"
          >
            Пошук
          </button>
        </form>
      </div>

      {/* Заголовки нижче */}
      <h1 className="text-2xl font-bold mb-4 text-center mt-4 uppercase">
        {currentMainCategory?.name || "Категорія"}
      </h1>
      <h2 className="text-xl font-bold mb-4 text-center mt-4 uppercase">
        {displayName}
      </h2>

      <section id="shop_item_section">
        <p className="text-center text-gray-500">
          Тут буде список товарів для категорії: {displayName} {page}
        </p>
      </section>
    </div>
  );
}
