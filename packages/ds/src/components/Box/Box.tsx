import { type ElementType, forwardRef, HTMLAttributes } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'
import {
  alignDesktop,
  alignMobile,
  alignTablet,
  AlignValue,
  gapDesktop,
  gapMobile,
  gapTablet,
  GapValue,
  Responsive,
  responsiveToClasses,
} from '@ds/lib/responsive/responsive'
import { MarginProps, marginToClasses } from '@ds/lib/spacing/spacing'

type BoxDirection = 'column' | 'row'
type BoxJustify = 'start' | 'center' | 'end' | 'between' | 'around'

type BoxTag =
  | 'div'
  | 'section'
  | 'header'
  | 'footer'
  | 'nav'
  | 'main'
  | 'article'
  | 'aside'
  | 'ul'
  | 'ol'
  | 'li'
  | 'form'
  | 'fieldset'
  | 'label'

type BoxProps = HTMLAttributes<HTMLElement> &
  MarginProps & {
    /**
     * Tag to render. Default: `div` — reach for `section`, `header` or `ul`
     * when the block has a meaning a screen reader should announce
     */
    as?: BoxTag
    /**
     * `column` (default) stacks downward, `row` lines up side by side.
     * Accepts `{ mobile, tablet, desktop }`
     */
    direction?: Responsive<BoxDirection>
    /**
     * Space between children, from the DS spacing scale. Accepts `{ mobile,
     * tablet, desktop }`
     */
    gap?: Responsive<GapValue>
    /** Cross-axis alignment. Accepts `{ mobile, tablet, desktop }` */
    align?: Responsive<AlignValue>
    /** Main-axis distribution. Accepts `{ mobile, tablet, desktop }` */
    justify?: Responsive<BoxJustify>
    /** Lets children flow onto the next line when they run out of room */
    wrap?: boolean
    /** Lets the stack take the free space of its own parent */
    grow?: boolean
    /** Lets the stack be squeezed below its content size */
    shrink?: boolean
  }

const directionMobile = {
  column: 'flex-col',
  row: 'flex-row',
} as const

const directionDesktop = {
  column: 'lg:flex-col',
  row: 'lg:flex-row',
} as const

const directionTablet = {
  column: 'sm:flex-col',
  row: 'sm:flex-row',
} as const

const justifyMobile = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
} as const

const justifyDesktop = {
  start: 'lg:justify-start',
  center: 'lg:justify-center',
  end: 'lg:justify-end',
  between: 'lg:justify-between',
  around: 'lg:justify-around',
} as const

const justifyTablet = {
  start: 'sm:justify-start',
  center: 'sm:justify-center',
  end: 'sm:justify-end',
  between: 'sm:justify-between',
  around: 'sm:justify-around',
} as const

/**
 * Layout primitive: stacks its children in one direction with an even gap
 * between them. Replaces the hand-written `<div className="flex flex-col
 * gap-…">` that every screen was repeating.
 *
 * ```tsx
 * <Box gap={1.5}>
 *   <Heading level={1}>Cardápio</Heading>
 *   <Text color="subtle">Desligue o que acabou.</Text>
 * </Box>
 *
 * <Box as="header" direction="row" justify="between" align="center">
 *
 * - `m` — Margin on every side. `mt`, `mb`, `mx` and `my` narrow it to one axis or side. Accepts `{ mobile, desktop }`
 * ```
 */
export const Box = forwardRef<HTMLElement, BoxProps>(function Box(
  {
    as: Component = 'div',
    direction = 'column',
    gap,
    align,
    justify,
    wrap,
    grow,
    shrink,
    m,
    mt,
    mb,
    mx,
    my,
    className,
    children,
    ...props
  },
  ref
) {
  const BoxElement = Component as ElementType

  return (
    <BoxElement
      ref={ref}
      className={mergeClasses(
        'flex',
        responsiveToClasses(
          direction,
          directionMobile,
          directionDesktop,
          directionTablet
        ),
        responsiveToClasses(gap, gapMobile, gapDesktop, gapTablet),
        responsiveToClasses(align, alignMobile, alignDesktop, alignTablet),
        responsiveToClasses(
          justify,
          justifyMobile,
          justifyDesktop,
          justifyTablet
        ),
        wrap && 'flex-wrap',
        grow && 'grow',
        shrink && 'shrink',
        shrink === false && 'shrink-0',
        marginToClasses({ m, mt, mb, mx, my }),
        className
      )}
      {...props}
    >
      {children}
    </BoxElement>
  )
})
