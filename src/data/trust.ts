import { IconDeviceMobileMessage, IconShieldCheck, IconReceipt2 } from "@tabler/icons-react";
import type { TrustItem } from "@/types/listing";

export const trustItems: TrustItem[] = [
  {
    icon: IconDeviceMobileMessage,
    title: "Sellers verified by mobile OTP",
    description: "Every listing is tied to a real, confirmed mobile number before it goes live.",
  },
  {
    icon: IconShieldCheck,
    title: "Buyers verified via DigiLocker",
    description: "A government-backed identity check, done with one tap, before any contact details are shared.",
  },
  {
    icon: IconReceipt2,
    title: "Flat fee, no commission",
    description: "You pay once to list. What you agree on with a buyer or seller is between the two of you.",
  },
];
