import { Image } from '@nino/ds/components/Image'
import { categoryIcon } from '@utils/category-icon'

import styles from './ItemThumb.module.css'

type ItemThumbProps = {
  name: string
  imageUrl?: string | null
  className?: string
}

const TONES = 6

const toneOf = (name: string): number => {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0
  }
  return Math.abs(hash) % TONES
}

/**
 * The emoji tile isn't just the "no photo" state: it holds the spot while
 * the photo downloads, so the row never shows a hole after the list
 * skeleton gives way.
 */
export const ItemThumb = ({ name, imageUrl, className }: ItemThumbProps) => {
  const classes = className ? `${styles.thumb} ${className}` : styles.thumb
  const glyphClasses = [classes, styles.glyph, styles[`tone${toneOf(name)}`]]
    .join(' ')

  return (
    <Image
      src={imageUrl}
      alt=""
      aria-hidden="true"
      className={classes}
      wrapperClassName={styles.imageWrapper}
      placeholder={
        <span className={glyphClasses} aria-hidden="true">
          {categoryIcon(name) ?? '🍽️'}
        </span>
      }
    />
  )
}
