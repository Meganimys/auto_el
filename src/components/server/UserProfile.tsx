import { auth } from "@clerk/nextjs/server";
import { prisma } from "./lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";
import { currentUser } from '@clerk/nextjs/server';

export async function UserProfile() {
  const { userId } = await auth();
  if (!userId) redirect("/");
  const thisUser = await prisma.user.findUnique({
    where: { id: userId },
  });
  
  const user = await currentUser();

  // if(!isLoaded || !user) -> на сервері ми просто чекаємо на user
  if (!user) return null;

  const emailResource = user.primaryEmailAddressId 
    ? user.emailAddresses.find(e => e.id === user.primaryEmailAddressId) 
    : null;

  const isVerified = emailResource?.verification?.status === "verified";

  const userAvatar = "/empty-avatar.png";

  return (
    <div className="grid xl:grid-cols-[30%_60%] justify-center px-5 py-10 bg-gray-800 text-amber-50 rounded-t-xl">
      <SignedIn>
        <section className="flex py-5 gap-5 flex-col border-x-2 rounded-2xl xl:border-l-2 border-gray-400 xl:rounded-l-2xl">
          <Link href={`/profile/user_settings?user=${thisUser?.login}`} className="hover:opacity-75">
            <Image
              className="mx-auto relative flex justify-center shrink-0 border-2 border-amber-50 max-w-20 max-h-20 min-w-20 min-h-20 rounded-[50%]"
              width={80}
              height={80}
              src={thisUser?.avatarUrl ?? userAvatar}
              alt="This is user avatar"
            ></Image>
          </Link>
          <hr />
          <p className="ml-5">{thisUser?.login}</p>
          <p className="ml-5">
            {thisUser?.fullName && thisUser.fullName.trim() !== "" ? (
              thisUser.fullName
            ) : (
              <Link
                href={`/profile/user_settings?user=${thisUser?.login}`}
                className="text-left hover:text-blue-800"
              >
                Додати ім'я
              </Link>
            )}
          </p>
          <p className="ml-5 mr-5">{thisUser?.email}</p>
          <p className="ml-5 mr-5 -mt-4">{isVerified ? "✅ Пошта підтверджена" : "⚠️ Потрібна верифікація"}</p>
          <p className="ml-5">
            {thisUser?.phone && thisUser.phone.trim() != "" ? (
              thisUser.phone
            ) : (
              <Link
                href={`/profile/user_settings?user=${thisUser?.login}`}
                className="text-left hover:text-blue-800"
              >
                Додати номер телефону
              </Link>
            )}
          </p>
          <Link
            href={`/profile/user_settings?user=${thisUser?.login}`}
            className="ml-5 hover:text-blue-800"
          >
            Змінити інформацію
          </Link>
        </section>
        <section className="border-x-2 xl:border-l-2 rounded-2xl xl:border-r-2 xl:rounded-r-2xl border-gray-400 py-5 flex flex-col items-center">
          <h1>Ремонтна панель</h1>
          <p className="w-full text-center">
            Тут відображаються статуси активних ремонтних послуг.
          </p>
        </section>
      </SignedIn>
    </div>
  );
}
