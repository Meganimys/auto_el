'use client';

import React from 'react';
import { Fragment } from 'react';
import { useRouter } from 'next/navigation';

export default function MainBanner() {

  const router = useRouter();

  const handleContactClick = () => {
    router.push('#applay');
  }

  return (
    <Fragment>
      <section 
        style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/main-banner.jpg')", borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }} 
        className="bg-size-[100%_100%] bg-center bg-no-repeat min-h-150 w-full pt-px"
      >
        <h1 className="mt-90 ml-30 mb-5 font-bold text-3xl text-shadow-sm text-shadow-black text-cyan-500">Ваше авто в надійних руках: професійна автоелектроніка</h1>
        <h2 className="ml-30 max-w-[30%] mb-5 text-2xl">Точна комп'ютерна діагностика та ремонт з гарантією. Без «сюрпризів» та зайвих витрат.</h2>
        <button onClick={handleContactClick} className="ml-30 bg-[#191970] h-12.5 p-3 mb-20 rounded-2xl font-bold hover:bg-[#256590] hover:scale-[1.05] active:bg-[#252550] active:scale-[1.0] shadow-md shadow-[rgba(25,25,112,0.5)] transition-colors duration-300 ease-in-out">Зв'язатися з нами</button>
      </section>
    </Fragment>
  );
}
