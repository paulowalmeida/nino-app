import type { BrandAssetSlotProps } from './BrandAssetSlot'

export const brandAssetSlotMock: Omit<BrandAssetSlotProps, 'onCropped'> = {
  label: 'Banner',
  helperText: 'Horizontal, 3:1 · até 4 MB',
  triggerLabel: 'Escolher banner',
  framingTitle: 'Enquadrar o banner',
  framingHint: 'Arraste para escolher a faixa que aparece no topo da loja.',
  confirmLabel: 'Usar este banner',
  aspectRatio: 3,
}
