import { Image } from '@nino/ds/components/Image'
import { categoryIcon } from '@utils/category-icon'

import styles from './ItemThumb.module.css'

type ItemThumbProps = {
  name: string
  imageUrl?: string | null
  className?: string
  /** Classes for the element that stacks image and placeholder — lets a
   *  consumer size the whole tile (a full-bleed card photo), not just the
   *  image inside it. */
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
  className,
  wrapperClassName,
}: ItemThumbProps) => {
  const thumbClasses = className
    ? `${styles.thumb} ${className}`
    : styles.thumb
  const glyphClasses = [
    thumbClasses,
    styles.glyph,
    styles[`tone${toneOf(name)}`],
  ].join(' ')

  return (
    <Image
      src={imageUrl}
      alt=""
      aria-hidden="true"
      className={thumbClasses}
      wrapperClassName={[styles.thumbWrapper, wrapperClassName]
        .filter(Boolean)
        .join(' ')}
      placeholder={
        <span className={glyphClasses} aria-hidden="true">
          {categoryIcon(name) ?? '🍽️'}
        </span>
      }
    />
  )
}
