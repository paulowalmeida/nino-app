import { Box } from '@nino/ds/components/Box'
import { LoadingDots } from '@nino/ds/components/LoadingDots'
import { NinoMascot } from '@nino/ds/components/NinoMascot'
import { Spinner } from '@nino/ds/components/Spinner'
import type { BrandColors } from '@pages/Units/types/BrandColors.type'
import type { UnitDraft } from '@shared/types/store/unit-draft'

import styles from './LoadingPreview.module.css'

export type LoadingPreviewProps = {
  loadingType: UnitDraft['loadingType']
  colors: Pick<BrandColors, 'backgroundColor' | 'primaryColor'>
}

const SPINNER_SIZE = 32

export const LoadingPreview = ({
  loadingType,
  colors,
}: LoadingPreviewProps) => (
  <Box
    as="section"
    aria-label="Prévia da abertura da loja"
    className={styles.stage}
    style={{
      backgroundColor: colors.backgroundColor,
      color: colors.primaryColor,
    }}
  >
    {loadingType === 'MASCOT' && <NinoMascot className={styles.mascot} />}
    {loadingType === 'SPINNER' && <Spinner visible size={SPINNER_SIZE} />}
    {loadingType === 'DOTS' && <LoadingDots visible />}
  </Box>
)
