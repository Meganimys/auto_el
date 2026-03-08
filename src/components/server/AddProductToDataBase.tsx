'use server';

import { redirect } from "next/navigation";
import AddProductForm from "@/components/client/AddProductForm";
import { getProductCategories } from "../server/lib/prismaManager";


export default async function AddProductToDataBase() {
  const isAdmin = true; // Replace with actual admin check logic
  const categories = await getProductCategories();
  if (isAdmin) {
    return (
      <div className="min-w-full flex flex-col justify-center py-20 px-5 bg-gray-950 rounded-t-xl">
        <h1 className="text-2xl font-bold uppercase text-center text-red-600">
          Додати товар
        </h1>
        {/* Add your form or content for adding an item here */}
        <AddProductForm categories={categories} />
      </div>
    );
  } else {
    redirect("/"); // Redirect to home page if not admin
  }
}