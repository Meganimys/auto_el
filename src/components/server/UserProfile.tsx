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

    return(
        <div className="">
            <section className="">
                <Image className="" src="#" alt="This is user avatar"></Image>
                <hr />
                <p className="">{currentUser?.login}</p>
                <p className="">John Smith</p>
                <p className="">{currentUser?.email}</p>
                <p className="">+380123456789</p>
                <Link href={`/profile/setting?user=${currentUser?.login}`}>Змінити інформацію</Link>
            </section>
            <section className="">
                <h1>Ремонтна панель</h1>
                <p>Тут відображаються статуси активних ремонтних послуг.</p>
            </section>
        </div>
    );
}