"use client";
import React, {
  useImperativeHandle,
  useRef,
  forwardRef,
  Fragment,
} from "react";

const ModalAvtorization = forwardRef((prop, ref) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => {
      dialogRef.current?.showModal();
    },
  }));

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      dialogRef.current?.close();
    }
  };

  const dialogStyle: string =
    "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0 p-0  border-none bg-transparent outline-none z-50 w-[90vw] md:w-[35%] min-h-[50vh] hidden open:grid place-items-center backdrop:bg-black/50";
  const divStyle: string =
    "w-[34vw] min-w-[320px] font-bold p-6 text-amber-100 bg-gray-900 grid place-items-center rounded-[20px] border-2 border-yellow-800";
  const inputTextStyle: string =
    "min-h-10 pl-2 border-2 border-solid border-gray-800 rounded-xl";
  const formStyle: string =
    "my-10 max-w-[80%] grid col-auto items-center text-center gap-6.25";
  const submitButtonStyle: string =
    "min-h-10  bg-purple-700 rounded-xl hover:bg-purple-600 active:bg-purple-500";
  const closeDialogButtonStyle: string =
    "absolute top-5 right-5 min-h-10 min-w-10 border-2 border-yellow-800 rounded-xl text-3xl hover:bg-amber-300 hover:text-red-500 active:bg-amber-200";

  return (
    <Fragment>
      <dialog
        className={dialogStyle}
        ref={dialogRef}
        onClick={handleBackdropClick}
      >
        <div className={divStyle} onClick={(e) => e.stopPropagation()}>
          <form action="" className={formStyle}>
            <label htmlFor="" className="">
              Введіть логін:
            </label>
            <input
              type="text"
              className={inputTextStyle}
              minLength={3}
              maxLength={20}
              pattern="[a-zA-Z0-9_-]+"
              placeholder="Enter your login"
              title="Логін не може бути коротшим за 3 літери"
              required
            />
            <label htmlFor="" className="">
              Введіть пароль:
            </label>
            <input
              type="password"
              className={inputTextStyle}
              minLength={6}
              maxLength={25}
              pattern="(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=]).+"
              title="Пароль має містити велику літеру, цифру та спецсимвол"
              required
              placeholder="Enter your password"
            />
            <button type="submit" className={submitButtonStyle}>
              Увійти
            </button>
            <button
              type="button"
              className={closeDialogButtonStyle}
              onClick={() => dialogRef.current?.close()}
            >
              x
            </button>
          </form>
        </div>
      </dialog>
    </Fragment>
  );
});

ModalAvtorization.displayName = "ModalAvtorization";
export default ModalAvtorization;
