import { Image } from '@nino/ds/components/Image'
import { mergeClasses } from '@nino/ds/mergeClasses'
import { toCategoryIcon } from '@shared/adapters/category-icon.adapter/category-icon.adapter'

import styles from './ItemThumb.module.css'

type ItemThumbProps = {
  name: string
  imageUrl?: string | null
  fallbackUrl?: string | null
  className?: string
  wrapperClassName?: string
}

const TONES = 6

const toneOf = (name: string): number => {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0
  }
  return Math.abs(hash) % TONES
}

export const ItemThumb = ({
  name,
  imageUrl,
  fallbackUrl,
  className,
  wrapperClassName,
}: ItemThumbProps) => {
  const thumbClasses = mergeClasses(styles.thumb, className)
  const glyphClasses = mergeClasses(
    thumbClasses,
    styles.glyph,
    styles[`tone${toneOf(name)}`]
  )

  return (
    <Image
      src={imageUrl ?? fallbackUrl}
      alt=""
      aria-hidden="true"
      className={thumbClasses}
      wrapperClassName={mergeClasses(styles.thumbWrapper, wrapperClassName)}
      placeholder={
        <span className={glyphClasses} aria-hidden="true">
          {toCategoryIcon(name) ?? '🍽️'}
        </span>
      }
    />
  )
}
