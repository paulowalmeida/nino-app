import { Box } from '@nino/ds/components/Box'
import { Chip } from '@nino/ds/components/Chip'
import { BRAND_THEMES } from '@pages/Units/constants/unit.constants'
import type { BrandColors } from '@pages/Units/types/BrandColors.type'

import { StudioSection } from '../StudioSection/StudioSection'

import styles from './BrandThemes.module.css'

export type BrandThemesProps = {
  colors: BrandColors
  onApply: (colors: BrandColors) => void
}

const SWATCH_KEYS: (keyof BrandColors)[] = [
  'primaryColor',
  'secondaryColor',
  'backgroundColor',
]

const isSameTheme = (current: BrandColors, candidate: BrandColors) =>
  (Object.keys(candidate) as (keyof BrandColors)[]).every(
    (key) => current[key].toLowerCase() === candidate[key].toLowerCase()
  )

export const BrandThemes = ({ colors, onApply }: BrandThemesProps) => (
  <StudioSection
    title="Ponto de partida"
    description="Aplique um conjunto pronto e ajuste o que quiser depois."
  >
    <Box direction="row" gap={2} className={styles.row}>
      {BRAND_THEMES.map((theme) => (
        <Chip
          key={theme.id}
          variant="toggle"
          selected={isSameTheme(colors, theme.colors)}
          className={styles.theme}
          leadingIcon={
            <Box direction="row" aria-hidden="true" className={styles.swatches}>
              {SWATCH_KEYS.map((key) => (
                <Box
                  key={key}
                  className={styles.swatch}
                  style={{ backgroundColor: theme.colors[key] }}
                />
              ))}
            </Box>
          }
          onClick={() => onApply(theme.colors)}
        >
          {theme.label}
        </Chip>
      ))}
    </Box>
  </StudioSection>
)
