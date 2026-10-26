import type { BrandColors } from '@pages/Units/types/BrandColors.type'
import type { ContrastPair } from '@pages/Units/types/ContrastPair.type'
import { toContrastRatio } from '@pages/Units/utils/toContrastRatio/toContrastRatio'

const READABLE_TEXT = 4.5

export const toLowContrastPairs = (colors: BrandColors): ContrastPair[] => {
  const checks = [
    {
      label: 'Texto sobre o fundo',
      advice: 'Escureça o texto ou clareie o fundo.',
      minimum: READABLE_TEXT,
      ratio: toContrastRatio(colors.textColor, colors.backgroundColor),
    },
    {
      label: 'Texto secundário sobre o fundo',
      advice: 'Descrições e horários ficam ilegíveis assim.',
      minimum: READABLE_TEXT,
      ratio: toContrastRatio(colors.mutedTextColor, colors.backgroundColor),
    },
    {
      label: 'Texto sobre os cartões',
      advice: 'É onde o nome e o preço do produto aparecem.',
      minimum: READABLE_TEXT,
      ratio: toContrastRatio(colors.textColor, colors.cardColor),
    },
  ]

  return checks.filter(({ ratio, minimum }) => ratio < minimum)
}
