import { Box } from '@nino/ds/components/Box'
import { RadioGroup } from '@nino/ds/components/RadioGroup'
import type { BrandColors } from '@pages/Units/types/BrandColors.type'
import type { UnitDraft } from '@shared/types/store/unit-draft'

import { StudioSection } from '../StudioSection/StudioSection'
import { LoadingPreview } from './LoadingPreview/LoadingPreview'

import styles from './BrandLoading.module.css'

export type BrandLoadingProps = {
  value: UnitDraft['loadingType']
  colors: Pick<BrandColors, 'backgroundColor' | 'primaryColor'>
  onValueChange: (value: UnitDraft['loadingType']) => void
}

const LOADING_OPTIONS = [
  { value: 'MASCOT', label: 'Nino' },
  { value: 'SPINNER', label: 'Spinner' },
  { value: 'DOTS', label: 'Pontos' },
]

export const BrandLoading = ({
  value,
  colors,
  onValueChange,
}: BrandLoadingProps) => (
  <StudioSection
    title="Carregamento"
    description="O que aparece no meio segundo entre o toque e o cardápio."
  >
    <Box className={styles.picker}>
      <LoadingPreview loadingType={value} colors={colors} />
      <RadioGroup
        variant="card"
        orientation="horizontal"
        value={value}
        options={LOADING_OPTIONS}
        aria-label="Animação de carregamento da loja"
        className={styles.options}
        onValueChange={(loadingType) =>
          onValueChange(loadingType as UnitDraft['loadingType'])
        }
      />
    </Box>
  </StudioSection>
)
