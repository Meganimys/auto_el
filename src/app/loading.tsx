'use client'
import { useRef } from "react";
import Lottie from "lottie-react";
import lottieAnimation from '../../public/loading.json';

export default function LoadingComponent() {
    const lottieRef = useRef(null);

    return(
    <div className="flex h-screen items-center justify-center inset-0 w-screen overflow-hidden bg-black">
        <Lottie
        lottieRef={lottieRef}
        animationData={lottieAnimation}
        style={{ width: '20%', height: '20%' }}
        /* preserveAspectRatio визначає, як анімація масштабується */
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid meet', // 'slice' розтягує на весь екран без полів (як cover)
        }}
      />
    </div>
    );
}