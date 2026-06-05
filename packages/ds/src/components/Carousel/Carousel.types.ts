import type { ReactNode } from 'react'

export interface CarouselProps {
  /** Slides rendered in order */
  slides: ReactNode[]
  /** Loop back to the start after the last slide */
  loop?: boolean
  /** Auto-advance slides */
  autoplay?: boolean
  /** Slides visible per page. Default: `1` */
  slidesPerPage?: number
  className?: string
}
