import { HTMLAttributes } from 'react'

export type SkeletonVariant = 'rect' | 'circle' | 'text'
export type SkeletonAnimation = 'pulse' | 'wave' | 'none'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant
  animation?: SkeletonAnimation
}
