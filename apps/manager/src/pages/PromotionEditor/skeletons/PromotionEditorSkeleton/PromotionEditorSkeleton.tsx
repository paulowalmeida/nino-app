import { Box } from '@nino/ds/components/Box'
import { Card } from '@nino/ds/components/Card'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { EDITOR_GHOST_SECTIONS } from '@pages/PromotionEditor/constants/promotionEditor.constants'

import ghost from './PromotionEditorSkeleton.module.css'
import styles from '@pages/PromotionEditor/components/PromotionEditorForm/PromotionEditorForm.module.css'

export const PromotionEditorSkeleton = () => (
  <Box
    className={styles.promotionEditorForm}
    aria-busy="true"
    aria-label="Carregando campanha"
  >
    <Box className={styles.promotionEditorFields}>
      {EDITOR_GHOST_SECTIONS.map((section) => (
        <Card key={section} variant="flat" padding="lg">
          <Skeleton className={ghost.ghostTitle} />
          <Skeleton className={ghost.ghostField} />
        </Card>
      ))}
    </Box>
    <Box className={styles.promotionEditorPreview}>
      <Card variant="flat" padding="lg">
        <Skeleton className={ghost.ghostEyebrow} />
        <Skeleton className={ghost.ghostStrip} />
      </Card>
    </Box>
  </Box>
)
