import { HTMLAttributes } from 'react'

import { Avatar as ArkAvatar } from '@ark-ui/react/avatar'
import { Icon } from '@ds/components/Icon/Icon'
import { IconSize } from '@ds/components/Icon/Icon.types'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './Avatar.module.css'

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

const sizeClasses: Record<AvatarSize, string> = {
  sm: styles.sizeSmall,
  md: styles.sizeMedium,
  lg: styles.sizeLarge,
  xl: styles.sizeExtraLarge,
}

/* O boneco ocupa metade do círculo em qualquer tamanho, e cada metade cai
 * exata num degrau do Icon — então o tamanho vira prop, não fração por CSS
 * disputando com a classe que o próprio Icon aplica. */
const fallbackIconSize: Record<AvatarSize, IconSize> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
}

type AvatarProps = HTMLAttributes<HTMLDivElement> & {
  src?: string
  alt?: string
  fallback?: string
  size?: AvatarSize
}

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
      className={mergeClasses(styles.avatar, sizeClasses[size], className)}
      {...props}
    >
      <ArkAvatar.Image src={src} alt={alt ?? ''} className={styles.photo} />
      <ArkAvatar.Fallback className={styles.initials}>
        {fallback ?? (
          <Icon name="user" size={fallbackIconSize[size]} color="faint" />
        )}
      </ArkAvatar.Fallback>
    </ArkAvatar.Root>
  )
}
