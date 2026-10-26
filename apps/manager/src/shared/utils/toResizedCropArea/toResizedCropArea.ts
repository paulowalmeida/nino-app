import type { CropArea } from '@shared/types/ui/crop-area'
import type { CropCorner } from '@shared/types/ui/crop-corner'

const MIN_WIDTH = 0.08

type CropResize = {
  area: CropArea
  corner: CropCorner
  /** Deslocamento horizontal do ponteiro, em fração da largura da imagem. */
  deltaX: number
  imageRatio: number
  aspectRatio: number
}

/**
 * Redimensiona o recorte pelo canto arrastado, mantendo a proporção e o canto
 * oposto no lugar. A largura conduz o gesto; a altura vem da proporção.
 */
export const toResizedCropArea = ({
  area,
  corner,
  deltaX,
  imageRatio,
  aspectRatio,
}: CropResize): CropArea => {
  const isEast = corner === 'ne' || corner === 'se'
  const isNorth = corner === 'nw' || corner === 'ne'
  const anchorX = isEast ? area.x : area.x + area.width
  const anchorY = isNorth ? area.y + area.height : area.y

  const roomAcross = isEast ? 1 - anchorX : anchorX
  const roomDown = isNorth ? anchorY : 1 - anchorY
  const widestByHeight = (roomDown * aspectRatio) / imageRatio
  const widest = Math.max(MIN_WIDTH, Math.min(roomAcross, widestByHeight))

  const asked = isEast ? area.width + deltaX : area.width - deltaX
  const width = Math.min(Math.max(asked, MIN_WIDTH), widest)
  const height = (width * imageRatio) / aspectRatio

  return {
    x: isEast ? anchorX : anchorX - width,
    y: isNorth ? anchorY - height : anchorY,
    width,
    height,
  }
}
