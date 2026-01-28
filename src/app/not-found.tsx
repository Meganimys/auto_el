'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Lottie from 'lottie-react';
import animationData from '../../public/404page.json';

export default function FullScreenLottie() {
  const router = useRouter();
  const lottieRef = useRef(null);

  useEffect(() => {
    // Шукаємо шар Btn Outlines
    const btnLayer = document.querySelector('#error-button');
    if (btnLayer) {
      (btnLayer as HTMLElement).style.cursor = 'pointer';
      const handleClick = () => router.push('/');
      btnLayer.addEventListener('click', handleClick);
      return () => btnLayer.removeEventListener('click', handleClick);
    }
  }, [router]);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black">
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        style={{ width: '100%', height: '100%' }}
        /* preserveAspectRatio визначає, як анімація масштабується */
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid slice', // 'slice' розтягує на весь екран без полів (як cover)
        }}
      />
    </div>
  );
}
