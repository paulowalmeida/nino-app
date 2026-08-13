import {
  ImgHTMLAttributes,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './Image.module.css'

type ImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'placeholder'
> & {
  /** Image URL. Empty or null keeps the placeholder for good */
  src?: string | null
  /**
   * Shown while the file downloads, and kept for good when there is no `src`
   * or the download fails
   */
  placeholder?: ReactNode
  /** Classes for the element that stacks both layers */
  wrapperClassName?: string
}

/**
 * Image that owns its own loading state.
 *
 * A list skeleton only knows about the JSON: the moment the data lands it
 * gives way to the real rows, and the files start downloading *then* —
 * leaving holes where the photos should be. So the placeholder cannot live
 * in the skeleton; it has to live in each slot and stay until that one file
 * is actually decoded.
 *
 * ```tsx
 * <Image
 *   src={product.photoUrl}
 *   alt={product.name}
 *   placeholder={<Skeleton />}
 * />
 * ```
 */
export function Image({
  src,
  placeholder,
  className,
  wrapperClassName,
  onLoad,
  onError,
  ...props
}: ImageProps) {
  const ref = useRef<HTMLImageElement>(null)
  const [isReady, setIsReady] = useState(false)
  const [hasFailed, setHasFailed] = useState(false)
  const [previousSrc, setPreviousSrc] = useState(src)

  if (src !== previousSrc) {
    setPreviousSrc(src)
    setIsReady(false)
    setHasFailed(false)
  }

  /**
   * A file already in cache can finish before React attaches `onLoad`, so the
   * event never fires and the image would stay invisible forever. `complete`
   * is the only way to catch that.
   */
  useEffect(() => {
    const image = ref.current
    if (image?.complete && image.naturalWidth > 0) setIsReady(true)
  }, [src])

  const showsImage = !!src && !hasFailed

  return (
    <span className={mergeClasses(styles.stackLayer, wrapperClassName)}>
      {/*
        O placeholder some junto, em vez de ficar montado por baixo: foto com
        alpha (logo PNG, por exemplo) deixaria ele aparecendo através dela.
      */}
      {placeholder && (
        <span
          className={mergeClasses(
            styles.stackLayer,
            styles.fadeTransition,
            isReady && styles.hidden
          )}
          aria-hidden={isReady || undefined}
        >
          {placeholder}
        </span>
      )}

      {showsImage && (
        <img
          ref={ref}
          src={src}
          className={mergeClasses(
            styles.fadeTransition,
            isReady ? styles.visible : styles.hidden,
            className
          )}
          onLoad={(event) => {
            setIsReady(true)
            onLoad?.(event)
          }}
          onError={(event) => {
            setHasFailed(true)
            onError?.(event)
          }}
          {...props}
        />
      )}
    </span>
  )
}
