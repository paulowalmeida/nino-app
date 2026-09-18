import { ProgressLine } from '@nino/ds/components/ProgressLine'
import { Stepper } from '@nino/ds/components/Stepper'
import {
  COUNTER_STEP_COPY,
  COUNTER_STEP_ORDER,
} from '@pages/Counter/constants/counter.constants'
import type { CounterStep } from '@pages/Counter/types/CounterStep.type'

import styles from './CheckoutRail.module.css'

type CheckoutRailProps = {
  current: CounterStep
  onStep: (step: CounterStep) => void
}

export const CheckoutRail = ({ current, onStep }: CheckoutRailProps) => {
  const currentIndex = COUNTER_STEP_ORDER.indexOf(current)
  const progress = ((currentIndex + 1) / COUNTER_STEP_ORDER.length) * 100

  const goToCompletedStep = (index: number) => {
    if (index < currentIndex) onStep(COUNTER_STEP_ORDER[index])
  }

  return (
    <>
      <ProgressLine
        value={progress}
        size="sm"
        label={`Etapa ${currentIndex + 1} de ${COUNTER_STEP_ORDER.length}`}
        className={styles.progress}
      />
      <Stepper
        steps={COUNTER_STEP_ORDER.map((step) => ({
          title: COUNTER_STEP_COPY[step].title,
        }))}
        step={currentIndex}
        onStepChange={goToCompletedStep}
        className={styles.steps}
      />
    </>
  )
}
