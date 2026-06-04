import { useState } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses'

import { StepperProps } from './Stepper.types'

const baseIndicator =
  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors'

const indicatorDefault = 'border-gray-300 bg-white text-gray-500'
const indicatorActive = 'border-brand bg-brand text-white'
const indicatorCompleted = 'border-brand bg-brand text-white'

const separatorHClass = 'h-0.5 flex-1 mx-2 transition-colors'
const separatorVClass = 'ml-4 mt-1 mb-1 h-6 w-0.5 transition-colors'
const separatorDone = 'bg-brand'
const separatorPending = 'bg-gray-200'

const baseTrigger =
  'flex items-center gap-3 rounded outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1'

const titleActive = 'text-sm font-medium text-brand'
const titleCompleted = 'text-sm font-medium text-gray-900'
const titleDefault = 'text-sm font-medium text-gray-500'

const descriptionClass = 'text-xs text-gray-400 mt-0.5'

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
              isVertical ? 'flex-col' : 'flex-1 flex-col items-center'
            )}
          >
            <div
              className={mergeClasses(
                'flex items-center',
                isVertical ? 'gap-3' : 'w-full'
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
              {!isVertical && index < steps.length - 1 && (
                <div
                  aria-hidden
                  className={mergeClasses(
                    separatorHClass,
                    isCompleted ? separatorDone : separatorPending
                  )}
                />
              )}
            </div>
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
