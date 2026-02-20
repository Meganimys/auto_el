'use server';

import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { prisma } from "../lib/prisma";

export async function saveProductToDatabase(formData: FormData) {
    const item_name = formData.get("item_name") as string;
    const item_price = parseFloat(formData.get("item_price") as string);
    const item_category = formData.get("item_category") as string;
    const item_type = formData.get("item_type") as string;
    const item_description = formData.get("item_description") as string;
    const item_gallery = formData.getAll("item_gallery") as File[];

    const result = await handleImageUpload(item_gallery);

    if (result.success && result.urls) {
        try {
            // ВОТ ЗДЕСЬ МЫ ИСПОЛЬЗУЕМ PRISMA:
            const newProduct = await prisma.product.create({
                data: {
                    name: item_name,
                    price: item_price,
                    category: item_category || "Без категорії",
                    productType: item_type || "Без типу",
                    description: item_description,
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
    const uploadDir = path.join(process.cwd(), 'public', 'img', 'product-img');

    try {
        // Створюємо папку, якщо вона ще не існує
        await mkdir(uploadDir, { recursive: true });

        for (const file of item_gallery) {
            // Ваші перевірки
            if (file.size > 0 && file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024) {
                
                // Генеруємо унікальне ім'я, щоб уникнути замін файлів
                const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
                const filePath = path.join(uploadDir, fileName);

                // Запис файлу
                const buffer = Buffer.from(await file.arrayBuffer());
                await writeFile(filePath, buffer);

                // Формуємо шлях для бази даних (без public, бо браузер бачить public як корінь /)
                const dbPath = `/img/product-img/${fileName}`;
                imageUrls.push(dbPath);
                
                console.log("Файл збережено за адресою:", dbPath);
            }
        }

        // Тут ваш код збереження масиву imageUrls в БД
        // await db.items.create({ data: { images: imageUrls, ... } });

        return { success: true, urls: imageUrls };
    } catch (error) {
        console.error("Помилка збереження:", error);
        return { success: false, error: "Не вдалося зберегти зображення" };
    }
}