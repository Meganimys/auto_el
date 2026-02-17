'use server'

import { redirect } from "next/navigation";

export async function searchItems(formData: FormData) {
  const searchQuery = formData.get("search");
  if (searchQuery) {
    redirect(`/auto_shop/search?query=${encodeURIComponent(searchQuery.toString())}&page=1`);
  }
}