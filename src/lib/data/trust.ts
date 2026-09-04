import { trustItems } from "@/data/trust";
import type { TrustItem } from "@/types/listing";

export function getTrustItems(): TrustItem[] {
  return trustItems;
}
