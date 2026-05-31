export interface StepperStep {
  title: string
  description?: string
}

export type StepperOrientation = 'horizontal' | 'vertical'

export interface StepperProps {
  steps: StepperStep[]
  /** Current step index (0-based) */
  step?: number
  defaultStep?: number
  onStepChange?: (step: number) => void
  orientation?: StepperOrientation
  className?: string
}
