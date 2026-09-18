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
  includeLocation: boolean
  onStep: (step: CounterStep) => void
}

export const CheckoutRail = ({
  current,
  includeLocation,
  onStep,
}: CheckoutRailProps) => {
  const visibleSteps = includeLocation
    ? COUNTER_STEP_ORDER
    : COUNTER_STEP_ORDER.filter((step) => step !== 'location')
  const currentIndex = visibleSteps.indexOf(current)
  const progress = ((currentIndex + 1) / visibleSteps.length) * 100

  const goToCompletedStep = (index: number) => {
    if (index < currentIndex) onStep(visibleSteps[index])
  }

  return (
    <>
      <ProgressLine
        value={progress}
        size="sm"
        label={`Etapa ${currentIndex + 1} de ${visibleSteps.length}`}
        className={styles.progress}
      />
      <Stepper
        steps={visibleSteps.map((step) => ({
          title: COUNTER_STEP_COPY[step].title,
        }))}
        step={currentIndex}
        onStepChange={goToCompletedStep}
        className={styles.steps}
      />
    </>
  )
}
