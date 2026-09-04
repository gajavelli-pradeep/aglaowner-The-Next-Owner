"use client";

/** .toast — fixed bottom-center notification, shown via the useToast hook. */
export function Toast({ message, show }: { message: string; show: boolean }) {
  return (
    <div
      className={`pointer-events-none fixed bottom-[26px] left-1/2 z-[200] -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-[22px] py-3 text-[13px] font-medium text-paper transition-[opacity,transform] duration-200 ${
        show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      {message}
    </div>
  );
}
