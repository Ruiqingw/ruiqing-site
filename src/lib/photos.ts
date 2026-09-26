import type { ImageMetadata } from 'astro';

// Frontmatter keeps paths like "/photos/yunnan/DSC08688.jpg"; the files live in
// src/assets/photos so Astro can resize and re-encode them at build time.
const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/photos/**/*.{jpg,jpeg,JPG,JPEG,png,webp}',
  { eager: true },
);

const byPath = new Map(
  Object.entries(files).map(([key, mod]) => [key.normalize('NFC'), mod.default]),
);

export function getPhoto(src: string): ImageMetadata {
  const key = `/src/assets${src}`.normalize('NFC');
  const photo = byPath.get(key);
  if (!photo) throw new Error(`Photo not found: ${src} (expected ${key})`);
  return photo;
}
