import { ImgHTMLAttributes, ReactNode } from 'react'

export interface ImageProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'placeholder'
> {
  /** Image URL. Empty or null renders only the placeholder. */
  src?: string | null
  /**
   * Shown underneath while the file downloads, and kept for good when there
   * is no `src` or the download fails.
   */
  placeholder?: ReactNode
  /** Classes for the wrapper that stacks placeholder and image. */
  wrapperClassName?: string
}
