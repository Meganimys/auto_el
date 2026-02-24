'use server';

import { put } from '@vercel/blob'
import { prisma } from "../lib/prisma";

export async function saveProductToDatabase(formData: FormData) {
    const item_name = formData.get("item_name") as string;
    const item_price = parseFloat(formData.get("item_price") as string);
    const item_category = parseInt(formData.get("item_category") as string);
    const item_type = parseInt(formData.get("item_type") as string);
    const item_description = formData.get("item_description") as string;
    const item_gallery = formData.getAll("item_gallery") as File[];
    const item_manufacturer = formData.get("item_manufacturer") as string;
    const item_model = formData.get("item_model") as string;
    const item_year = formData.get("item_year") as string;

    const result = await handleImageUpload(item_gallery);

    if (result.success && result.urls) {
        try {
            // ВОТ ЗДЕСЬ МЫ ИСПОЛЬЗУЕМ PRISMA:
            const newProduct = await prisma.product.create({
                data: {
                    name: item_name,
                    price: item_price,
                    description: item_description,
                    manufacturer: item_manufacturer,
                    model: item_model,
                    createYear: item_year,
                    category: {
                        connect: { id: item_category }
                    },
                    productType: {
                        connect: { id: item_type }
                    },
                    images: {
                        create: result.urls.map(url => ({ url }))
                    }
                }
            });

            console.log("Успешно сохранено в БД:", newProduct);
            return { success: true, product: newProduct };

        } catch (dbError) {
            console.error("Ошибка БД:", dbError);
            return { success: false, error: "Ошибка при записи в базу" };
        }
    } else {
        return { success: false, error: result.error || "Ошибка при загрузке изображений" };
    }
}

export async function handleImageUpload(item_gallery: File[]) {
    const imageUrls: string[] = [];

    try {

        for (const file of item_gallery) {
            // Ваші перевірки
            if (file.size > 0 && file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024) {
                
                const blob = await put(`product-img/${file.name}`, file, {
                    access: 'public',
                    addRandomSuffix: true,
                    contentType: file.type,
                });

                imageUrls.push(blob.url);

                console.log("Файл збережено за адресою:", blob.url);
            }
        }

        return { success: true, urls: imageUrls };
    } catch (error) {
        console.error("Помилка збереження:", error);
        return { success: false, error: "Не вдалося зберегти зображення" };
    }
}

export async function saveUserToDatabase(formData: FormData) {
    const login = formData.get("login") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const passwordRepeat = formData.get("passwordRepeat") as string;

   /*  if (password !== passwordRepeat) {
        return { success: false, error: "Пароли не совпадают" };
    } else {
        try {
            const newUser = await prisma.user.create({
                data: {
                    login,
                    email,
                    password, // В реальной жизни нужно хешировать пароль!
                }
            });
            return { success: true, user: newUser };
        } catch (dbError) {
            console.error("Ошибка БД:", dbError);
            return { success: false, error: "Ошибка при записи в базу" };
        }
    }*/
    }