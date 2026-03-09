'use client'

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "../server/getUser";
import { useEffect, useState } from "react";

interface ModalUserMenuProps {
    isVisible: boolean;
    closeMenu: () => void;
};

type UserType = {
    id: string;
    login: string;
    fullName: string;
    phone: string;
    email: string;
    avatarUrl: string;
    createdAt: Date;
};

export default function ModalUserMenu({ isVisible, closeMenu }: ModalUserMenuProps) {
    const { signOut } = useClerk();
    const [user, setUser] = useState<UserType|null>(); // додайте свій тип замість any
    const router = useRouter();

    useEffect(() => {
        if (isVisible) {
            getCurrentUser().then(data => setUser(data));
        }
    }, [isVisible]);

    const handleSettingsClick = () => {
        if (user?.login) {
            router.push(`/profile/user_settings?user=${user.login}`);
            closeMenu();
        }
    };

    // Визначаємо пункти меню всередині компонента, 
    // щоб вони мали доступ до router та signOut
    const listItems = [
        { name: 'Профіль', handler: () => {router.push('/profile'); closeMenu();} },
        { name: 'Корзина', handler: () => {router.push('/basket'); closeMenu();} },
        { name: 'Повідомлення', handler: () => {router.push('/message'); closeMenu();} },
        { name: 'Налаштування', handler: () => {handleSettingsClick(); closeMenu();} },
        { 
            name: 'Вихід', 
            handler: async () => { 
                await signOut(); 
                router.push('/'); 
                closeMenu();
            } 
        }
    ];

    if (!isVisible) return null;

    return (
        <ul className="absolute top-full right-0 flex flex-col justify-center text-center bg-gray-900 border border-yellow-800 p-2 rounded-lg z-50">
            {listItems.map((item, index) => (
                <li 
                    className="cursor-pointer text-amber-50 hover:text-yellow-500 p-2 border-b border-gray-800 last:border-none" 
                    key={index} 
                    onClick={item.handler}
                >
                    {item.name}
                </li>
            ))}
        </ul>
    );
}
