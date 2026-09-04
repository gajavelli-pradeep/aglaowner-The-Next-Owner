import { IconRefresh, IconInfoCircle } from "@tabler/icons-react";
import { getTimelineNodes, getRestoreSteps } from "@/lib/data/how-it-works";

const dotColor = { live: "border-stamp-green", archived: "border-mustard", gone: "border-line" } as const;

export function ArchiveSection({ onReactivate }: { onReactivate: () => void }) {
  const nodes = getTimelineNodes();
  const steps = getRestoreSteps();

  return (
    <section id="archive" className="border-t border-b border-line bg-paper-2 px-6 py-11 sm:py-16">
      <div className="mx-auto max-w-[1080px]">
        <p className="mb-2.5 text-xs font-semibold tracking-[0.1em] text-oxide uppercase">Archive &amp; renewal</p>
        <div className="mb-9">
          <h2 className="mb-3 max-w-[560px] text-[26px] sm:text-[30px]">What happens after your active period ends</h2>
          <p className="max-w-[520px] text-[15px] text-ink-soft">
            A listing doesn&apos;t just vanish — it moves to a private archive you can bring back anytime within your listing&apos;s archive window,
            without starting over. Here&apos;s an illustration for a business listing, to help you understand how it works:
          </p>
        </div>

        <div className="mb-5 rounded-[10px] border border-line bg-paper px-7 py-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-stretch sm:gap-0">
            {nodes.map((node, i) => (
              <div key={node.day} className="relative flex-1 px-2 text-center">
                {i > 0 && <div className="absolute top-2 left-[-50%] hidden h-0.5 w-full bg-line-soft sm:block" />}
                <div className={`relative z-[2] mx-auto mb-3 h-4 w-4 rounded-full border-[3px] bg-paper ${dotColor[node.state]} ${node.state === "gone" ? "bg-line-soft" : ""}`} />
                <div className="mb-1 font-mono text-[11px] text-ink-soft">{node.day}</div>
                <div className="mb-1 text-[13.5px] font-semibold">{node.label}</div>
                <div className="mx-auto max-w-[180px] text-xs text-ink-soft sm:max-w-none">{node.description}</div>
              </div>
            ))}
          </div>
          <div className="mt-[22px] flex items-start gap-3 rounded-lg border border-dashed border-mustard bg-paper-2 px-[18px] py-4">
            <IconRefresh size={20} className="mt-0.5 shrink-0 text-mustard-dark" />
            <div>
              <h4 className="mb-1 text-sm font-semibold">You can reactivate anytime during the archive window</h4>
              <p className="text-[13px] text-ink-soft">
                Look up your listing with the same mobile number you listed with, then choose how you want to bring it back — reactivate as-is in
                one tap, or update your photos and details first. Either way, it&apos;s the same fee and it&apos;s live again for another 90 days.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-2 mb-0 text-xs font-semibold tracking-[0.1em] text-oxide uppercase">Restoring an archived listing</p>
        <div className="mt-7 grid grid-cols-2 gap-3.5 md:grid-cols-4">
          {steps.map((step) => (
            <div key={step.num} className="rounded-lg border border-line bg-paper-2 p-4">
              <div className="mb-1.5 font-mono text-[11px] font-semibold text-oxide">{step.num}</div>
              <h5 className="mb-1 text-[13px] font-semibold">{step.title}</h5>
              <p className="text-xs text-ink-soft">{step.description}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 flex items-center justify-center gap-1 text-center text-[12.5px] text-ink-soft">
          <IconInfoCircle size={14} /> Equipment, space handover and inventory listings follow this exact same active → archive → reactivate cycle
          — just with different windows.
        </p>
        <p className="mt-1.5 text-center text-[12.5px] font-normal text-oxide">120-day archive window for Business, 30-day for the rest.</p>
        <div className="mt-6.5 text-center">
          <button type="button" onClick={onReactivate} className="rounded-md bg-oxide px-[22px] py-3 text-sm font-semibold text-paper hover:bg-oxide-dark">
            Find &amp; reactivate my listing
          </button>
        </div>
      </div>
    </section>
  );
}
