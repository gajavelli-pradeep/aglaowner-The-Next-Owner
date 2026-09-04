"use client";

import { useState, useId } from "react";
import { IconPlus, IconMinus } from "@tabler/icons-react";

/** .details / summary — FAQ accordion item, driven by real React state (not <details>). */
export function AccordionItem({ question, answer, defaultOpen = false }: { question: string; answer: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className="border-b border-line-soft py-4">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left text-[15px] font-semibold"
      >
        {question}
        {open ? <IconMinus size={19} className="shrink-0 text-oxide" /> : <IconPlus size={19} className="shrink-0 text-oxide" />}
      </button>
      {open && (
        <p id={panelId} className="mt-2.5 text-[13.5px] text-ink-soft">
          {answer}
        </p>
      )}
    </div>
  );
}
