import { useState } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses'

import { StepperProps } from './Stepper.types'

/* Marcador quadrado de canto quebrado, não bolinha: é a mesma peça do Badge,
 * e uma etapa é um bloco na sequência, não uma conta de colar. Estado por
 * preenchimento — vazio é superfície rebaixada, feito é tinta cheia. */
const baseIndicator =
  'flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] ' +
  'text-sm font-bold transition-colors'

const indicatorDefault = 'bg-surface-mute text-faint'
const indicatorActive = 'bg-brand text-brand-foreground'
const indicatorCompleted = 'bg-body text-cream'

/* Fora do fluxo, ligando o centro de um marcador ao do próximo: no fluxo, ele
 * entrava na largura da etapa e o rótulo — centrado na coluna — saía deslocado
 * meio conector para a direita, enquanto a última etapa (sem conector) ficava
 * centrada sozinha. `1.5rem` = metade do marcador (16px) + 8px de respiro. */
const separatorHClass =
  'absolute top-4 h-1 -translate-y-1/2 rounded-full transition-colors ' +
  'left-[calc(50%+1.5rem)] right-[calc(-50%+1.5rem)]'
const separatorVClass = 'ml-4 mt-1 mb-1 h-6 w-1 rounded-full transition-colors'
const separatorDone = 'bg-body'
const separatorPending = 'bg-surface-mute'

const baseTrigger =
  'flex cursor-pointer items-center gap-3 rounded-card outline-none ' +
  'focus-visible:outline-2 focus-visible:outline-brand ' +
  'focus-visible:outline-offset-2'

const titleActive = 'text-sm font-semibold text-brand-strong'
const titleCompleted = 'text-sm font-semibold text-ink'
const titleDefault = 'text-sm font-medium text-subtle'

const descriptionClass = 'text-xs text-faint mt-0.5'

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

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
    <div
      role="list"
      aria-label="Progress"
      className={mergeClasses(
        'flex w-full',
        isVertical ? 'flex-col' : 'items-start',
        className
      )}
    >
      {steps.map((s, index) => {
        const isCompleted = index < current
        const isCurrent = index === current
        const indicatorClass =
          isCompleted || isCurrent
            ? isCurrent
              ? indicatorActive
              : indicatorCompleted
            : indicatorDefault
        const titleClass = isCurrent
          ? titleActive
          : isCompleted
            ? titleCompleted
            : titleDefault

        return (
          <div
            key={index}
            role="listitem"
            className={mergeClasses(
              'flex',
              isVertical
                ? 'flex-col'
                : 'relative min-w-0 flex-1 flex-col items-center'
            )}
          >
            <div
              className={mergeClasses(
                'flex items-center',
                isVertical ? 'gap-3' : ''
              )}
            >
              <button
                type="button"
                aria-label={s.title}
                aria-current={isCurrent ? 'step' : undefined}
                onClick={() => handleClick(index)}
                className={mergeClasses(
                  baseTrigger,
                  isVertical ? '' : 'justify-center'
                )}
              >
                <span className={mergeClasses(baseIndicator, indicatorClass)}>
                  {isCompleted ? <CheckIcon /> : <span>{index + 1}</span>}
                </span>
              </button>
            </div>
            {!isVertical && index < steps.length - 1 && (
              <div
                aria-hidden
                className={mergeClasses(
                  separatorHClass,
                  isCompleted ? separatorDone : separatorPending
                )}
              />
            )}
            {!isVertical && (
              <div className="mt-2 text-center">
                <p className={titleClass}>{s.title}</p>
                {s.description && (
                  <p className={descriptionClass}>{s.description}</p>
                )}
              </div>
            )}
            {isVertical && (
              <div className="ml-11">
                <p className={titleClass}>{s.title}</p>
                {s.description && (
                  <p className={descriptionClass}>{s.description}</p>
                )}
              </div>
            )}
            {isVertical && index < steps.length - 1 && (
              <div
                aria-hidden
                className={mergeClasses(
                  separatorVClass,
                  isCompleted ? separatorDone : separatorPending
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

Stepper.displayName = 'Stepper'
