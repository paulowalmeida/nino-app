import { Button } from '@nino/ds/components/Button'
import { Flexbox } from '@nino/ds/components/Flexbox'

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
  <Flexbox direction="row" className={styles.foot}>
    {showBack && (
      <Button variant="ghost" className={styles.back} onClick={onBack}>
        Voltar
      </Button>
    )}

    <Flexbox direction="row" className={styles.progress} aria-hidden="true">
      {Array.from({ length: stepCount }, (_, position) => (
        <span
          key={position}
          className={styles.tick}
          data-on={position <= currentStep}
        />
      ))}
    </Flexbox>

    <div className={styles.advance}>
      <Button onClick={onAdvance}>{advanceLabel}</Button>
    </div>
  </Flexbox>
)
