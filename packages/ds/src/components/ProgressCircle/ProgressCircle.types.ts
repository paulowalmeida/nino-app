export type ProgressCircleSize = 'sm' | 'md' | 'lg'

export interface ProgressCircleProps {
  value: number | null
  min?: number
  max?: number
  size?: ProgressCircleSize
  className?: string
}
