'use server';

import { put } from '@vercel/blob'
import { prisma } from "../lib/prisma";
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

export async function saveProductToDatabase(formData: FormData) {

    const { window } = new JSDOM('');
    const purify = DOMPurify(window);

    const item_name = formData.get("item_name") as string;
    const item_price = parseFloat(formData.get("item_price") as string);
    const item_category = parseInt(formData.get("item_category") as string);
    const item_type = parseInt(formData.get("item_type") as string);
    const raw_description = formData.get("item_description") as string;
    const item_gallery = formData.getAll("item_gallery") as File[];
    const item_manufacturer = formData.get("item_manufacturer") as string;
    const item_model = formData.get("item_model") as string;
    const item_year = formData.get("item_year") as string;

    const safeInput = raw_description.replace(/[\x00-\x1F\x7F-\x9F]/g, "");

    const item_description = purify.sanitize(safeInput, {
  ALLOWED_TAGS: ['h1', 'h2', 'h3', 'p', 'br', 'b', 'i', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'span'],
  ALLOWED_ATTR: ['href', 'target', 'class'],
  FORBID_TAGS: ['img', 'style', 'script', 'iframe'],
  // STRIP_OUT_CONTROL_CHARS видалено, оскільки він не підтримується типами
});

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
    const id = formData.get("id") as string; // ID від Clerk
    const login = formData.get("login") as string;
    const email = formData.get("email") as string;

        try {
            const newUser = await prisma.user.create({
                data: {
                    id, // Сохраняем ID от Clerk
                    login,
                    email,
                }
            });
            return { success: true, user: newUser };
        } catch (dbError) {
            console.error("Ошибка БД:", dbError);
            return { success: false, error: "Ошибка при записи в базу" };
        }
    }

    export async function getProductTypes(category: number) {
        const types = await prisma.productType.findMany({
            where: {
                categoryId: category,
            },
            select: {
                id: true,
                name: true,
            },
        });

        return types;
    }

    export async function getProductCategories() {
        const categories = await prisma.productCategory.findMany({
            select: {
                id: true,
                name: true,
            }
        });

        return categories;
    }