"use client";
import React, { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ModalRegistration from "./ModalRegistation";
import ModalAuthorization from "./ModalAuthorization";
import ModalUserMenu from "./ModalUserMenu";
import { useUser, SignedIn, SignedOut } from "@clerk/nextjs";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

export default function NavMenu() {
  const { isLoaded } = useUser();

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isMobileMenu, setMobileMenu] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    // Ховаємо тільки якщо проскролили вниз більше 150px
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const currentPath = usePathname();
  const router = useRouter();

  type navObj = {
    name: string;
    path: string;
  };

  const navItem: navObj[] = [
    { name: "Про нас", path: "/#about_us" },
    { name: "Послуги", path: "/#services" },
    { name: "Авто-товари", path: "/auto_shop" },
    { name: "Залишити заявку", path: "/#applay" },
  ];
  const avtorizationItem: navObj[] = [
    { name: "Вхід", path: "/enter" },
    { name: "Реєстрація", path: "/registry" },
  ];

  const linkStyles: string =
    "text-white-600 font-medium transition-colors hover:text-[#dc143c] text-shadow-md text-shadow-[#000000] active:text-[#9a193b]";
  const activeStyle: string = "text-blue-600 border-b-2 border-blue-600";

  const modalRegRef = useRef<{ openModal: () => void; closeModal: () => void }>(null);
  const modalAvtRef = useRef<{ openModal: () => void; closeModal: () => void }>(null);

  const [activeHash, setActiveHash] = React.useState("");

  useEffect(() => {
    // Функція для відстеження секцій
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHash("#" + entry.target.id);
          }
        });
      },
      { threshold: 0.6 }, // Секція вважається активною, коли видно 60%
    );

    // Відстежуємо всі секції, які є в меню
    navItem.forEach((item) => {
      if (item.path.startsWith("/#")) {
        const id = item.path.replace("/#", "");
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    }
    });

    return () => observer.disconnect();
  }, [currentPath]); // Перезапускаємо при зміні сторінки

  useEffect(() => {
    // Проверяем наличие хеша в URL (например, #services)
    const hash = window.location.hash;
    if (hash) {
      // Небольшая задержка, чтобы DOM успел отрисоваться
      setTimeout(() => {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [currentPath]);

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    // 1. Обработка модалок (оставляем как было)
    if (path === "/registry") {
      e.preventDefault();
      modalRegRef.current?.openModal();
      return;
    }

    if (path === "/enter") {
      e.preventDefault();
      modalAvtRef.current?.openModal();
      return;
    }

    if (path.startsWith("/#")) {
      const id = path.replace("/#", "");

      if (currentPath === "/") {
        // 1. Отменяем стандартный скачок
        e.preventDefault();

        // 2. Плавно скроллим
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

        // 3. Вручную меняем URL без перезагрузки страницы
        window.history.pushState(null, "", path);
      }
      // Если мы не на главной, e.preventDefault() НЕ вызывается,
      // и Link штатно переходит на /#id
    }
  };

  const openLoginAndCloseReg = () => {
    modalRegRef.current?.closeModal?.(); // Закриваємо реєстрацію
  setTimeout(() => {
    modalAvtRef.current?.openModal(); // Відкриваємо вхід
  }, 100); // Невелика затримка для плавності анімації
};

const openRegAndCloseLogin = () => {
    modalAvtRef.current?.closeModal?.(); // Закриваємо вхід
  setTimeout(() => {
    modalRegRef.current?.openModal(); // Відкриваємо реєстрацію
  }, 100);
};

  const handleLogoClick = () => {
    router.push("/");
  };

  const [isUserModalVisible, setUserModalVisible] = useState<boolean>(false);

  const handleAvatarClick = () => setUserModalVisible(!isUserModalVisible);

  const menuRef = useRef<HTMLDivElement>(null);

// Закриття при кліку за межі
useEffect(() => {
    // Вказуємо тип MouseEvent
    const handleClickOutside = (event: MouseEvent) => {
        // Використовуємо Node, щоб TypeScript не сварився на contains
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setUserModalVisible(false);
        }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

const handleMobileMenu = () => setMobileMenu(!isMobileMenu);

  if (!isLoaded) return null;

  return (
    <Fragment>
      <motion.nav variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: -100, opacity: 0 } // Плавне зникнення вгору
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: "easeInOut" }} className="sticky xl:h-25 h-15 top-0 w-full rounded-xl bg-[#4b0082]/50 border-b border-[#800080] backdrop-blur-md pr-4 z-50">
        {/* Контейнер, який ділить простір на 3 частини */}
        <div className="flex items-center justify-between w-full mx-auto min-h-full max-h-full">
          {/* Ліва картинка */}
          <div className="xl:block hidden shrink-0 min-h-full xl:max-h-25 max-h-15">
            <Image
              src="/logo.png"
              alt="left icon"
              width={180}
              height={100}
              className="min-h-full xl:max-h-24.75 max-h-15 xl:max-w-50 max-w-20 rounded-xl hover:opacity-75 active:opacity-90"
              onClick={handleLogoClick}
            />
          </div>
          <div className="relative z-120 xl:hidden flex flex-col justify-between items-center w-8 h-8 ml-5" onClick={handleMobileMenu}>
            <div className={`w-full h-1 bg-black transition-all duration-300 ${!isMobileMenu && "rotate-45 absolute top-1/2 translate-y-[-50%]"}`}></div>
            <div className={`w-full h-1 bg-black ${!isMobileMenu && "hidden"}`}></div>
            <div className={`w-full h-1 bg-black transition-all duration-300 ${!isMobileMenu && "-rotate-45 absolute top-1/2 translate-y-[-50%]"}`}></div>
          </div>
          {/* Центральне меню */}
          <ul className={`${
  isMobileMenu 
    ? "left-[calc(-100%+20px)]" // Повернувся на місце
    : "left-0" // Сховався за лівий край
} transition-all duration-300 flex z-100 xl:items-center xl:flex-row flex-col items-start xl:rounded-none rounded-xl top-0 xl:justify-center pl-5 xl:pl-0 xl:bg-transparent bg-gray-700 min-w-[70%] xl:min-w-auto md:gap-6 xl:gap-8 absolute xl:static uppercase mx-auto`}>
            <div className="xl:hidden block shrink-0 min-h-full xl:max-h-25 max-h-15 mt-15">
            <Image
              src="/logo.png"
              alt="left icon"
              width={180}
              height={100}
              className="min-h-full xl:max-h-24.75 max-h-15 xl:max-w-50 max-w-[70%] rounded-xl hover:opacity-75 active:opacity-90"
              onClick={handleLogoClick}
            />
          </div>
            {navItem.map((link: navObj) => {
              // Витягуємо хеш з шляху (наприклад, "#about_us")
              const linkHash = link.path.split("/")[1];

              const isActive = link.path.startsWith("/#")
                ? currentPath === "/" && activeHash === linkHash // Активний хеш на головній
                : currentPath === link.path; // Звичайне посилання

              return (
                <li key={link.path} className="py-4">
                  <Link
                    onClick={(e) => {
                      handleNavClick(e, link.path);
                      if (link.path.startsWith("/#"))
                        setActiveHash(link.path.replace("/", ""));
                        handleMobileMenu();
                    }}
                    href={link.path}
                    className={`${linkStyles} ${isActive ? activeStyle : ""}`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
            <SignedOut>
            {avtorizationItem.map((link: navObj) => {
              // Витягуємо хеш з шляху (наприклад, "#about_us")
              const linkHash = link.path.split("/")[1];

              const isActive = link.path.startsWith("/#")
                ? currentPath === "/" && activeHash === linkHash // Активний хеш на головній
                : currentPath === link.path; // Звичайне посилання

              return (
                <li key={link.path} className="py-4">
                  <Link
                    onClick={(e) => {
                      handleNavClick(e, link.path);
                      if (link.path.startsWith("/#"))
                        setActiveHash(link.path.replace("/", ""));
                        handleMobileMenu();
                    }}
                    href={link.path}
                    className={`${linkStyles} ${isActive ? activeStyle : ""}`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
            </SignedOut>
          </ul>

          <SignedIn>
          {/* Права картинка */}
          <div className="relative flex justify-center shrink-0 border-2 border-amber-50 max-w-20 max-h-20 min-w-20 min-h-20 rounded-[50%] hover:border-amber-300 active:border-amber-500" 
          ref={menuRef} 
          onMouseEnter={() => setUserModalVisible(true)}
          onMouseLeave={() => setUserModalVisible(false)}
          >
            <img
              onClick={handleAvatarClick}
              src="/empty-avatar.png"
              alt="right icon"
              width="100%"
              height="100%"
              className="rounded-[50%] min-h-full min-w-full overflow-hidden object-contain hover:opacity-75 active:opacity-90"
            />
            <div className="absolute top-full -right-5">
              <ModalUserMenu isVisible={isUserModalVisible} closeMenu={() => setUserModalVisible(false)}></ModalUserMenu>
              {isUserModalVisible && <div onClick={handleAvatarClick} className="absolute top-2 right-2 w-5 h-5 z-999 flex justify-center items-center align-middle hover:text-red-800 cursor-pointer">X</div>}
            </div>
          </div>
          </SignedIn>
        </div>
      </motion.nav>

      <ModalRegistration onSwitchToLogin={openLoginAndCloseReg} ref={modalRegRef} />
      <ModalAuthorization onSwitchToLogin={openRegAndCloseLogin} ref={modalAvtRef} />
    </Fragment>
  );
}
