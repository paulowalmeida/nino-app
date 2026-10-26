import { Image } from '@nino/ds/components/Image'
import { mergeClasses } from '@nino/ds/mergeClasses'
import { resolveApiAssetUrl } from '@shared/utils/api-asset-url/api-asset-url'

import styles from './ItemThumb.module.css'

type ItemThumbProps = {
  name: string
  imageUrl?: string | null
  fallbackUrl?: string | null
  isPreloaded?: boolean
  className?: string
  wrapperClassName?: string
}

export const ItemThumb = ({
  imageUrl,
  fallbackUrl,
  isPreloaded,
  className,
  wrapperClassName,
}: ItemThumbProps) => {
  const thumbClasses = mergeClasses(styles.thumb, className)
  return (
    <Image
      src={imageUrl ?? resolveApiAssetUrl(fallbackUrl)}
      preloaded={isPreloaded}
      alt=""
      aria-hidden="true"
      className={thumbClasses}
      wrapperClassName={mergeClasses(styles.thumbWrapper, wrapperClassName)}
      placeholder={
        <span className={mergeClasses(thumbClasses, styles.empty)} />
      }
    />
  )
}
