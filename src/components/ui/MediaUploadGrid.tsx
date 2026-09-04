"use client";

import { useRef, useState } from "react";
import { IconPhoto, IconVideo, IconStar, IconX, IconCameraPlus } from "@tabler/icons-react";

interface Slot {
  type: "photo" | "video";
  url: string | null;
}

const PHOTO_SLOTS = 8;
const VIDEO_SLOTS = 2;

function initialSlots(): Slot[] {
  return [
    ...Array.from({ length: PHOTO_SLOTS }, () => ({ type: "photo" as const, url: null })),
    ...Array.from({ length: VIDEO_SLOTS }, () => ({ type: "video" as const, url: null })),
  ];
}

/** .media-grid + .uploadbox — real file picker, cover selection, and slot removal (blob URLs, no upload backend). */
export function MediaUploadGrid({ onToast }: { onToast: (msg: string) => void }) {
  const [slots, setSlots] = useState<Slot[]>(initialSlots);
  const [coverIndex, setCoverIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingType = useRef<"photo" | "video">("photo");

  function openPicker(type: "photo" | "video") {
    const hasFreeSlot = slots.some((s) => s.type === type && !s.url);
    if (!hasFreeSlot) {
      onToast(`You've used all ${type === "photo" ? PHOTO_SLOTS + " photo" : VIDEO_SLOTS + " video"} slots`);
      return;
    }
    pendingType.current = type;
    if (inputRef.current) {
      inputRef.current.accept = type === "video" ? "video/*" : "image/*";
      inputRef.current.click();
    }
  }

  function handleUploadBoxClick() {
    const nextPhoto = slots.findIndex((s) => s.type === "photo" && !s.url);
    if (nextPhoto !== -1) return openPicker("photo");
    const nextVideo = slots.findIndex((s) => s.type === "video" && !s.url);
    if (nextVideo !== -1) return openPicker("video");
    onToast("You've used all 8 photo and 2 video slots");
  }

  function handleFiles(fileList: FileList | null) {
    if (!fileList || !fileList.length) return;
    const type = pendingType.current;
    const files = Array.from(fileList).filter((f) => (type === "video" ? f.type.startsWith("video/") : f.type.startsWith("image/")));
    if (!files.length) return;

    setSlots((prev) => {
      const next = [...prev];
      const emptyIndexes = next.map((s, i) => (s.type === type && !s.url ? i : -1)).filter((i) => i !== -1);
      files.slice(0, emptyIndexes.length).forEach((file, i) => {
        next[emptyIndexes[i]] = { type, url: URL.createObjectURL(file) };
      });
      if (files.length > emptyIndexes.length) {
        onToast(`Only ${emptyIndexes.length} more ${type} slot(s) available`);
      }
      return next;
    });

    setCoverIndex((prevCover) => {
      if (prevCover !== null || type !== "photo") return prevCover;
      const firstNewPhoto = slots.findIndex((s) => s.type === "photo" && !s.url);
      return firstNewPhoto !== -1 ? firstNewPhoto : prevCover;
    });
  }

  function removeSlot(index: number) {
    setSlots((prev) => {
      const slot = prev[index];
      if (slot.url) URL.revokeObjectURL(slot.url);
      const next = [...prev];
      next[index] = { type: slot.type, url: null };
      return next;
    });
    setCoverIndex((prevCover) => {
      if (prevCover !== index) return prevCover;
      const nextPhoto = slots.findIndex((s, i) => i !== index && s.type === "photo" && s.url);
      return nextPhoto !== -1 ? nextPhoto : null;
    });
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <div className="mb-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
        {slots.map((slot, i) => {
          const isCover = coverIndex === i;
          return (
            <div
              key={i}
              className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-md border-line bg-paper-2 ${
                slot.url ? "border" : "border-[1.5px] border-dashed"
              } ${isCover ? "border-2 !border-oxide" : ""}`}
            >
              {slot.url ? (
                slot.type === "video" ? (
                  <video src={slot.url} muted playsInline className="h-full w-full object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={slot.url} alt="" className="h-full w-full object-cover" />
                )
              ) : (
                <>{slot.type === "video" ? <IconVideo size={22} className="text-ink-soft" /> : <IconPhoto size={22} className="text-ink-soft" />}</>
              )}
              {slot.url && (
                <button
                  type="button"
                  aria-label="Remove"
                  onClick={() => removeSlot(i)}
                  className="absolute top-[3px] right-[3px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-ink text-[11px] leading-none text-paper"
                >
                  <IconX size={11} />
                </button>
              )}
              {slot.url && slot.type === "photo" && (
                <button
                  type="button"
                  aria-label="Set as flyer cover"
                  title="Set as flyer cover"
                  onClick={() => setCoverIndex(i)}
                  className={`absolute bottom-[3px] right-[3px] flex h-[18px] w-[18px] items-center justify-center rounded-full text-[10px] leading-none ${
                    isCover ? "bg-oxide text-paper" : "bg-ink/55 text-paper"
                  }`}
                >
                  <IconStar size={10} />
                </button>
              )}
              {isCover && (
                <span className="absolute top-[3px] left-[3px] rounded-[3px] bg-oxide px-[5px] py-0.5 text-[7px] font-bold tracking-[0.03em] text-paper uppercase">
                  Cover
                </span>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-[-2px] mb-2.5 flex items-center gap-1.5 text-[11px] text-ink-soft">
        <IconStar size={12} className="text-oxide" /> Tap the star on any photo to set it as your flyer&apos;s cover — first photo added is the cover by default.
      </p>
      <button
        type="button"
        onClick={handleUploadBoxClick}
        className="w-full rounded-md border-2 border-dashed border-line bg-paper-2 p-7 text-center transition-[border-color,background-color] duration-150 hover:border-stamp-green hover:bg-[#eef2ea]"
      >
        <IconCameraPlus size={28} className="mx-auto mb-2 text-line" />
        <p className="text-[13px] text-ink-soft">Tap here to add photos or a video</p>
        <span className="text-[11px] text-ink-soft">Up to 8 images &amp; 2 videos (30 secs each)</span>
      </button>
    </div>
  );
}
