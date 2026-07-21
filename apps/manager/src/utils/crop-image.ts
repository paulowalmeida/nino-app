import type { CropArea } from '@custom_types/ui'

/** Lado do quadrado gerado — o cardápio nunca mostra a foto maior que isso. */
const OUTPUT = 1080

/**
 * Redesenha o recorte visível num quadrado de 1080px. O enquadramento é o
 * mesmo que a pessoa viu: a moldura é quadrada, a imagem cobre a moldura e o
 * arraste move o centro.
 */
export const cropToSquare = (
  image: HTMLImageElement,
  { offsetX, offsetY, zoom }: CropArea,
  fileName: string
): Promise<File> => {
  const canvas = document.createElement('canvas')
  canvas.width = OUTPUT
  canvas.height = OUTPUT

  const context = canvas.getContext('2d')
  if (!context) return Promise.reject(new Error('canvas indisponível'))

  const cover = Math.max(
    OUTPUT / image.naturalWidth,
    OUTPUT / image.naturalHeight
  )
  const scale = cover * zoom
  const width = image.naturalWidth * scale
  const height = image.naturalHeight * scale

  context.drawImage(
    image,
    (OUTPUT - width) / 2 + offsetX * OUTPUT,
    (OUTPUT - height) / 2 + offsetY * OUTPUT,
    width,
    height
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
