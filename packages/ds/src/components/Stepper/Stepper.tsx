import { useState } from 'react'

import { Icon } from '@ds/components/Icon/Icon'
import { Stamp, StampTone } from '@ds/components/Stamp/Stamp'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './Stepper.module.css'

type StepperStep = {
  title: string
  description?: string
}

type StepperOrientation = 'horizontal' | 'vertical'

type StepperProps = {
  /** Title and optional description of each step, in order */
  steps: StepperStep[]
  /**
   * Current step, zero-based. Leave it out and pass `defaultStep` to let the
   * component keep its own
   */
  step?: number
  defaultStep?: number
  /**
   * Called when a marker is clicked. A step the person cannot reach yet
   * should not be clickable — guard it here
   */
  onStepChange?: (step: number) => void
  /**
   * `horizontal` (default) puts the steps side by side; `vertical` stacks
   * them, which is what fits a narrow screen
   */
  orientation?: StepperOrientation
  className?: string
}

/**
 * Numbered path through a form that was split in parts — sign-up, checkout.
 *
 * The marker is a square with a broken corner, not a bead: a step is a block
 * in a sequence, and the state is told by how full it is — empty is a
 * lowered surface, done is solid ink.
 *
 * ```tsx
 * <Stepper steps={[{ title: 'Conta' }, { title: 'Empresa' }]} step={done} />
 * ```
 */
export function Stepper({
  steps,
  step: controlledStep,
  defaultStep = 0,
  onStepChange,
  orientation = 'horizontal',
  className,
}: StepperProps) {
  const [internalStep, setInternalStep] = useState(defaultStep)
  const current = controlledStep ?? internalStep
  const isVertical = orientation === 'vertical'

  const handleClick = (index: number) => {
    if (controlledStep === undefined) setInternalStep(index)
    onStepChange?.(index)
  }

  return (
    <ol
      aria-label="Progresso"
      className={mergeClasses(
        styles.stepper,
        isVertical ? styles.stepperVertical : styles.stepperHorizontal,
        className
      )}
    >
      {steps.map((step, index) => {
        const isCompleted = index < current
        const isCurrent = index === current
        const tone: StampTone = isCurrent
          ? 'brand'
          : isCompleted
            ? 'inverse'
            : 'neutral'
        const titleClass = isCurrent
          ? styles.titleActive
          : isCompleted
            ? styles.titleCompleted
            : styles.titleDefault

        const label = (
          <div
            className={
              isVertical ? styles.labelVertical : styles.labelHorizontal
            }
          >
            <p className={titleClass}>{step.title}</p>
            {step.description && (
              <p className={styles.description}>{step.description}</p>
            )}
          </div>
        )

        const separator = index < steps.length - 1 && (
          <div
            aria-hidden
            className={mergeClasses(
              isVertical
                ? styles.separatorVertical
                : styles.separatorHorizontal,
              isCompleted ? styles.separatorDone : styles.separatorPending
            )}
          />
        )

        return (
          <li
            key={index}
            className={mergeClasses(
              styles.step,
              isVertical ? styles.stepVertical : styles.stepHorizontal
            )}
          >
            <button
              type="button"
              aria-label={step.title}
              aria-current={isCurrent ? 'step' : undefined}
              onClick={() => handleClick(index)}
              className={mergeClasses(
                styles.stepButton,
                !isVertical && styles.stepButtonHorizontal
              )}
            >
              <Stamp size="lg" tone={tone} className={styles.stepNumber}>
                {isCompleted ? <Icon name="check" size="sm" /> : index + 1}
              </Stamp>
            </button>
            {!isVertical && separator}
            {label}
            {isVertical && separator}
          </li>
        )
      })}
    </ol>
  )
}
