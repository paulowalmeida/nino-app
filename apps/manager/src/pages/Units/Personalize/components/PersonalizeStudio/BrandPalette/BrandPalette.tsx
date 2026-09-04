import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import type { BrandColors } from '@pages/Units/types/BrandColors.type'

import { StudioSection } from '../StudioSection/StudioSection'
import { ColorField } from './ColorField/ColorField'
import { ContrastNotice } from './ContrastNotice/ContrastNotice'

import styles from './BrandPalette.module.css'

export type BrandPaletteProps = {
  colors: BrandColors
  onChange: (colors: Partial<BrandColors>) => void
}

type ColorEntry = {
  key: keyof BrandColors
  label: string
  hint: string
}

const IDENTITY_COLORS: ColorEntry[] = [
  {
    key: 'primaryColor',
    label: 'Primária',
    hint: 'Botão da sacola, preços e destaques',
  },
  {
    key: 'secondaryColor',
    label: 'Secundária',
    hint: 'Nome da loja e títulos',
  },
  {
    key: 'tertiaryColor',
    label: 'Realce',
    hint: 'Fundo do cabeçalho e texto sobre a primária',
  },
]

const SURFACE_COLORS: ColorEntry[] = [
  {
    key: 'backgroundColor',
    label: 'Fundo',
    hint: 'A tela inteira do cardápio',
  },
  { key: 'cardColor', label: 'Cartões', hint: 'Fundo de cada item' },
  { key: 'borderColor', label: 'Bordas', hint: 'Linhas que separam blocos' },
  { key: 'textColor', label: 'Texto', hint: 'Nome e descrição dos itens' },
  {
    key: 'mutedTextColor',
    label: 'Texto secundário',
    hint: 'Horários, avisos e apoio',
  },
]

export const BrandPalette = ({ colors, onChange }: BrandPaletteProps) => (
  <StudioSection
    title="Cores"
    description="Duas escolhas resolvem a marca. O resto ajusta a leitura."
  >
    <Box className={styles.groups}>
      <Box className={styles.group}>
        <Text size="xs" weight="bold" className={styles.groupTitle}>
          Marca
        </Text>
        <Box className={styles.grid}>
          {IDENTITY_COLORS.map(({ key, label, hint }) => (
            <ColorField
              key={key}
              label={label}
              hint={hint}
              value={colors[key]}
              onValueChange={(value) => onChange({ [key]: value })}
            />
          ))}
        </Box>
      </Box>

      <Box className={styles.group}>
        <Text size="xs" weight="bold" className={styles.groupTitle}>
          Superfícies e texto
        </Text>
        <Box className={styles.grid}>
          {SURFACE_COLORS.map(({ key, label, hint }) => (
            <ColorField
              key={key}
              label={label}
              hint={hint}
              value={colors[key]}
              onValueChange={(value) => onChange({ [key]: value })}
            />
          ))}
        </Box>
      </Box>
    </Box>

    <ContrastNotice colors={colors} />
  </StudioSection>
)
