"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // npm i lucide-react або замініть на svg

const items = [
  {
    id: 1,
    color: "bg-indigo-600",
    image:
      "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/service.jpg')",
    text: "Автомобільна електроніка не пробачає помилок. Тут важливі досвід, логіка й точна діагностика. Ми працюємо системно: спочатку причина, потім рішення. Без експериментів над вашим авто і без заміни деталей “про всяк випадок”.",
  },
  {
    id: 2,
    color: "bg-rose-600",
    image:
      "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/quality.jpg')",
    text: "Ми не заробляємо на страху клієнта. Перед початком робіт ви розумієте, що саме відбувається з автомобілем і чому це потрібно виправляти. Прозорий підхід, чесна комунікація й чіткий результат — наша норма.",
  },
  {
    id: 3,
    color: "bg-amber-600",
    image:
      "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/add_services.jpg')",
    text: "Окрім електроніки, виконуємо додаткові роботи з обслуговування автомобіля. Це зручно — ви вирішуєте кілька задач в одному місці та економите свій час.",
  },
];

// Формуємо масив [C, A, B, C, A]
const extendedItems = [items[items.length - 1], ...items, items[0]];

export default function FullInfiniteCarousel() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Логіка перемикання слайдів
  const move = useCallback(
    (direction: "prev" | "next") => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentIndex((prev) => (direction === "next" ? prev + 1 : prev - 1));
    },
    [isTransitioning],
  );

  // Автоплей
  const resetTimer = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => move("next"), 5000);
  }, [move]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [resetTimer]);

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (currentIndex === 0) {
      setCurrentIndex(items.length);
    } else if (currentIndex === extendedItems.length - 1) {
      setCurrentIndex(1);
    }
  };

  // Керування мишкою
  const onStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isTransitioning) return;
    setIsDragging(true);
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    startX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
  };

  const onMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setOffsetX(currentX - startX.current);
  };

  const onEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const width = containerRef.current?.offsetWidth || 0;
    setIsTransitioning(true);

    if (Math.abs(offsetX) > width * 0.25) {
      offsetX > 0 ? move("prev") : move("next");
    }
    setOffsetX(0);
    resetTimer();
  };

  // Поточний індекс для індикаторів (1-3)
  const activeDot = (currentIndex - 1 + items.length) % items.length;

  return (
    <div
      id="about_us"
      className="group relative w-full mx-auto overflow-hidden bg-black shadow-2xl"
    >
      {/* Слайдер */}
      <div
        ref={containerRef}
        className={`flex ${isTransitioning ? "transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1)" : ""}`}
        style={{
          transform: `translateX(calc(-${currentIndex * 100}% + ${offsetX}px))`,
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onMouseDown={onStart}
        onMouseMove={onMove}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
        onTouchStart={onStart}
        onTouchMove={onMove}
        onTouchEnd={onEnd}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedItems.map((item, idx) => {
          const isActive =
            idx === currentIndex ||
            (currentIndex === 0 && idx === items.length) ||
            (currentIndex === 4 && idx === 1);

          return (
            <div
              key={idx}
              className="min-w-full h-150 rounded-2xl flex items-center justify-center p-4 transition-opacity duration-1000 ease-in-out"
              style={{
                opacity: isActive ? 1 : 0.1,
                backgroundImage: item.image,
                backgroundSize: "100% 100%",
                backgroundPosition: "center",
              }}
            >
              <div
                className={`px-10 text-shadow-md text-shadow-black relative w-full h-full rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-2xl`}
              >
                {item.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Стрілки (з'являються при наведенні) */}
      <button
        onClick={() => move("prev")}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 text-white"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={() => move("next")}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 text-white"
      >
        <ChevronRight size={32} />
      </button>

      {/* Індикатори (Крапки) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 px-4 py-2 bg-black/20 backdrop-blur-md rounded-full">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (isTransitioning) return;
              setIsTransitioning(true);
              setCurrentIndex(i + 1);
              resetTimer();
            }}
            className={`h-3 rounded-full transition-all duration-300 ${
              activeDot === i
                ? "w-8 bg-white"
                : "w-3 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
