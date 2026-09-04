export const photoCropperMock = {
  file: new File(['image'], 'dish.png', { type: 'image/png' }),
  isSending: false,
}

export const bannerCropperMock = {
  file: new File(['image'], 'banner.png', { type: 'image/png' }),
  isSending: false,
  aspectRatio: 3,
  hint: 'Arraste para escolher a faixa que aparece no topo da loja.',
  confirmLabel: 'Usar este banner',
}

export const loadedImageSizeMock = { naturalWidth: 1200, naturalHeight: 600 }
