import { Avatar as ArkAvatar } from '@ark-ui/react/avatar'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { AvatarProps, AvatarSize } from './Avatar.types'

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
}

/* A cor do texto fica na raiz, não no fallback: assim quem passa `className`
 * consegue recolorir as iniciais junto com o fundo — o fallback herda. */
const baseRoot =
  'relative inline-flex shrink-0 items-center justify-center ' +
  'overflow-hidden rounded-full bg-surface-mute text-muted select-none'

const baseImage = 'h-full w-full object-cover'

const baseFallback =
  'flex h-full w-full items-center justify-center font-bold ' +
  'tracking-[0.04em] uppercase'

/**
 * User avatar with image support and initials fallback.
 *
 * @param src - Image URL
 *
 * @param alt - Image alt text
 *
 * @param fallback - Initials or text shown when the image fails to load
 *
 * @param size - Avatar size. Default: `md`
 *
 * @param className - Additional CSS classes
 *
 * @example
 * <Avatar src="/photo.jpg" alt="John" fallback="JD" />
 * <Avatar fallback="AB" size="lg" />
 */
export function Avatar({
  src,
  alt,
  fallback,
  size = 'md',
  className,
  ...props
}: AvatarProps) {
  return (
    <ArkAvatar.Root
      className={mergeClasses(baseRoot, sizeClasses[size], className)}
      {...props}
    >
      <ArkAvatar.Image src={src} alt={alt ?? ''} className={baseImage} />
      <ArkAvatar.Fallback className={baseFallback}>
        {fallback ?? (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-1/2 w-1/2 text-faint"
            aria-hidden="true"
          >
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        )}
      </ArkAvatar.Fallback>
    </ArkAvatar.Root>
  )
}
