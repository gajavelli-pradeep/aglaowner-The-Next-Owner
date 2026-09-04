import { getTrustItems } from "@/lib/data/trust";

export function TrustStrip() {
  const items = getTrustItems();
  return (
    <div className="border-t border-b border-line bg-paper-2">
      <div className="mx-auto grid max-w-[1080px] grid-cols-1 gap-6 px-6 py-[30px] md:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex items-start gap-3.5">
              <Icon size={24} className="mt-0.5 shrink-0 text-stamp-green" stroke={1.75} />
              <div>
                <h4 className="mb-[3px] text-sm font-semibold">{item.title}</h4>
                <p className="text-[12.5px] text-ink-soft">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
