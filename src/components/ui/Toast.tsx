"use client";

import type { ToastVariant } from "@/lib/useToast";

/** .toast — fixed bottom-center notification, shown via the useToast hook. */
export function Toast({ message, show, variant = "default" }: { message: string; show: boolean; variant?: ToastVariant }) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`pointer-events-none fixed bottom-[26px] left-1/2 z-[200] -translate-x-1/2 whitespace-nowrap rounded-md px-[22px] py-3 text-[13px] font-medium text-paper transition-[opacity,transform] duration-200 ${
        variant === "error" ? "bg-oxide" : "bg-ink"
      } ${show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
    >
      {message}
    </div>
  );
}
