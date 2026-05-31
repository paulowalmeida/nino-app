import { HTMLAttributes } from 'react'

export type CardVariant = 'default' | 'flat' | 'elevated'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
}
