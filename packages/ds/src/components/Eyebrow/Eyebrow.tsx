import { ReactNode } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses'

export interface EyebrowProps {
  children: ReactNode
  className?: string
}

const baseEyebrow =
  'inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase ' +
  'tracking-[0.12em] text-brand-strong ' +
  "before:content-[''] before:inline-block before:h-0.5 before:w-[22px] " +
  'before:rounded-sm before:bg-brand'

export function Eyebrow({ children, className }: EyebrowProps) {
  return <p className={mergeClasses(baseEyebrow, className)}>{children}</p>
}
