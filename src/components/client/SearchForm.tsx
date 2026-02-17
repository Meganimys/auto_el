"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PackageSearch } from "lucide-react";

export default function SearchForm({ initialQuery }: { initialQuery: string }) {
  const [searchItem, setSearchItem] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchItem.trim()) {
      // Перенаправляем на ту же страницу с новым query
      router.push(`/auto_shop/search?query=${encodeURIComponent(searchItem)}&page=1`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative flex items-center min-w-75">
      <div className="relative w-full">
        <input
          type="search"
          placeholder="Пошук..."
          className="p-2 border rounded w-full pr-10 focus:ring-2 focus:ring-blue-500 outline-none"
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
        />
        <PackageSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
      </div>
      <button
        type="submit"
        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Пошук
      </button>
    </form>
  );
}
