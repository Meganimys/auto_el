'use client'
import { useRef } from "react";
import Lottie from "lottie-react";
import lottieAnimation from '../../../public/loading.json';

export default function LoadingComponent() {
    const lottieRef = useRef(null);

    return(
    <div className="absolute flex h-full items-center justify-center inset-0 w-full overflow-hidden bg-black z-99">
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