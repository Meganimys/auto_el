'use client'

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Fragment } from "react/jsx-runtime";

interface isVisible {
    isVisible: boolean,
}
interface hadlerList {
    name: string,
    handler: () => void,
}
const router = useRouter();
const { signOut } = useClerk();

const listItems:hadlerList[] = [{name: 'Профіль', handler: () => router.push('/profile')}, {name: 'Корзина', handler: () => router.push('/basket')}, {name: 'Повідомлення', handler: () => router.push('/message')}, {name: 'Налаштування', handler: () => router.push('/user_settings')}, {name: 'Вихід', handler: async () => { router.push('/'); await signOut(); }}];

export default function ModalUserMenu({isVisible} : isVisible) {
    const router = useRouter();

    return(
        <Fragment>
        {isVisible && <ul className="absolute top-full right-0 flex justify-center text-center">
            {listItems.map((item, index) => (
                <li className="" key={index} onClick={item.handler}>{item.name}</li>
            ))}
        </ul>}
        </Fragment>
    );
}