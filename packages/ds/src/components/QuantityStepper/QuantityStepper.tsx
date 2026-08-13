import { forwardRef } from 'react'

import { Button } from '@ds/components/Button/Button'
import { Icon } from '@ds/components/Icon/Icon'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import {
  QuantityStepperProps,
  QuantityStepperSize,
} from './QuantityStepper.types'

const groupClasses: Record<QuantityStepperSize, string> = {
  sm: 'flex shrink-0 items-center gap-1.5',
  md: 'flex shrink-0 items-center gap-2',
}

const buttonClasses: Record<QuantityStepperSize, string> = {
  sm: 'h-8 w-8 text-base',
  md: '',
}

/* Largura fixa e tabular: sem isso o par de botões anda de lado sozinho
 * quando a quantidade passa de 9 para 10. */
const countClasses = 'w-4 text-center text-sm font-bold text-muted tabular-nums'

/**
 * Quantity control: decrement, current amount, increment. The `count` slot
 * takes any node so an animated counter can replace the plain number.
 */
export const QuantityStepper = forwardRef<HTMLDivElement, QuantityStepperProps>(
  (
    {
      quantity,
      onIncrement,
      onDecrement,
      incrementLabel,
      decrementLabel,
      decrementIcon = 'minus',
      isDecrementDisabled = false,
      size = 'md',
      count,
      className,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={mergeClasses(groupClasses[size], className)}
      {...props}
    >
      <Button
        size="icon"
        variant="outline"
        className={buttonClasses[size]}
        aria-label={decrementLabel}
        disabled={isDecrementDisabled}
        onClick={onDecrement}
      >
        <Icon name={decrementIcon} size="sm" />
      </Button>

      <span className={countClasses}>{count ?? quantity}</span>

      <Button
        size="icon"
        variant="outline"
        className={buttonClasses[size]}
        aria-label={incrementLabel}
        onClick={onIncrement}
      >
        <Icon name="plus" size="sm" />
      </Button>
    </div>
  )
)

QuantityStepper.displayName = 'QuantityStepper'
