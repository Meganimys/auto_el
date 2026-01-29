import React, { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NavMenu() {
    const navItem: Array<string> = ["Про нас", "Послуги", "Авто-товари", "Залишити заявку", "Вхід", "Реєстрація"];
    return(
        <Fragment>
            <nav className="">
                <ul className="">
                    <li className="">
                        <Link href="/" className=""><Image
                        src=""
                        alt=""
                        >
                            </Image></Link>
                    </li>
                    <li className="">
                        <Link href='/about_us' className=""></Link>
                    </li>
                    <li className="">
                        <Link href="/services" className=""></Link>
                    </li>
                    <li className="">
                        <Link href="/auto_shop" className=""></Link>
                    </li>
                    <li className="">
                        <Link scroll={false} href="/enter" className=""></Link>
                    </li>
                    <li className="">
                        <Link href="/registration" className=""></Link>
                    </li>
                    <li className="">
                        <Link href="#" className=""></Link>
                    </li>
                </ul>
            </nav>
        </Fragment>
    );
}