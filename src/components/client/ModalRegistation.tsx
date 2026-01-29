'use client'
import React, { useImperativeHandle, useRef, forwardRef, Fragment } from "react";

const ModalRegistration = forwardRef((props, ref) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => {
      dialogRef.current?.showModal();
    }
  }));

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      dialogRef.current?.close();
    }
  };
    return(
        <Fragment>
            <dialog className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0 p-0  border-none bg-transparent outline-none z-50 w-[90vw] md:w-[25%] min-h-[50vh] hidden open:grid place-items-center backdrop:bg-black/50" ref={dialogRef} onClick={handleBackdropClick}>
                <div className=" w-[25vw] min-w-[320px] p-6 bg-white grid place-items-center" onClick={(e) => e.stopPropagation()}>
                    <form action="" className="my-10 max-w-[80%] grid col-auto items-center text-center gap-6.25">
                        <label htmlFor="login-input" className="">Введіть логін:</label>
                        <input type="text" id="login-input" className="min-h-10 border-2 border-solid border-gray-800 rounded-xl" minLength={3} maxLength={20} pattern="[a-zA-Z0-9_-]+" />
                        <label htmlFor="email-input" className="">Введіть свою електронну пошту:</label>
                        <input type="email" id="email-input" className="min-h-10 border-2 border-solid border-gray-800 rounded-xl" pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" />
                        <label htmlFor="password-input" className="">Введіть пароль:</label>
                        <input type="password" id="password-input" className="min-h-10 border-2 border-solid border-gray-800 rounded-xl" minLength={6} maxLength={25} pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+]).+$" />
                        <label htmlFor="password-repeat-input" className="">Введіть пароль повторно:</label>
                        <input type="password" id="password-repeat-input" className="min-h-10 border-2 border-solid border-gray-800 rounded-xl" minLength={6} maxLength={25} pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+]).+$" />
                        <button type="submit" className="min-h-10  bg-purple-700 rounded-xl text-amber-100">Зареєструватися</button>
                        <button type="button" onClick={() => dialogRef.current?.close()} className=" absolute top-5 right-5 min-h-10 min-w-10 border-2 border-solid border-gray-800 rounded-xl text-3xl hover:bg-amber-300 action">x</button>
                    </form>
                </div>
            </dialog>
        </Fragment>
    );
});

ModalRegistration.displayName = "ModalRegistration";
export default ModalRegistration;