"use client";

import { useCallback, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HomeScreen } from "@/components/sections/HomeScreen";
import { SellBuyPicker } from "@/components/flows/SellBuyPicker";
import { SellForm, type SellFormEditDefaults } from "@/components/flows/SellForm";
import { ConfirmScreen } from "@/components/flows/ConfirmScreen";
import { BuyResults } from "@/components/flows/BuyResults";
import { ListingDetail } from "@/components/flows/ListingDetail";
import { ReactivateLookup } from "@/components/flows/ReactivateLookup";
import { ReactivateList } from "@/components/flows/ReactivateList";
import { EditForm } from "@/components/flows/EditForm";
import { VerifyModal } from "@/components/ui/VerifyModal";
import { Toast } from "@/components/ui/Toast";
import { useToast } from "@/lib/useToast";
import { getSampleListing, getConfirmFlyer } from "@/lib/data/listings";
import type { Screen } from "@/lib/screens";
import type { ListingType, MyListing, PricingPlan } from "@/types/listing";

interface SelectedCategory {
  name: string;
  icon: string;
}

const HOME: SelectedCategory = { name: "", icon: "" };

export function AglaownerApp() {
  const [history, setHistory] = useState<Screen[]>(["home"]);
  const [category, setCategory] = useState<SelectedCategory>(HOME);
  const [sellType, setSellType] = useState<ListingType>("business");
  const [buyType, setBuyType] = useState<ListingType>("business");
  const [detailIndex, setDetailIndex] = useState(0);
  const [editingListing, setEditingListing] = useState<MyListing | null>(null);
  const [addedEquipOnSell, setAddedEquipOnSell] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { message, show, showToast } = useToast();

  const screen = history[history.length - 1];
  const isFlow = screen !== "home";

  const goTo = useCallback((next: Screen) => {
    setHistory((prev) => (prev[prev.length - 1] === next ? prev : [...prev, next]));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goBack = useCallback(() => {
    setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goHome = useCallback(() => {
    setHistory((prev) => (prev[prev.length - 1] === "home" ? prev : [...prev, "home"]));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  function startSell() {
    setSellType("business");
    goTo("sell-category");
  }

  function browseCategory(name: string) {
    setCategory({ name, icon: "ti-tag" });
    setBuyType("business");
    goTo("buy-results");
  }

  function browseAllCategories() {
    setCategory({ name: "All categories", icon: "ti-grid-dots" });
    setBuyType("business");
    goTo("buy-results");
  }

  function handleSellPick(name: string, icon: string) {
    setCategory({ name, icon });
    setEditingListing(null);
    if (sellType === "business") goTo("sell-form");
    else if (sellType === "equipment") goTo("sell-equipment-form");
    else if (sellType === "lease") goTo("sell-lease-form");
    else goTo("sell-inventory-form");
  }

  function handleBuyPick(name: string, icon: string) {
    setCategory({ name, icon });
    goTo("buy-results");
  }

  function handlePricingCta(target: PricingPlan["ctaScreen"]) {
    if (target === "reactivate-lookup") goTo("reactivate-lookup");
    else {
      setSellType("business");
      goTo("sell-category");
    }
  }

  function openListing(index: number) {
    setDetailIndex(index);
    goTo("listing-detail");
  }

  function handleEditListing(listing: MyListing) {
    setEditingListing(listing);
    if (listing.type === "business") {
      goTo("edit-form");
    } else {
      // Equipment/lease/inventory reactivation reuses the type's own sell form, pre-filled for editing.
      setCategory({ name: "Food & Beverage", icon: "ti-coffee" });
      if (listing.type === "equipment") goTo("sell-equipment-form");
      else if (listing.type === "lease") goTo("sell-lease-form");
      else goTo("sell-inventory-form");
    }
  }

  const nonBusinessEditDefaults: SellFormEditDefaults | undefined = editingListing && editingListing.type !== "business"
    ? {
        mode: "reactivate",
        amount: editingListing.reactivatePrice ?? "",
        amountNote: "save your edits, then live for 60 days",
        submitLabel: `Save & pay ${editingListing.reactivatePrice} to go live`,
        hideMobile: true,
      }
    : undefined;

  const businessFlyer = getConfirmFlyer("business")!;
  const equipmentFlyer = getConfirmFlyer("equipment")!;
  const leaseFlyer = getConfirmFlyer("lease")!;
  const inventoryFlyer = getConfirmFlyer("inventory")!;

  return (
    <>
      <Header
        isFlow={isFlow}
        onLogoClick={goHome}
        onNavigate={(s) => {
          if (s === "sell-category") startSell();
          else goTo(s);
        }}
        onBack={goBack}
      />

      <main className="flex-1">
        {screen === "home" && (
          <HomeScreen
            onSell={startSell}
            onBuy={() => goTo("buy-category")}
            onReactivate={() => goTo("reactivate-lookup")}
            onCategory={browseCategory}
            onAllCategories={browseAllCategories}
            onPricingCta={handlePricingCta}
          />
        )}

        {screen === "sell-category" && (
          <SellBuyPicker mode="sell" type={sellType} onTypeChange={setSellType} heading="What are you selling?" onSelect={handleSellPick} />
        )}

        {screen === "sell-form" && (
          <SellForm
            type="business"
            categoryName={category.name || "Café / restaurant"}
            categoryIcon={category.icon || "ti-tag"}
            onToast={showToast}
            onSubmit={(addedEquip) => {
              setAddedEquipOnSell(addedEquip);
              goTo("sell-confirm");
            }}
          />
        )}

        {screen === "sell-confirm" && (
          <ConfirmScreen
            body={`It's now visible to buyers browsing ${category.name || "Café / restaurant"} listings. We'll notify you on WhatsApp when a verified buyer wants to connect.`}
            refLines={[
              { k: "Reference", v: "AGL-7K21" },
              { k: "Active until", v: "90 days from today" },
              { k: "Reactivate anytime", v: "via your mobile number" },
            ]}
            shareIntro={addedEquipOnSell ? "Spread the word — switch between listings to share either flyer" : undefined}
            flyer={businessFlyer}
            flyerAlt={addedEquipOnSell ? { business: businessFlyer, equipment: equipmentFlyer } : undefined}
            onToast={showToast}
            onHome={goHome}
          />
        )}

        {screen === "sell-equipment-form" && (
          <SellForm
            type="equipment"
            categoryName={category.name || "Food & Beverage"}
            categoryIcon={category.icon || "ti-coffee"}
            editDefaults={nonBusinessEditDefaults}
            onToast={showToast}
            onSubmit={() => goTo(editingListing?.type === "equipment" ? "equip-reactivate-confirm" : "equipment-confirm")}
          />
        )}

        {screen === "equipment-confirm" && (
          <ConfirmScreen
            body={`It's now visible to buyers browsing ${category.name || "Food & Beverage"} equipment & assets. We'll notify you on WhatsApp when a buyer wants to connect.`}
            refLines={[
              { k: "Reference", v: "AGL-E482" },
              { k: "Active until", v: "60 days from today" },
              { k: "Reactivate anytime", v: "via your mobile number" },
            ]}
            flyer={equipmentFlyer}
            onToast={showToast}
            onHome={goHome}
          />
        )}

        {screen === "equip-reactivate-confirm" && (
          <ConfirmScreen
            reactivated
            body={`"${equipmentFlyer.title}" is back in search and category results. Everything from before — photos, description, price — carried over as-is.`}
            refLines={[
              { k: "Reference", v: "AGL-E203" },
              { k: "Active until", v: "60 days from today" },
              { k: "Times reactivated", v: "1" },
            ]}
            flyer={{ ...equipmentFlyer, ref: "AGL-E203" }}
            onToast={showToast}
            onHome={goHome}
          />
        )}

        {screen === "sell-lease-form" && (
          <SellForm
            type="lease"
            categoryName={category.name || "Food & Beverage"}
            categoryIcon={category.icon || "ti-coffee"}
            editDefaults={nonBusinessEditDefaults}
            onToast={showToast}
            onSubmit={() => goTo(editingListing?.type === "lease" ? "lease-reactivate-confirm" : "lease-confirm")}
          />
        )}

        {screen === "lease-confirm" && (
          <ConfirmScreen
            body={`It's now visible to buyers browsing ${category.name || "Food & Beverage"} space handovers. We'll notify you on WhatsApp when someone wants to connect.`}
            refLines={[
              { k: "Reference", v: "AGL-L317" },
              { k: "Active until", v: "60 days from today" },
              { k: "Reactivate anytime", v: "via your mobile number" },
            ]}
            shareIntro="Spread the word — every share helps it move faster"
            flyer={leaseFlyer}
            onToast={showToast}
            onHome={goHome}
          />
        )}

        {screen === "lease-reactivate-confirm" && (
          <ConfirmScreen
            reactivated
            body={`"Fitted café space, Koramangala" is back in search and category results. Everything from before — photos, description, price — carried over as-is.`}
            refLines={[
              { k: "Reference", v: "AGL-L317" },
              { k: "Active until", v: "60 days from today" },
              { k: "Times reactivated", v: "1" },
            ]}
            flyer={{ ...leaseFlyer, title: "Fitted café space, Koramangala" }}
            onToast={showToast}
            onHome={goHome}
          />
        )}

        {screen === "sell-inventory-form" && (
          <SellForm
            type="inventory"
            categoryName={category.name || "Food & Beverage"}
            categoryIcon={category.icon || "ti-coffee"}
            editDefaults={nonBusinessEditDefaults}
            onToast={showToast}
            onSubmit={() => goTo(editingListing?.type === "inventory" ? "inventory-reactivate-confirm" : "inventory-confirm")}
          />
        )}

        {screen === "inventory-confirm" && (
          <ConfirmScreen
            body={`It's now visible to buyers browsing ${category.name || "Food & Beverage"} inventory & stock lots. We'll notify you on WhatsApp when a buyer wants to connect.`}
            refLines={[
              { k: "Reference", v: "AGL-I624" },
              { k: "Active until", v: "60 days from today" },
              { k: "Reactivate anytime", v: "via your mobile number" },
            ]}
            shareIntro="Spread the word — every share helps it clear faster"
            flyer={inventoryFlyer}
            onToast={showToast}
            onHome={goHome}
          />
        )}

        {screen === "inventory-reactivate-confirm" && (
          <ConfirmScreen
            reactivated
            body={`"${inventoryFlyer.title}" is back in search and category results. Everything from before — photos, description, price — carried over as-is.`}
            refLines={[
              { k: "Reference", v: "AGL-I624" },
              { k: "Active until", v: "60 days from today" },
              { k: "Times reactivated", v: "1" },
            ]}
            flyer={inventoryFlyer}
            onToast={showToast}
            onHome={goHome}
          />
        )}

        {screen === "buy-category" && (
          <SellBuyPicker mode="buy" type={buyType} onTypeChange={setBuyType} heading="What are you looking to buy?" onSelect={handleBuyPick} />
        )}

        {screen === "buy-results" && (
          <BuyResults
            type={buyType}
            categoryLabel={
              category.name === "All categories"
                ? "All business listings"
                : `${category.name || "Café / restaurant"}${
                    buyType === "equipment" ? " equipment & assets" : buyType === "lease" ? " lease & goodwill transfers" : buyType === "inventory" ? " inventory & stock" : " listings"
                  }`
            }
            onTypeChange={(t) => {
              setBuyType(t);
              goTo("buy-results");
            }}
            onOpen={openListing}
          />
        )}

        {screen === "listing-detail" && (
          <ListingDetail
            type={buyType}
            listing={getSampleListing(buyType, detailIndex) ?? getSampleListing("business", 0)!}
            onConnect={() => setModalOpen(true)}
          />
        )}

        {screen === "reactivate-lookup" && <ReactivateLookup onContinue={() => goTo("reactivate-list")} />}

        {screen === "reactivate-list" && (
          <ReactivateList
            onEdit={handleEditListing}
            onReactivateAsIs={(listing) => {
              setEditingListing(listing);
              goTo(listing.reactivateScreen as Screen);
            }}
          />
        )}

        {screen === "edit-form" && editingListing && (
          <EditForm listing={editingListing} onToast={showToast} onSubmit={() => goTo(editingListing.status === "active" ? "edit-confirm" : "reactivate-confirm")} />
        )}

        {screen === "edit-confirm" && (
          <div className="mx-auto max-w-[440px] px-6 py-14 text-center">
            <div className="mx-auto mb-[22px] flex h-[110px] w-[110px] -rotate-6 items-center justify-center rounded-full border-[3px] border-dashed border-stamp-green">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stamp-green">
                <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="mb-2.5 text-[22px]">Your changes are saved</h2>
            <p className="mb-[22px] text-sm text-ink-soft">
              &ldquo;{editingListing?.title ?? "Your listing"}&rdquo; is still live with your updates. Your 90-day timer doesn&apos;t change.
            </p>
            <button
              type="button"
              onClick={goHome}
              className="inline-flex items-center gap-2 rounded-md border-2 border-ink bg-transparent px-[30px] py-[15px] text-[15px] font-semibold text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Back to home
            </button>
          </div>
        )}

        {screen === "reactivate-confirm" && (
          <ConfirmScreen
            reactivated
            body={`"${editingListing?.title ?? "Cloud kitchen, multi-cuisine"}" is back in search and category results. Everything from before — photos, description, price — carried over as-is.`}
            refLines={[
              { k: "Reference", v: editingListing?.ref ?? "AGL-3P09" },
              { k: "Active until", v: "90 days from today" },
              { k: "Times reactivated", v: "1" },
            ]}
            flyer={{
              title: editingListing?.title ?? "Cloud kitchen, multi-cuisine",
              price: "₹4L–6L",
              loc: "Hyderabad, Telangana",
              highlight: "2 years running · strong delivery-app presence",
              icon: editingListing?.icon ?? "ti-coffee",
              ref: editingListing?.ref ?? "AGL-3P09",
              filename: "cloud-kitchen-hyderabad",
            }}
            onToast={showToast}
            onHome={goHome}
          />
        )}
      </main>

      <Footer onCategory={browseCategory} onAllCategories={browseAllCategories} />

      <VerifyModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <Toast message={message} show={show} />
    </>
  );
}
