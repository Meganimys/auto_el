import { auth } from "@clerk/nextjs/server";
import { prisma } from "./lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";


export async function UserProfile() {
    const { userId } = await auth();
    if(!userId) redirect('/');
    const currentUser = await prisma.user.findUnique({
        where: {id: userId},
    });
    const userAvatar ="/empty-avatar.png"

    return(
        <div className="grid grid-cols-[20%_60%] justify-center py-10">
            <section className="flex py-5 gap-5 flex-col border-l-2 border-gray-400 rounded-l-2xl">
                <Image className="mx-auto relative flex justify-center shrink-0 border-2 border-amber-50 max-w-20 max-h-20 min-w-20 min-h-20 rounded-[50%]" width={80} height={80} src={userAvatar} alt="This is user avatar"></Image>
                <hr />
                <p className="ml-5">{currentUser?.login}</p>
                <p className="ml-5">John Smith</p>
                <p className="ml-5">{currentUser?.email}</p>
                <p className="ml-5">+380123456789</p>
                <Link href={`/profile/setting?user=${currentUser?.login}`} className="ml-5">Змінити інформацію</Link>
            </section>
            <section className="border-l-2 border-r-2 rounded-r-2xl border-gray-400 py-5 flex flex-col items-center">
                <h1>Ремонтна панель</h1>
                <p>Тут відображаються статуси активних ремонтних послуг.</p>
            </section>
        </div>
    );
}