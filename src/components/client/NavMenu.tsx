"use client";
import React, { Fragment, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ModalRegistration from "./ModalRegistation";
import ModalAvtorization from "./ModalAvtorization";

export default function NavMenu() {
  const currentPath = usePathname();
  const router = useRouter();

  type navObj = {
    name: string;
    path: string;
  };

  const navItem: navObj[] = [
    { name: "Про нас", path: "#about_us" },
    { name: "Послуги", path: "/services" },
    { name: "Авто-товари", path: "/auto_shop" },
    { name: "Залишити заявку", path: "/applay" },
    { name: "Вхід", path: "/enter" },
    { name: "Реєстрація", path: "/registry" },
  ];

  const linkStyles: string = "text-white-600 font-medium transition-colors hover:text-[#dc143c] text-shadow-md text-shadow-[#000000] active:text-[#9a193b]";
  const activeStyle: string = "text-blue-600 border-b-2 border-blue-600";

  const modalRegRef = useRef<{ openModal: () => void }>(null);
  const modalAvtRef = useRef<{ openModal: () => void }>(null);

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    if (path === "/registry") {
      e.preventDefault();
      modalRegRef.current?.openModal();
    } else if (path === "/enter") {
      e.preventDefault();
      modalAvtRef.current?.openModal();
    }
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  return (
    <Fragment>
      <nav className="fixed h-25 top-0 w-full bg-[#4b0082]/50 border-b border-[#800080] pr-4 z-50">
        {/* Контейнер, який ділить простір на 3 частини */}
        <div className="flex items-center justify-between w-full mx-auto min-h-full max-h-full">
          
          {/* Ліва картинка */}
          <div className="shrink-0 min-h-full max-h-25">
            <Image src="/logo.png" alt="left icon" width={180} height={100} className="min-h-full max-h-24.75 rounded-xl hover:opacity-75 active:opacity-90" onClick={handleLogoClick} />
          </div>

          {/* Центральне меню */}
          <ul className="flex items-center justify-center gap-6 md:gap-8 uppercase mx-auto">
            {navItem.map((link: navObj) => {
              const isActive = currentPath === link.path;
              return (
                <li key={link.path} className="py-4">
                  <Link
                    onClick={(e) => handleNavClick(e, link.path)}
                    href={link.path}
                    className={`${linkStyles} ${isActive ? activeStyle : ""}`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Права картинка */}
          <div className="flex justify-center shrink-0 border-2 border-amber-50 max-w-20 max-h-20 min-w-20 min-h-20 rounded-[50%] hover:border-amber-300 active:border-amber-500">
            <img src="/empty-avatar.png" alt="right icon" width="100%" height="100%" className="rounded-[50%] min-h-full min-w-full overflow-hidden object-contain hover:opacity-75 active:opacity-90" />
          </div>

        </div>
      </nav>

      <ModalRegistration ref={modalRegRef} />
      <ModalAvtorization ref={modalAvtRef} />
    </Fragment>
  );
}
