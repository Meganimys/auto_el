'use server';

import { redirect } from "next/navigation";
import AddProductForm from "@/components/client/AddProductForm";
import { prisma } from './lib/prisma';


export default async function AddProductToDataBase() {
  const isAdmin = true; // Replace with actual admin check logic
  const categories = await prisma.productCategory.findMany({
    orderBy: { name: 'asc' }
  });
    const itemTypes = await prisma.productType.findMany({
    orderBy: { name: 'asc' }
  });
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