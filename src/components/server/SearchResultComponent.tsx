export default async function SearchResultComponent({ query }: { query: string }) {
  // Тут буде ваша логіка запиту до бази даних
  // const products = await db.product.findMany({ where: { name: { contains: query } } });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Рендеринг карток товарів */}
      <p className="text-gray-500">Товарів за запитом "{query}" не знайдено (приклад).</p>
    </div>
  );
}
