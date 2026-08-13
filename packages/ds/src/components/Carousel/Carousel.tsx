import type { ReactNode } from 'react'

import { Carousel as ArkCarousel } from '@ark-ui/react/carousel'
import { Icon } from '@ds/components/Icon/Icon'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './Carousel.module.css'

type CarouselProps = {
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

/**
 * Slideshow with arrows and indicators (Ark `Carousel`). Indicators and
 * hover states use the brand color.
 *
 * - `slides` — Slides rendered in order
 * - `loop` — Loop back to the start after the last slide
 * - `slidesPerPage` — Slides visible per page. Default: `1`
 */
export function Carousel({
  slides,
  loop = false,
  autoplay = false,
  slidesPerPage = 1,
  className,
}: CarouselProps) {
  return (
    <ArkCarousel.Root
      slideCount={slides.length}
      slidesPerPage={slidesPerPage}
      loop={loop}
      autoplay={autoplay}
      className={mergeClasses(styles.carousel, className)}
    >
      <ArkCarousel.ItemGroup className={styles.slideTrack}>
        {slides.map((slide, index) => (
          <ArkCarousel.Item key={index} index={index} className={styles.slide}>
            {slide}
          </ArkCarousel.Item>
        ))}
      </ArkCarousel.ItemGroup>

      <ArkCarousel.Control>
        <ArkCarousel.PrevTrigger
          className={mergeClasses(styles.arrowButton, styles.arrowLeft)}
          aria-label="Slide anterior"
        >
          <Icon name="chevron-left" />
        </ArkCarousel.PrevTrigger>
        <ArkCarousel.NextTrigger
          className={mergeClasses(styles.arrowButton, styles.arrowRight)}
          aria-label="Próximo slide"
        >
          <Icon name="chevron-right" />
        </ArkCarousel.NextTrigger>
      </ArkCarousel.Control>

      <ArkCarousel.IndicatorGroup className={styles.dotRow}>
        {slides.map((_, index) => (
          <ArkCarousel.Indicator
            key={index}
            index={index}
            className={styles.dot}
            aria-label={`Ir para o slide ${index + 1}`}
          />
        ))}
      </ArkCarousel.IndicatorGroup>
    </ArkCarousel.Root>
  )
}
