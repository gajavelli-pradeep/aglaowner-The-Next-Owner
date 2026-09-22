/** Media caps + client-side image compression for listing uploads. See requirements/AUDIT.md-style rationale: storage math (30GB budget) makes video the real constraint, not photos. */

// One number to change if the storage budget or provider changes.
export const MAX_VIDEO_MB = 20;
export const MAX_VIDEO_SECONDS = 45;

const IMAGE_MAX_DIMENSION = 1800;
const IMAGE_QUALITY = 0.8;

/** Resizes to IMAGE_MAX_DIMENSION on the longest side and re-encodes as JPEG at IMAGE_QUALITY -- typically cuts a phone photo from several MB to a few hundred KB with no visible quality loss. */
export async function compressImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, IMAGE_MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file; // no canvas support -- fail open with the original file rather than blocking the upload

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", IMAGE_QUALITY));
  if (!blob || blob.size >= file.size) return file; // compression didn't actually help (rare, e.g. already-tiny image) -- keep the original

  return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" });
}

/** Reads real video duration via a hidden <video> element -- file.size alone doesn't catch a short-but-huge-bitrate clip vs a long-but-small one. */
export function validateVideo(file: File): Promise<string | null> {
  const sizeMb = file.size / (1024 * 1024);
  if (sizeMb > MAX_VIDEO_MB) {
    return Promise.resolve(`Video is ${sizeMb.toFixed(1)}MB -- please keep videos under ${MAX_VIDEO_MB}MB.`);
  }
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      if (video.duration > MAX_VIDEO_SECONDS) {
        resolve(`Video is ${Math.round(video.duration)}s -- please keep videos under ${MAX_VIDEO_SECONDS} seconds.`);
      } else {
        resolve(null);
      }
    };
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      resolve(null); // couldn't read metadata -- fail open, the size check above already ran
    };
    video.src = URL.createObjectURL(file);
  });
}
