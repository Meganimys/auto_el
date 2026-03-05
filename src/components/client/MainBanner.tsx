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
        className="bg-size-[100%_100%] pb-20 bg-center bg-no-repeat h-auto xl:min-h-150 w-full"
      >
        <h1 className="xl:pt-90 pt-20 pl-5 xl:pl-30 pb-5 font-bold text-xl md:text-2xl xl:text-3xl text-shadow-sm text-shadow-black text-cyan-500">Ваше авто в надійних руках: професійна автоелектроніка</h1>
        <h2 className="xl:pl-30 pl-5 xl:max-w-[30%] md:max-w-[50%] max-w-[70%] pb-5 text-amber-50 md:font-bold md:text-xl xl:text-xl text-xs">Точна комп'ютерна діагностика та ремонт з гарантією. Без «сюрпризів» та зайвих витрат.</h2>
        <button onClick={handleContactClick} className="xl:ml-30 mx-auto block text-amber-50 bg-[#191970] h-12.5 p-3 rounded-2xl font-bold hover:bg-[#256590] hover:scale-[1.05] active:bg-[#252550] active:scale-[1.0] shadow-md shadow-[rgba(25,25,112,0.5)] transition-colors duration-300 ease-in-out">Зв'язатися з нами</button>
      </section>
    </Fragment>
  );
}
