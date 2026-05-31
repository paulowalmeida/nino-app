export type ProgressLineSize = 'sm' | 'md' | 'lg'

export interface ProgressLineProps {
  value: number | null
  min?: number
  max?: number
  size?: ProgressLineSize
  className?: string
}
