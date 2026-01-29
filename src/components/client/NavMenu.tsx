import React, { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

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
         {name:"Залишити заявку", path: "#"},
         {name: "Вхід", path: "#"},
         {name:"Реєстрація", path: "#"}
        ];
    const linkStyles: string = "text-gray-600 font-medium transition-colors hover:text-blue-600";
    const activeStyle: string = "text-blue-600 border-b-2 border-blue-600";
    return(
        <Fragment>
            <nav className="bg-white border-b border-gray-200 px-4 py-3">
                <ul className="flex items-center justify-center gap-6 md:gap-8">
                    {navItem.map((link: navObj) => {
                        const isActive = currentPath === link.path;
                        return(
                            <li key={link.path} className="py-4">
                                <Link 
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
        </Fragment>
    );
}