/**
 * A tinta que assenta sobre uma cor escolhida pelo lojista: branca sobre
 * fundo fechado, escura sobre fundo claro.
 *
 * Existe porque a cor da loja é livre. Um catálogo filtrado por contraste
 * resolveria a legibilidade tirando opção — e tiraria o laranja do próprio
 * nino, que marca 2.86:1 contra branco. Aqui a escolha continua inteira e
 * quem se adapta é o texto.
 *
 * O limite sai da luminância relativa (WCAG), não do brilho ingênuo
 * `(r+g+b)/3`: verde e azul de mesma intensidade não pesam igual no olho, e
 * a média faria um amarelo pedir texto branco.
 */

const WHITE_INK = '#FFFFFF'
const DARK_INK = '#1A1206'
const LIGHT_SURFACE_THRESHOLD = 0.55

const channelToLinear = (channel: number) => {
  const unit = channel / 255
  return unit <= 0.04045 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4
}

const relativeLuminance = (hex: string) => {
  const value = hex.replace('#', '')
  const red = parseInt(value.slice(0, 2), 16)
  const green = parseInt(value.slice(2, 4), 16)
  const blue = parseInt(value.slice(4, 6), 16)

  return (
    0.2126 * channelToLinear(red) +
    0.7152 * channelToLinear(green) +
    0.0722 * channelToLinear(blue)
  )
}

export const readableInk = (backgroundHex: string) =>
  relativeLuminance(backgroundHex) > LIGHT_SURFACE_THRESHOLD
    ? DARK_INK
    : WHITE_INK
