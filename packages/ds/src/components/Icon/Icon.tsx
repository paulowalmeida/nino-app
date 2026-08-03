import { mergeClasses } from '@ds/lib/mergeClasses'

import spriteUrl from '../../assets/icons.sprite.svg'
import { IconName } from './Icon.types'

const baseIcon = 'inline-block shrink-0'

const sizeClass = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}

export interface IconProps {
  name: IconName
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Single source of icons for every app — apps never import an `.svg` file
 * themselves, only `<Icon name="..." />`.
 *
 * The whole catalog ships as one `<symbol>` sprite (~12 kB gzipped) fetched
 * once and cached under a hashed URL, instead of one JS chunk per icon: a
 * screen with twenty icons costs one request, not twenty, and rendering
 * stays synchronous — no loading state, no pop-in.
 *
 * Colour comes from `currentColor` on each symbol, so the icon follows the
 * surrounding text colour like any glyph.
 */
export function Icon({ name, size = 'md', className }: IconProps) {
  return (
    <svg
      className={mergeClasses(baseIcon, sizeClass[size], className)}
      aria-hidden="true"
      focusable="false"
    >
      <use href={`${spriteUrl}#${name}`} />
    </svg>
  )
}
