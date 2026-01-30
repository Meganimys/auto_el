"use client";
import React, { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import ModalRegistration from "./ModalRegistation";
import { useRef } from "react";
import ModalAvtorization from "./ModalAvtorization";

export default function NavMenu() {
  const currentPath = usePathname();
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
  const linkStyles: string =
    "text-white-600 font-medium transition-colors hover:text-[#dc143c] text-shadow-md text-shadow-[#000000] active:text-[#9a193b]";
  const activeStyle: string = "text-blue-600 border-b-2 border-blue-600";
  const modalRegRef = useRef<{ openModal: () => void }>(null);
  const modalAvtRef = useRef<{ openModal: () => void }>(null);

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    if (path === "/registry") {
      e.preventDefault(); // Запобігаємо переходу за посиланням
      modalRegRef.current?.openModal();
    } else if (path === "/enter") {
      e.preventDefault();
      modalAvtRef.current?.openModal();
    }
  };
  return (
    <Fragment>
      <nav className="fixed top-0 w-full bg-[#4b0082]/50 border-b border-[#800080] px-4 py-3">
        <ul className="flex items-center justify-center gap-6 md:gap-8 uppercase">
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
      </nav>
      <ModalRegistration ref={modalRegRef}></ModalRegistration>
      <ModalAvtorization ref={modalAvtRef}></ModalAvtorization>
    </Fragment>
  );
}
