import { ReactNode } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './Eyebrow.module.css'

type EyebrowProps = {
  children: ReactNode
  className?: string
}

/**
 * Short label above a heading, naming the section it opens.
 *
 * It is not a heading itself — it never enters the page outline, so a screen
 * reader jumping between headings hears the title, not the label before it.
 *
 * @param children - The label. Written in sentence case; the uppercase is
 * styling, so it stays readable when the style changes
 *
 * @param className - Additional classes, for spacing set by the caller
 *
 * @example
 * <Eyebrow>O que mais sai</Eyebrow>
 */
export function Eyebrow({ children, className }: EyebrowProps) {
  return <p className={mergeClasses(styles.eyebrow, className)}>{children}</p>
}
