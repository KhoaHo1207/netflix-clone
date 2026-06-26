import { useGlobalContext } from "@/context/globalContext";
import useDetectOutsideClick from "@/hooks/useDetectOutsideClick";
import React, { useRef } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  children: React.ReactNode;
  className?: string;
  overlay?: boolean;
}

function Modal({ children, className, overlay = true }: Props) {
  const { closeModal } = useGlobalContext();

  const ref = useRef<HTMLDivElement>(null);
  useDetectOutsideClick(ref, closeModal);

  return (
    <div className="fixed top-0 z-100 flex h-full w-full items-center justify-center">
      <div
        className={twMerge(
          "bg-brand-background/70 z-50 w-full max-w-xl rounded-lg p-4",
          className,
        )}
        ref={ref}
      >
        {children}
      </div>
      {overlay && (
        <div className="absolute z-40 h-full w-full bg-black/20 backdrop-blur-xs"></div>
      )}
    </div>
  );
}

export default Modal;
