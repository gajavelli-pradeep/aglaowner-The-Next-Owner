import type { FaqItem } from "@/types/listing";

export const faqItems: FaqItem[] = [
  {
    question: "Why DigiLocker for buyer verification?",
    answer:
      "DigiLocker is the Government of India's digital document wallet. Sharing a document through it takes one tap, doesn't require you to upload or photograph anything, and gives sellers a genuine trust signal — without aglaowner ever storing your ID document.",
    openByDefault: true,
  },
  {
    question: "Does aglaowner verify the business itself?",
    answer:
      "No. We verify that the seller is a real, contactable person and that the buyer is a real, identity-checked person. Business details — licences, financials, legacy — should still be confirmed directly between buyer and seller.",
  },
  {
    question: "Can I list equipment or assets instead of a whole business?",
    answer:
      "Yes. Equipment & assets listings — ovens, salon chairs, gym machines, furniture, and similar items — are ₹149 for 60 days, using the same photo, video and WhatsApp connect flow as a business listing. If you're already listing a business for sale, you can add an equipment listing to the same submission for the same flat fee, right from that form.",
  },
  {
    question: "What's a space handover?",
    answer:
      "It's for handing over your space to a new tenant — not the business itself. Your landlord skips the search for a next tenant, and many buyers are glad to take furniture or fixtures off your hands too, saving everyone the cost and hassle of moving them out. Listings are ₹399 for 60 days, using the same flow as every other listing type.",
  },
  {
    question: "Can I list excess stock or dead inventory?",
    answer:
      "Yes. Inventory & stock listings are for clearing a whole lot at once — season-end stock, over-ordered batches, closing-down lots — rather than selling item by item. One listing, one price for the lot. It's ₹249 for 60 days, the same photo/video/WhatsApp connect flow as everything else on aglaowner.",
  },
  {
    question: "What happens if I don't reactivate an archived listing?",
    answer:
      "It stays safely archived for a while after going inactive — 120 days for a business listing, and 30 days for equipment, space handover or inventory listings. If it isn't reactivated within that window, the listing and its data are permanently deleted from our systems.",
  },
  {
    question: "Can I edit my listing after it's live?",
    answer: "Yes — look it up with your mobile number and OTP anytime during its active period to update photos, price band, or description.",
  },
  {
    question: "Do you take a cut if the business sells?",
    answer: "No. The listing fee is the only charge. Any negotiation, payment or handover happens directly between buyer and seller, off-platform.",
  },
];
