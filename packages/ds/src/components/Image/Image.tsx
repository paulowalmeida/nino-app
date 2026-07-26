import { useEffect, useRef, useState } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses'

import { ImageProps } from './Image.types'

const stackBase = 'grid [&>*]:col-start-1 [&>*]:row-start-1'
const fadeBase = 'transition-opacity duration-300 ease-out'

/**
 * Image that owns its own loading state.
 *
 * A list skeleton only knows about the JSON: the moment the data lands it
 * gives way to the real rows, and the files start downloading *then* —
 * leaving holes where the photos should be. So the placeholder can't live in
 * the skeleton, it has to live in each slot and stay until that file is
 * actually decoded.
 *
 * @param src - Image URL. Empty or null keeps the placeholder for good
 *
 * @param placeholder - Rendered underneath until the file is ready
 *
 * @param wrapperClassName - Classes for the element stacking both layers
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
    <span className={mergeClasses(stackBase, wrapperClassName)}>
      {/*
        O placeholder some junto, em vez de ficar montado por baixo: foto com
        alpha (logo PNG, por exemplo) deixaria ele aparecendo através dela.
      */}
      {placeholder && (
        <span
          className={mergeClasses(stackBase, fadeBase, isReady && 'opacity-0')}
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
            fadeBase,
            isReady ? 'opacity-100' : 'opacity-0',
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

Image.displayName = 'Image'
