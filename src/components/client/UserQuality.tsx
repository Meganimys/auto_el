"use client";

import { Fragment } from "react/jsx-runtime";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PlusOrMinus {
  quality: string;
}

interface UserNotification {
  id: number;
  login: string;
  date: string;
  avatar: string;
  title: string;
  message: string;
  plus: PlusOrMinus[];
  minus: PlusOrMinus[];
}

export default function UserQuality() {
  const userPovList: UserNotification[] = [
    {
      id: 1,
      login: "Kell",
      date: "12.13.2028",
      avatar: "empty-avatar.png",
      title: "Coll service",
      message: "This is so cool message",
      plus: [{ quality: "lorem" }, { quality: "lorem" }, { quality: "lorem" }],
      minus: [{ quality: "lorem" }, { quality: "lorem" }, { quality: "lorem" }],
    },
    {
      id: 2,
      login: "Kell",
      date: "12.13.2028",
      avatar: "empty-avatar.png",
      title: "Coll service",
      message: "This is so cool message",
      plus: [{ quality: "lorem" }, { quality: "lorem" }, { quality: "lorem" }],
      minus: [{ quality: "lorem" }, { quality: "lorem" }, { quality: "lorem" }],
    },
    {
      id: 3,
      login: "Kell",
      date: "12.13.2028",
      avatar: "empty-avatar.png",
      title: "Coll service",
      message: "This is so cool message",
      plus: [{ quality: "lorem" }, { quality: "lorem" }, { quality: "lorem" }],
      minus: [{ quality: "lorem" }, { quality: "lorem" }, { quality: "lorem" }],
    },
    {
      id: 4,
      login: "Kell",
      date: "12.13.2028",
      avatar: "empty-avatar.png",
      title: "Coll service",
      message: "This is so cool message",
      plus: [{ quality: "lorem" }, { quality: "lorem" }, { quality: "lorem" }],
      minus: [{ quality: "lorem" }, { quality: "lorem" }, { quality: "lorem" }],
    },
    {
      id: 5,
      login: "Kell",
      date: "12.13.2028",
      avatar: "empty-avatar.png",
      title: "Coll service",
      message: "This is so cool message",
      plus: [{ quality: "lorem" }, { quality: "lorem" }, { quality: "lorem" }],
      minus: [{ quality: "lorem" }, { quality: "lorem" }, { quality: "lorem" }],
    },
  ];

  const router = useRouter();
  const [userPov, setUserPov] = useState<UserNotification[]>(userPovList);

  const handleToQuality = () => router.push("/set_quality");

  return (
    <Fragment>
      <section className="w-full p-20 bg-purple-950 min-h-38 h-auto grid grid-cols-1 place-items-center">
        <h2 className="block uppercase text-2xl font-bold mb-5">Відгуки</h2>
        <div className="w-full h-auto grid grid-cols-2 place-items-center gap-20 py-10">
          {userPov ? (
            userPov.map((item) => (
              <section
                className="w-full bg-purple-800 grid grid-cols-[30%_1fr] items-start border border-gray-400 shadow-md shadow-gray-900"
                key={item.id}
              >
                <div className="min-w-full p-5 grid gap-y-2 justify-center text-center">
                  <img
                    src={item.avatar}
                    alt="User avatar"
                    className="overflow-hidden w-25 h-25 border-2 rounded-[50%] border-amber-300"
                  />
                  <p className="font-bold">{item.login}</p>
                  <p className="">{item.date}</p>
                </div>
                <div className="min-w-full p-5 pl-10 grid gap-y-2 border-l border-gray-700">
                  <p className="font-bold">{item.title}</p>
                  <p className="">{item.message}</p>
                  <p className="">Плюси:</p>
                  <ul className="">
                    {item.plus &&
                      item.plus.map((plus, index) => (
                        <li
                          className="text-green-500"
                          key={`${item.id}-plus-${index}`}
                        >{`+ ${plus.quality}`}</li>
                      ))}
                  </ul>

                  <p className="">Мінуси:</p>
                  <ul className="">
                    {item.minus &&
                      item.minus.map((minus, index) => (
                        <li
                          className="text-red-700"
                          key={`${item.id}-minus-${index}`}
                        >{`- ${minus.quality}`}</li>
                      ))}
                  </ul>
                </div>
              </section>
            ))
          ) : (
            <p className="col-span-2">
              На даний час відгуки відсутні - станьте першим!
            </p>
          )}
          <button
            className="col-span-2 block bg-[#191970] h-12.5 p-3 rounded-2xl font-bold hover:bg-[#256590] hover:scale-[1.05] active:bg-[#252550] active:scale-[1.0] shadow-md shadow-[#252550] transition-colors duration-300 ease-in-out"
            type="button"
            onClick={handleToQuality}
          >
            Залишити відгук
          </button>
        </div>
      </section>
    </Fragment>
  );
}
