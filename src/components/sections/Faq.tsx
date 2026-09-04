import { AccordionItem } from "@/components/ui/Accordion";
import { getFaqItems } from "@/lib/data/faq";

export function Faq() {
  const items = getFaqItems();
  return (
    <section id="faq" className="border-t border-b border-line bg-paper-2 px-6 py-11 sm:py-16">
      <div className="mx-auto max-w-[1080px]">
        <p className="mb-2.5 text-xs font-semibold tracking-[0.1em] text-oxide uppercase">Questions</p>
        <h2 className="mb-9 text-[26px] sm:text-[30px]">Common questions</h2>
        <div className="max-w-[720px]">
          {items.map((item) => (
            <AccordionItem key={item.question} question={item.question} answer={item.answer} defaultOpen={item.openByDefault} />
          ))}
        </div>
      </div>
    </section>
  );
}
