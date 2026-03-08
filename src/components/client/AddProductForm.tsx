"use client";

import { ImagePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactQuillDescriptionInput from "./ReactQuillDescriptionInput";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { saveProductToDatabase } from "../server/lib/prismaManager";
import { getProductTypes } from "../server/lib/prismaManager";

/* ================= SCHEMA ================= */

const AddProductSchema = z.object({
  item_name: z
    .string()
    .min(10, "Назва мінімум 10 символів")
    .regex(/^[a-zA-Zа-яА-ЯіїєґІЇЄҐ0-9\s]+$/, "Тільки букви, цифри та пробіли"),

  item_price: z
    .number()
    .min(0.01, { message: "Мінімальна ціна 0.01" })
    .positive("Ціна повинна бути позитивною"),

  item_category: z.string().min(1, "Оберіть категорію"),
  item_type: z.string().min(1, "Оберіть тип"),

  item_description: z.string().min(100, "Опис мінімум 100 символів"),

  // 🔥 БЕЗ SSR ПРОБЛЕМИ
  item_gallery: z
    .array(z.instanceof(File))
    .min(1, "Мінімум 1 зображення")
    .max(5, "Максимум 5 зображень")
    .refine(
      (files) => files.every((f) => f.type.startsWith("image/")),
      "Тільки зображення",
    )
    .refine(
      (files) => files.every((f) => f.size <= 5 * 1024 * 1024),
      "Максимум 5MB",
    ),
  item_manufacturer: z.string().optional(),
  item_model: z.string().optional(),
  item_year: z.string().optional(),
});

type AddProductFormData = z.infer<typeof AddProductSchema>;

interface Category {
  id: number;
  name: string;
}

interface Props {
  categories: Category[];
}

export default function AddProductForm({ categories }: Props) {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<number | null>(null);
  const [productTypes, setProductTypes] = useState<
    { name: string; id: number }[] | null
  >(null);

  useEffect(() => {
    // Не робимо запит, якщо категорія не обрана
    if (currentCategory === null) {
      setProductTypes(null);
      return;
    }

    const getTypes = async () => {
      try {
        const data = await getProductTypes(currentCategory);
        setProductTypes(data);
      } catch (error) {
        console.error("Помилка завантаження типів:", error);
      }
    };

    getTypes();
  }, [currentCategory]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    reset,
  } = useForm<AddProductFormData>({
    resolver: zodResolver(AddProductSchema),
    mode: "onChange",
    defaultValues: {
      item_name: "",
      item_price: 0,
      item_category: "",
      item_type: "",
      item_description: "",
      item_gallery: [],
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ========= IMAGE HANDLING ========= */

  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    imgUrls.forEach((url) => URL.revokeObjectURL(url));

    const fileArray = Array.from(files).slice(0, 5);

    // Оновлюємо прев'ю
    imgUrls.forEach((url) => URL.revokeObjectURL(url));
    const urls = fileArray.map((file) => URL.createObjectURL(file));

    setImgUrls(urls);

    // ЗАПИСУЄМО МАСИВ У ФОРМУ
    setValue("item_gallery", fileArray, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    // Примусово перевіряємо
    trigger("item_gallery");
  };

  /* ========= SUBMIT ========= */

  const onSubmit: SubmitHandler<AddProductFormData> = async (data) => {
    const formData = new FormData();

    formData.append("item_name", data.item_name);
    formData.append("item_price", data.item_price.toString());
    formData.append("item_category", data.item_category);
    formData.append("item_type", data.item_type);
    formData.append("item_description", data.item_description);
    formData.append("item_manufacturer", data.item_manufacturer || "");
    formData.append("item_model", data.item_model || "");
    formData.append("item_year", data.item_year || "");

    Array.from(data.item_gallery as FileList | File[]).forEach((file) => {
      formData.append("item_gallery", file as File); // Додаємо 'as File'
    });
    await saveProductToDatabase(formData);

    reset();
    setImgUrls([]);
    setDescription("");
  };

  const { ref: galleryRef, ...galleryRest } = register("item_gallery");
  console.log("Помилки форми:", errors);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 mt-6"
    >
      {/* NAME */}
      <input
        {...register("item_name")}
        placeholder="Назва"
        className="border p-2 min-w-full placeholder-amber-50 rounded border-amber-50 text-amber-50"
      />
      {errors.item_name && (
        <p className="text-red-500">{errors.item_name.message}</p>
      )}

      {/* PRICE */}
      <input
        type="number"
        step="0.01"
        {...register("item_price", {
          valueAsNumber: true,
        })}
        className="border p-2 w-full rounded border-amber-50 text-amber-50"
      />
      {errors.item_price && (
        <p className="text-red-500">{errors.item_price.message}</p>
      )}

      {/* CATEGORY */}
      <select
        {...register("item_category")}
        className="border p-2 w-full rounded border-amber-50 text-amber-50"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          const value = e.target.value;
          // Якщо вибрано порожній рядок (пункт "Оберіть"), ставимо null
          const categoryId = value === "" ? null : Number(value);
          setCurrentCategory(categoryId);
        }}
      >
        <option value="">Оберіть</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      {errors.item_category && (
        <p className="text-red-500">{errors.item_category.message}</p>
      )}

      {/* TYPE */}
      {productTypes && (
        <select
          {...register("item_type")}
          className="border p-2 w-full rounded border-amber-50 text-amber-50"
        >
          <option value="">Оберіть</option>
          {productTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      )}
      {errors.item_type && (
        <p className="text-red-500">{errors.item_type.message}</p>
      )}

      <input
        type="text"
        className="border p-2 w-full rounded border-amber-50 text-amber-50 placeholder-amber-50"
        {...register("item_manufacturer")}
        placeholder="Виробник"
      />
      <input
        type="text"
        className="border p-2 w-full rounded border-amber-50 text-amber-50 placeholder-amber-50"
        {...register("item_model")}
        placeholder="Модель"
      />
      <input
        type="text"
        className="border p-2 w-full rounded border-amber-50 text-amber-50 placeholder-amber-50"
        {...register("item_year")}
        placeholder="Рік випуску"
      />
      {/* DESCRIPTION */}
      {mounted && (
        <ReactQuillDescriptionInput
          value={description}
          onChange={(value) => {
            setDescription(value);
            setValue("item_description", value, {
              shouldValidate: true,
            });
          }}
        />
      )}
      {errors.item_description && (
        <p className="text-red-500">{errors.item_description.message}</p>
      )}

      {/* IMAGE */}
      <label
        htmlFor="item_gallery"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (!imageInputRef.current) return;

          imageInputRef.current.files = e.dataTransfer.files;

          processFiles(e.dataTransfer.files);
        }}
        className={`border h-50 p-6 grid place-items-center cursor-pointer rounded border-amber-50 text-amber-50 ${
          isDragging
            ? "border-green-500 shadow-md shadow-green-700 text-green-500"
            : ""
        }`}
      >
        Перетягніть або натисніть
        <ImagePlus className="mx-auto mt-2" />
      </label>

      <input
        type="file"
        className="hidden"
        multiple
        accept="image/*"
        {...galleryRest}
        ref={(e) => {
          galleryRef(e);
          imageInputRef.current = e;
        }}
        onChange={(e) => processFiles(e.target.files)}
        id="item_gallery"
      />

      {errors.item_gallery && (
        <p className="text-red-500">{errors.item_gallery.message as string}</p>
      )}

      {/* PREVIEW */}
      <div className="flex gap-2 mt-4 flex-wrap rounded">
        {imgUrls.map((url, i) => (
          <img
            key={i}
            src={url}
            className="w-32 h-32 object-fit border rounded"
          />
        ))}
      </div>

      <button
        type="submit"
        className="bg-red-600 text-white px-4 py-2 mt-6 cursor-pointer hover:bg-red-700 transition min-w-1/3 max-w-1/2 mx-auto rounded"
      >
        Додати товар
      </button>
    </form>
  );
}
