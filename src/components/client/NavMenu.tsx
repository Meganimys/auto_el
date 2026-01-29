'use client'
import React, { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import ModalRegistration from "./ModalRegistation";
import { useRef } from "react";

export default function NavMenu() {
    const currentPath = usePathname();
    type navObj = {
        name: string,
        path: string
    }
    const navItem: navObj[] = [
         {name: "Про нас", path: "/about_us"},
         {name: "Послуги", path: "/services"},
         {name: "Авто-товари", path: "/auto_shop"},
         {name:"Залишити заявку", path: "/applay"},
         {name: "Вхід", path: "/enter"},
         {name:"Реєстрація", path: "/registry"}
        ];
    const linkStyles: string = "text-gray-600 font-medium transition-colors hover:text-blue-600";
    const activeStyle: string = "text-blue-600 border-b-2 border-blue-600";
    const modalRef = useRef<{ openModal: () => void }>(null);

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    if (path === "/registry") {
      e.preventDefault(); // Запобігаємо переходу за посиланням
      modalRef.current?.openModal();
    }
  };
    return(
        <Fragment>
            <nav className="bg-white border-b border-gray-200 px-4 py-3">
                <ul className="flex items-center justify-center gap-6 md:gap-8">
                    {navItem.map((link: navObj) => {
                        const isActive = currentPath === link.path;
                        return(
                            <li key={link.path} className="py-4">
                                <Link 
                                onClick={(e) => handleNavClick(e, link.path)}
                                href={link.path} 
                                className={`${linkStyles} ${isActive ? activeStyle : ''}`}
                                >
                                {link.name}
                                </Link>
                            </li>
                        );
                    })};
                </ul>
            </nav>
            <ModalRegistration ref={modalRef}></ModalRegistration>
        </Fragment>
    );
}