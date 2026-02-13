"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";

export default function Footer() {
  const [currentData, setCurrentData] = useState<Date | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setCurrentData(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Fragment>
      <footer className="bg-neutral-900 rounded-b-xl mb-25" id="footer">
        <section
          className="grid grid-cols-2 items-center bg-gray-950"
          id="adress"
        >
          <address
            className="max-w-50 mx-auto font-bold italic underline"
            id="footer-adress"
          >
            <p className="">Рівненська область</p>
            <p className="">Сарненський р-н</p>
            <p className="">с.Сварицевичі</p>
            <p className="">вул.Шевченка</p>
            <p className="">34120</p>
          </address>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d5832.2896867497375!2d26.264932159358217!3d51.70540052738774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1suk!2sua!4v1770840305032!5m2!1suk!2sua"
            width="100%"
            height="300"
            className=""
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </section>
        <section
          className="grid grid-cols-2 items-center bg-indigo-950"
          id="footer-corp-info"
        >
          <section className="flex flex-col max-w-150 mx-auto">
            <Link href="/police" className="hover:underline" id="footer-menu">
              Політика конфеденційності
            </Link>
            <Link href="/rules" className="hover:underline" id="footer-menu">
              Правила сайту
            </Link>
            <Link href="/offerta" className="hover:underline" id="footer-menu">
              Оферта відповідальності
            </Link>
            <Link
              href="/documents"
              className="hover:underline"
              id="footer-menu"
            >
              Питання та відповіді
            </Link>
            <p className="" id="footer-menu">
              © ТОВ AEL - Auto-El-Sancho
            </p>
            <p className="" id="footer-menu">
              Усі права захищені
            </p>
          </section>
          <section className="flex flex-col max-w-150 mx-auto py-20">
            <p className="">Контакти</p>
            <Link href="tel:+380123456789" className="hover:underline">
              +380123456789
            </Link>
            <Link href="mailto:auto-el@gmail.com" className="hover:underline">
              auto-el@gmail.com
            </Link>
            <Link
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Ми в Telegram
            </Link>
            <Link
              href="viber://chat?number=%2B380"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Ми в Viber
            </Link>
            <Link
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Ми в Facebook
            </Link>
          </section>
        </section>
        <p className="font-bold italic text-center py-5">AUTO-EL-SANCHO</p>
        <data value="" className="block text-center w-full py-5">
          {currentData 
    ? `${currentData.toLocaleDateString()} ${currentData.toLocaleTimeString()}` 
    : "Завантаження..."}
        </data>
      </footer>
    </Fragment>
  );
}
