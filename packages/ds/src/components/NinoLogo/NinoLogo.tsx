import { MouseEvent, ReactNode } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses'

export interface NinoLogoProps {
  className?: string
  tone?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  mark?: ReactNode
  /** Small-caps text under the wordmark — app-specific (e.g. "GESTOR"). */
  label?: ReactNode
  href?: string
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
  /** aria-label for the link — required when `href` is set. */
  ariaLabel?: string
  hideWordmark?: boolean
}

const sizes = {
  sm: {
    mark: 'h-9 w-9',
    letter: 'text-xl',
    wordmark: 'text-xl',
    label: 'text-[10px]',
  },
  md: {
    mark: 'h-12 w-12',
    letter: 'text-2xl',
    wordmark: 'text-2xl',
    label: 'text-sm',
  },
  lg: {
    mark: 'h-16 w-16',
    letter: 'text-[32px]',
    wordmark: 'text-4xl',
    label: 'text-2xl',
  },
}

const baseLink =
  'inline-flex min-h-11 items-center gap-2.5 rounded-lg no-underline ' +
  'transition-opacity duration-150 hover:opacity-80 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand'

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
  const variant = sizes[size]
  const labelColor = tone === 'light' ? 'text-white/60' : 'text-gray-400'
  const markClass = mergeClasses(
    'relative inline-flex items-center justify-center',
    !mark && variant.mark
  )

  const content: ReactNode = (
    <>
      <span className={markClass}>
        {mark ?? (
          <>
            <span className="absolute inset-0 rounded-full bg-brand/15" />
            <span
              className={mergeClasses(
                'font-display font-extrabold text-brand',
                variant.letter
              )}
            >
              n
            </span>
          </>
        )}
      </span>
      {!hideWordmark && (
        <span className="inline-flex flex-col">
          <span
            className={mergeClasses(
              'font-display font-extrabold leading-none tracking-tight',
              'text-brand',
              variant.wordmark
            )}
          >
            nino
          </span>
          {label && (
            <span
              className={mergeClasses(
                'mt-1 font-semibold leading-none tracking-[0.25em]',
                variant.label,
                labelColor
              )}
            >
              {label}
            </span>
          )}
        </span>
      )}
    </>
  )

  const isMarkOnlySm = size === 'sm' && hideWordmark

  return (
    <div
      className={mergeClasses('inline-flex items-center gap-2.5', className)}
    >
      {href ? (
        <a
          href={href}
          onClick={onClick}
          aria-label={ariaLabel}
          className={mergeClasses(baseLink, isMarkOnlySm && 'p-1')}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  )
}
