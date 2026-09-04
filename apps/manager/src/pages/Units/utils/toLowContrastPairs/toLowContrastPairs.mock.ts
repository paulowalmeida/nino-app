import type { BrandColors } from '@pages/Units/types/BrandColors.type'

export const readableColorsMock: BrandColors = {
  primaryColor: '#FF6B00',
  secondaryColor: '#2D1B0E',
  tertiaryColor: '#FFF3E8',
  backgroundColor: '#FFFFFF',
  textColor: '#241A12',
  cardColor: '#FFF9F4',
  borderColor: '#E7D8C7',
  mutedTextColor: '#6B5C4E',
}

export const washedOutColorsMock: BrandColors = {
  ...readableColorsMock,
  textColor: '#E8E8E8',
  mutedTextColor: '#F0F0F0',
}
