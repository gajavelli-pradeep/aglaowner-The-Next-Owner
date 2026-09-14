"use client";

import { useCallback, useRef, useState } from "react";

export type ToastVariant = "default" | "error";

/** Shared toast-timer behavior for the .toast pattern (2.6s auto-dismiss, retriggerable). */
export function useToast() {
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState<ToastVariant>("default");
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string, toastVariant: ToastVariant = "default") => {
    setMessage(msg);
    setVariant(toastVariant);
    setShow(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setShow(false), 2600);
  }, []);

  return { message, variant, show, showToast };
}
