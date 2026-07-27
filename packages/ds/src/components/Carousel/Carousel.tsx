import { Carousel as ArkCarousel } from '@ark-ui/react/carousel'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { CarouselProps } from './Carousel.types'

const rootClass = 'relative'

const itemGroupClass = 'flex'

const itemClass = 'min-w-0 shrink-0 grow-0'

const triggerClass =
  'absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center ' +
  'justify-center rounded-card bg-white text-body shadow-card ' +
  'transition-colors cursor-pointer outline-none hover:bg-line/25 ' +
  'hover:text-brand-strong focus-visible:outline-2 ' +
  'focus-visible:outline-brand disabled:pointer-events-none ' +
  'disabled:opacity-40'

const indicatorGroupClass = 'mt-3 flex items-center justify-center gap-2'

const indicatorClass =
  'h-1.5 w-4 rounded-full bg-line transition-all cursor-pointer ' +
  'outline-none data-[current]:w-8 data-[current]:bg-body ' +
  'focus-visible:outline-2 focus-visible:outline-brand ' +
  'focus-visible:outline-offset-2'

const Chevron = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={dir === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
  </svg>
)

/**
 * Slideshow with arrows and indicators (Ark `Carousel`). Indicators and
 * hover states use the brand color.
 *
 * @param slides - Slides rendered in order
 *
 * @param loop - Loop back to the start after the last slide
 *
 * @param slidesPerPage - Slides visible per page. Default: `1`
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
      className={mergeClasses(rootClass, className)}
    >
      <ArkCarousel.ItemGroup className={itemGroupClass}>
        {slides.map((slide, index) => (
          <ArkCarousel.Item key={index} index={index} className={itemClass}>
            {slide}
          </ArkCarousel.Item>
        ))}
      </ArkCarousel.ItemGroup>

      <ArkCarousel.Control>
        <ArkCarousel.PrevTrigger
          className={mergeClasses(triggerClass, 'left-2')}
          aria-label="Slide anterior"
        >
          <Chevron dir="left" />
        </ArkCarousel.PrevTrigger>
        <ArkCarousel.NextTrigger
          className={mergeClasses(triggerClass, 'right-2')}
          aria-label="Próximo slide"
        >
          <Chevron dir="right" />
        </ArkCarousel.NextTrigger>
      </ArkCarousel.Control>

      <ArkCarousel.IndicatorGroup className={indicatorGroupClass}>
        {slides.map((_, index) => (
          <ArkCarousel.Indicator
            key={index}
            index={index}
            className={indicatorClass}
            aria-label={`Ir para o slide ${index + 1}`}
          />
        ))}
      </ArkCarousel.IndicatorGroup>
    </ArkCarousel.Root>
  )
}

Carousel.displayName = 'Carousel'
