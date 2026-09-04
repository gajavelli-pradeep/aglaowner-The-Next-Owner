import { IconLock } from "@tabler/icons-react";
import { getHowItWorksColumns } from "@/lib/data/how-it-works";

export function HowItWorks() {
  const columns = getHowItWorksColumns();
  return (
    <section id="how-it-works" className="px-6 py-11 sm:py-16">
      <div className="mx-auto max-w-[1080px]">
        <p className="mb-2.5 text-xs font-semibold tracking-[0.1em] text-oxide uppercase">How it works</p>
        <div className="mb-9">
          <h2 className="mb-3 max-w-[560px] text-[26px] sm:text-[30px]">Two simple paths — one for selling, one for buying</h2>
          <p className="max-w-[520px] text-[15px] text-ink-soft">
            No accounts to create. Your mobile number is your identity as a seller; a one-time DigiLocker check is your identity as a buyer.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
          {columns.map((col) => (
            <div key={col.tag} className="rounded-[10px] border border-line bg-paper p-6.5">
              <span
                className={`mb-4 inline-block rounded-[20px] px-2.5 py-1 text-[11px] font-bold tracking-[0.05em] uppercase ${
                  col.variant === "seller" ? "bg-[#f0e2cf] text-mustard-dark" : "bg-[#e0e8f0] text-navyblue"
                }`}
              >
                {col.tag}
              </span>
              {col.steps.map((step, i) => (
                <div
                  key={step.title}
                  className={`flex gap-3.5 py-4 ${i === col.steps.length - 1 ? "border-b-0 pb-0" : "border-b border-line-soft"} ${i === 0 ? "pt-0" : ""}`}
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line bg-paper-2 font-mono text-xs font-semibold">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="mb-1 text-[14.5px] font-semibold">{step.title}</h4>
                    <p className="text-[13px] text-ink-soft">{step.description}</p>
                    {step.badge && (
                      <span className="mt-1.5 inline-flex items-center gap-1.5 rounded bg-navyblue px-2.5 py-[3px] text-[10.5px] font-semibold text-white">
                        <IconLock size={12} /> {step.badge}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
