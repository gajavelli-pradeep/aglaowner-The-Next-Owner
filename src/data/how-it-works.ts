import type { HowItWorksColumn, RestoreStep, TimelineNode } from "@/types/listing";

export const howItWorksColumns: HowItWorksColumn[] = [
  {
    tag: "If you're selling",
    variant: "seller",
    steps: [
      { title: "List with photos, video & basic numbers", description: "Category, a few photos, turnover and asking price bands, reason for sale. Takes about 5 minutes." },
      { title: "Verify your mobile number & pay the listing fee", description: "One OTP confirms it's really you. Your number is never shown publicly — only used to manage your listing." },
      { title: "Respond to verified buyers on WhatsApp", description: "When a DigiLocker-verified buyer wants to connect, you decide whether to reply. Nothing happens without your say." },
    ],
  },
  {
    tag: "If you're buying",
    variant: "buyer",
    steps: [
      { title: "Browse by category or search freely", description: "Filter by city and price band, or just search — \"café Koramangala,\" \"playschool under 10L.\"" },
      { title: "Verify your identity to unlock contact", description: "Share one verified ID document via DigiLocker — driving licence, PAN, or similar. We only receive a confirmation, not your document.", badge: "Verified via DigiLocker" },
      { title: "Get connected once the seller responds", description: "Your request is sent to the seller. If they choose to respond, you take it from there — directly, off-platform." },
    ],
  },
];

export const timelineNodes: TimelineNode[] = [
  { day: "Day 1", label: "Listed & live", description: "Visible in search and category browsing for 90 days.", state: "live" },
  { day: "Day 90", label: "Moves to archive", description: "Hidden from public view, but kept safe for 120 days.", state: "archived" },
  { day: "Day 210", label: "Auto-deleted", description: "If not reactivated, the listing and its data are permanently removed.", state: "gone" },
];

export const restoreSteps: RestoreStep[] = [
  { num: "01", title: "Tap \"Find & reactivate\"", description: "From the header or pricing section — no login needed." },
  { num: "02", title: "Enter your mobile number", description: "The same one you used when listing." },
  { num: "03", title: "Verify with OTP", description: "Confirms it's really your listing." },
  { num: "04", title: "Pick it & pay ₹499", description: "Live again instantly for 90 more days." },
];
