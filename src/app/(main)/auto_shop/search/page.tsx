import { Suspense } from "react";
import Link from "next/link";
import SearchForm from "@/components/client/SearchForm";
import SearchResultComponent from "@/components/server/SearchResultComponent";

// В Next.js 15 searchParams — это Promise
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const params = await searchParams;
  const query = params.query || "";

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Верхняя панель: Хлебные крошки и Форма */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <nav className="text-sm">
          <Link href="/auto_shop" className="text-blue-500 hover:underline">
            Повернутися до категорій
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">Результати пошуку</span>
        </nav>

        <SearchForm initialQuery={query} />
      </div>

      {/* Заголовок результатов */}
      <h1 className="text-2xl font-bold mb-6">
        {query ? (
          <>Результати пошуку: <span className="text-blue-600">"{query}"</span></>
        ) : (
          "Введіть запит для пошуку"
        )}
      </h1>

      {/* Сетка с результатами */}
      <Suspense key={query} fallback={<div className="py-10 text-center">Завантаження товарів...</div>}>
        {query ? (
          <SearchResultComponent query={query} />
        ) : (
          <p className="text-gray-500">Тут з'являться результати вашого пошуку.</p>
        )}
      </Suspense>
    </div>
  );
}
