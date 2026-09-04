import type { CropArea } from '@shared/types/ui/crop-area'

/** Maior lado gerado — a loja nunca mostra a imagem maior que isso. */
const LONGEST_SIDE = 1080

/**
 * Redesenha a área selecionada num arquivo novo. A área chega em frações do
 * tamanho natural, então serve para qualquer resolução de origem.
 */
export const cropToArea = (
  image: HTMLImageElement,
  { x, y, width, height }: CropArea,
  fileName: string
): Promise<File> => {
  const sourceWidth = image.naturalWidth * width
  const sourceHeight = image.naturalHeight * height
  const scale = Math.min(1, LONGEST_SIDE / Math.max(sourceWidth, sourceHeight))

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(sourceWidth * scale)
  canvas.height = Math.round(sourceHeight * scale)

  const context = canvas.getContext('2d')
  if (!context) return Promise.reject(new Error('canvas indisponível'))

  context.drawImage(
    image,
    x * image.naturalWidth,
    y * image.naturalHeight,
    sourceWidth,
    sourceHeight,
    0,
    0,
    canvas.width,
    canvas.height
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error('não foi possível gerar a imagem'))
        resolve(new File([blob], fileName, { type: 'image/jpeg' }))
      },
      'image/jpeg',
      0.9
    )
  })
}
