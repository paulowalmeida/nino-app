import type { CropArea } from '@shared/types/ui/crop-area'

/**
 * Maior recorte possível na proporção pedida, centrado na imagem. Serve como
 * ponto de partida antes da pessoa escolher a área.
 */
export const toCenteredCropArea = (
  imageRatio: number,
  aspectRatio: number
): CropArea => {
  const isImageWider = imageRatio > aspectRatio
  const width = isImageWider ? aspectRatio / imageRatio : 1
  const height = isImageWider ? 1 : imageRatio / aspectRatio

  return { x: (1 - width) / 2, y: (1 - height) / 2, width, height }
}
