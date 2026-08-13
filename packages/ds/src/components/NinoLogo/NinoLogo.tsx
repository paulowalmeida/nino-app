import { MouseEvent, ReactNode } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './NinoLogo.module.css'

type NinoLogoTone = 'light' | 'dark'
type NinoLogoSize = 'sm' | 'md' | 'lg'

type NinoLogoProps = {
  className?: string
  tone?: NinoLogoTone
  size?: NinoLogoSize
  mark?: ReactNode
  label?: ReactNode
  href?: string
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
  ariaLabel?: string
  hideWordmark?: boolean
}

const sizeClasses: Record<NinoLogoSize, string> = {
  sm: styles.sizeSmall,
  md: styles.sizeMedium,
  lg: styles.sizeLarge,
}

const toneClasses: Record<NinoLogoTone, string> = {
  light: styles.toneLight,
  dark: styles.toneDark,
}

/**
 * The nino mark, with the wordmark beside it and an optional app name under
 * it — "GESTOR" in the manager, "ENTREGAS" in the courier app.
 *
 * @param tone - Which ground it sits on. `dark` (default) for paper,
 * `light` for a brand-coloured surface
 *
 * @param size - `sm`, `md` or `lg` (default)
 *
 * @param mark - Replaces the round `n` — the mascot, a tenant's own mark
 *
 * @param label - Small-caps line under the wordmark, naming the app
 *
 * @param href - Turns the whole thing into a link. Then `ariaLabel` is
 * required: the mark alone gives a screen reader nothing to read
 *
 * @param hideWordmark - Keeps only the mark, for a collapsed sidebar
 *
 * @example
 * <NinoLogo size="sm" label="GESTOR" href="/" ariaLabel="Início" />
 */
export function NinoLogo({
  className,
  tone = 'dark',
  size = 'lg',
  mark,
  label,
  href,
  onClick,
  ariaLabel,
  hideWordmark = false,
}: NinoLogoProps) {
  const content = (
    <>
      <span className={mergeClasses(styles.mark, !mark && styles.markDefault)}>
        {mark ?? 'n'}
      </span>
      {!hideWordmark && (
        <span className={styles.stack}>
          <span className={styles.wordmark}>nino</span>
          {label && <span className={styles.label}>{label}</span>}
        </span>
      )}
    </>
  )

  const isMarkOnly = size === 'sm' && hideWordmark

  return (
    <div
      className={mergeClasses(
        styles.logo,
        sizeClasses[size],
        toneClasses[tone],
        className
      )}
    >
      {href ? (
        <a
          href={href}
          onClick={onClick}
          aria-label={ariaLabel}
          className={mergeClasses(styles.link, isMarkOnly && styles.markOnlyPadding)}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  )
}
