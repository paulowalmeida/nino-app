import type { StorefrontPreviewProps } from './StorefrontPreview'

export const storefrontPreviewMock: Omit<
  StorefrontPreviewProps,
  'onDeviceChange'
> = {
  storeName: 'Unidade Centro',
  device: 'mobile',
  colors: {
    primaryColor: '#FF6B00',
    secondaryColor: '#2D1B0E',
    tertiaryColor: '#FFF3E8',
    backgroundColor: '#FFFFFF',
    textColor: '#241A12',
    cardColor: '#FFF9F4',
    borderColor: '#E7D8C7',
    mutedTextColor: '#7A6A5B',
  },
}
