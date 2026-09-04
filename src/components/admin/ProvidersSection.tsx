"use client";

import { useState } from "react";
import { IconCircleCheck, IconFileInvoice } from "@tabler/icons-react";
import { iconFor } from "@/lib/tablerIconMap";
import { getVoucherProviderConnects } from "@/lib/data/admin";

type ConnectState = { open: boolean; env: "Sandbox" | "Live"; connected: boolean };

/** #sec-providers — voucher provider cards with expandable connect forms; connect is in-memory only. */
export function ProvidersSection({ onToast }: { onToast: (msg: string) => void }) {
  const providers = getVoucherProviderConnects();
  const [state, setState] = useState<Record<string, ConnectState>>(() =>
    Object.fromEntries(providers.map((p) => [p.id, { open: false, env: "Sandbox" as const, connected: false }]))
  );

  function toggleOpen(id: string) {
    setState((prev) => ({ ...prev, [id]: { ...prev[id], open: !prev[id].open } }));
  }

  function setEnv(id: string, env: "Sandbox" | "Live") {
    setState((prev) => ({ ...prev, [id]: { ...prev[id], env } }));
  }

  function connect(id: string) {
    setState((prev) => ({ ...prev, [id]: { ...prev[id], connected: true } }));
    onToast("Connection saved — this is a prototype, no real API call was made");
  }

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[23px] font-semibold">Voucher Providers</h1>
          <p className="mt-[3px] text-[13px] text-ink-soft">Connect the platform you use to bulk-purchase Amazon, Zomato &amp; BookMyShow vouchers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2">
        {providers.map((p) => {
          const Icon = iconFor(p.icon);
          const s = state[p.id];
          return (
            <div key={p.id} className="rounded-lg border border-line bg-paper p-5">
              <div className="mb-1.5 flex items-start justify-between">
                <div className="flex items-center gap-[9px] text-[14.5px] font-semibold">
                  <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[7px] border border-line bg-paper-2">
                    <Icon size={16} className="text-stamp-green" stroke={1.75} />
                  </div>
                  {p.name}
                </div>
              </div>
              <p className="mb-3.5 text-xs text-ink-soft">{p.description}</p>
              <button className="text-[12.5px] font-semibold text-navyblue hover:underline" onClick={() => toggleOpen(p.id)}>
                {p.connectLabel}
              </button>

              {s.open && (
                <div className="mt-3 border-t border-dashed border-line pt-3.5">
                  {p.hasEnvToggle && (
                    <div className="mb-3 flex gap-2">
                      {(["Sandbox", "Live"] as const).map((env) => (
                        <div
                          key={env}
                          role="button"
                          tabIndex={0}
                          onClick={() => setEnv(p.id, env)}
                          className={`flex-1 rounded-[5px] border px-2 py-2 text-center text-xs font-semibold ${
                            s.env === env ? "border-ink bg-ink text-paper" : "border-line bg-paper-2 text-ink-soft"
                          }`}
                        >
                          {env}
                        </div>
                      ))}
                    </div>
                  )}
                  {p.fields.map((f) => (
                    <div key={f.label} className="mb-2.5">
                      <label className="mb-1.5 block text-xs font-semibold text-ink-soft">{f.label}</label>
                      <input
                        type={f.type}
                        placeholder={f.placeholder}
                        className="w-full rounded-[5px] border border-line bg-paper-2 px-[11px] py-[9px] text-[13px] text-ink"
                      />
                    </div>
                  ))}
                  <button
                    className="mt-1 w-full rounded-[5px] bg-oxide py-[10px] text-[13px] font-semibold text-paper hover:bg-oxide-dark"
                    onClick={() => connect(p.id)}
                  >
                    Save &amp; test connection
                  </button>
                </div>
              )}

              {s.connected && (
                <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-stamp-green">
                  <IconCircleCheck size={14} stroke={1.75} /> Connected — last synced just now
                </div>
              )}

              <div className="mt-2.5 flex gap-1.5 border-t border-line-soft pt-2.5 text-[11px] text-ink-soft">
                <IconFileInvoice size={14} className="shrink-0 text-mustard-dark" stroke={1.75} />
                {p.gstNote}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
