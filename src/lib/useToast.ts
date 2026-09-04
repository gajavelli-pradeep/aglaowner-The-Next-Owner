"use client";

import { useCallback, useRef, useState } from "react";

/** Shared toast-timer behavior for the .toast pattern (2.6s auto-dismiss, retriggerable). */
export function useToast() {
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setMessage(msg);
    setShow(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setShow(false), 2600);
  }, []);

  return { message, show, showToast };
}
