'use client'
import { useRef } from "react";
import Lottie from "lottie-react";
import lottieAnimation from '../../public/loading.json';

export default function LoadingComponent() {
    const lottieRef = useRef(null);

    return(
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black">
        <Lottie
        lottieRef={lottieRef}
        animationData={lottieAnimation}
        style={{ width: '100%', height: '100%' }}
        /* preserveAspectRatio визначає, як анімація масштабується */
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid slice', // 'slice' розтягує на весь екран без полів (як cover)
        }}
      />
    </div>
    );
}