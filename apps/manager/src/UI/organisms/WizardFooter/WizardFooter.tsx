import { Button } from '@nino/ds/components/Button'
import { Box } from '@nino/ds/components/Box'

import styles from './WizardFooter.module.css'

type WizardFooterProps = {
  stepCount: number
  currentStep: number
  showBack: boolean
  onBack: () => void
  onAdvance: () => void
  advanceLabel: string
}

export const WizardFooter = ({
  stepCount,
  currentStep,
  showBack,
  onBack,
  onAdvance,
  advanceLabel,
}: WizardFooterProps) => (
  <Box direction="row" className={styles.foot}>
    {showBack && (
      <Button variant="ghost" className={styles.back} onClick={onBack}>
        Voltar
      </Button>
    )}

    <Box direction="row" className={styles.progress} aria-hidden="true">
      {Array.from({ length: stepCount }, (_, position) => (
        <span
          key={position}
          className={styles.tick}
          data-on={position <= currentStep}
        />
      ))}
    </Box>

    <div className={styles.advance}>
      <Button onClick={onAdvance}>{advanceLabel}</Button>
    </div>
  </Box>
)
