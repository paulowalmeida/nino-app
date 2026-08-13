import { HTMLAttributes } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'
import {
  alignDesktop,
  alignMobile,
  AlignValue,
  gapDesktop,
  gapMobile,
  GapValue,
  Responsive,
  responsiveToClasses,
} from '@ds/lib/responsive/responsive'
import { MarginProps, marginToClasses } from '@ds/lib/spacing/spacing'

type FlexboxDirection = 'column' | 'row'
type FlexboxJustify = 'start' | 'center' | 'end' | 'between' | 'around'

type FlexboxTag =
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

type FlexboxProps = HTMLAttributes<HTMLElement> &
  MarginProps & {
    as?: FlexboxTag
    direction?: Responsive<FlexboxDirection>
    gap?: Responsive<GapValue>
    align?: Responsive<AlignValue>
    justify?: Responsive<FlexboxJustify>
    wrap?: boolean
    grow?: boolean
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

/**
 * Layout primitive: stacks its children in one direction with an even gap
 * between them. Replaces the hand-written `<div className="flex flex-col
 * gap-…">` that every screen was repeating.
 *
 * @param as - Tag to render. Default: `div` — reach for `section`, `header`
 * or `ul` when the block has a meaning a screen reader should announce
 *
 * @param direction - `column` (default) stacks downward, `row` lines up
 * side by side. Accepts `{ mobile, desktop }`
 *
 * @param gap - Space between children, from the DS spacing scale. Accepts
 * `{ mobile, desktop }`
 *
 * @param align - Cross-axis alignment. Accepts `{ mobile, desktop }`
 *
 * @param justify - Main-axis distribution. Accepts
 * `{ mobile, desktop }`
 *
 * @param wrap - Lets children flow onto the next line when they run out of
 * room
 *
 * @param grow - Lets the stack take the free space of its own parent
 *
 * @param shrink - Lets the stack be squeezed below its content size
 *
 * @param m - Margin on every side. `mt`, `mb`, `mx` and `my` narrow it to
 * one axis or side. Accepts `{ mobile, desktop }`
 *
 * @example
 * <Flexbox gap={1.5}>
 *   <Heading level={1}>Cardápio</Heading>
 *   <Text color="subtle">Desligue o que acabou.</Text>
 * </Flexbox>
 *
 * <Flexbox as="header" direction="row" justify="between" align="center">
 */
export function Flexbox({
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
}: FlexboxProps) {
  return (
    <Component
      className={mergeClasses(
        'flex',
        responsiveToClasses(direction, directionMobile, directionDesktop),
        responsiveToClasses(gap, gapMobile, gapDesktop),
        responsiveToClasses(align, alignMobile, alignDesktop),
        responsiveToClasses(justify, justifyMobile, justifyDesktop),
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
    </Component>
  )
}
