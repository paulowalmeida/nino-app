import { Image } from '@nino/ds/components/Image'
import { mergeClasses } from '@nino/ds/mergeClasses'
import { toCategoryIcon } from '@shared/adapters/category-icon.adapter/category-icon.adapter'
import { resolveApiAssetUrl } from '@shared/utils/api-asset-url/api-asset-url'

import styles from './ItemThumb.module.css'

type ItemThumbProps = {
  name: string
  imageUrl?: string | null
  fallbackUrl?: string | null
  className?: string
  wrapperClassName?: string
}

const TONES = 6

const TONE_CLASS_BY_INDEX = [
  styles.brandSoftTone,
  styles.peachTone,
  styles.neutralTone,
  styles.mutedBrandTone,
  styles.palePeachTone,
  styles.limeTone,
] as const

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
    TONE_CLASS_BY_INDEX[toneOf(name)]
  )

  return (
    <Image
      src={imageUrl ?? resolveApiAssetUrl(fallbackUrl)}
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
