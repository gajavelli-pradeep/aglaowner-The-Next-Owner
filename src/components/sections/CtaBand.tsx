export function CtaBand({ onSell, onBuy }: { onSell: () => void; onBuy: () => void }) {
  return (
    <section className="px-6 py-11 sm:py-16">
      <div className="mx-auto max-w-[1080px]">
        <div className="flex flex-wrap items-center justify-between gap-5 rounded-[10px] bg-ink px-7 py-11 text-left text-paper">
          <div>
            <h2 className="mb-1.5 text-2xl">Ready to list, or just looking?</h2>
            <p className="text-sm text-[#c9c4b4]">Listing takes 5 minutes. Browsing takes none.</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button type="button" onClick={onSell} className="rounded-[5px] bg-oxide px-6 py-3.5 text-sm font-semibold text-paper hover:bg-oxide-dark">
              Sell your business
            </button>
            <button
              type="button"
              onClick={onBuy}
              className="rounded-[5px] border border-[#565049] px-6 py-3.5 text-sm font-semibold text-paper hover:bg-ink"
            >
              Buy a business
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
