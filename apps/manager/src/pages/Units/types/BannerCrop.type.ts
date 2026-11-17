import type { CropArea } from '@shared/types/ui/crop-area'

/** Larguras-base que a vitrine usa para trocar a direção da arte. */
export const BANNER_CROP_PRESETS = [
  { id: 'phone320', label: 'Celular · 320 px', aspectRatio: 5 / 3 },
  { id: 'phone425', label: 'Celular grande · 425 px', aspectRatio: 425 / 192 },
  { id: 'tablet768', label: 'Tablet · 768 px', aspectRatio: 26 / 5 },
  { id: 'desktop1024', label: 'Desktop · 1024 px', aspectRatio: 11 / 2 },
  {
    id: 'desktop1920',
    label: 'Desktop amplo · 1920 × 1080',
    aspectRatio: 36 / 5,
  },
] as const

export type BannerCropId = (typeof BANNER_CROP_PRESETS)[number]['id']
export type BannerCrops = Partial<Record<BannerCropId, CropArea>>
export type BannerVariants = Partial<Record<BannerCropId, string>>
export type BannerVariantFiles = Partial<Record<BannerCropId, File>>
