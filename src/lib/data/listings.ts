import { sampleListings, confirmFlyerData, demoReferrer, myListings } from "@/data/listings";
import type { ConfirmFlyerData, ListingType, MyListing, SampleListing } from "@/types/listing";

export function getSampleListings(type: ListingType): SampleListing[] {
  return sampleListings[type];
}

export function getSampleListing(type: ListingType, index: number): SampleListing | undefined {
  return sampleListings[type]?.[index];
}

export function getConfirmFlyer(type: string): ConfirmFlyerData | undefined {
  return confirmFlyerData[type];
}

export function getDemoReferrer() {
  return demoReferrer;
}

export function getMyListings(): MyListing[] {
  return myListings;
}
