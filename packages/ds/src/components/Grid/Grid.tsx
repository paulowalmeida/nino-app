import { HTMLAttributes } from 'react'

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

type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 12

type GridTag = 'div' | 'section' | 'ul' | 'ol' | 'li' | 'main' | 'article'

type GridProps = HTMLAttributes<HTMLElement> &
  MarginProps & {
    /** Tag to render. Default: `div` */
    as?: GridTag
    /** How many columns. Accepts `{ mobile, tablet, desktop }` */
    columns?: Responsive<GridColumns>
    /** Space between cells. Accepts `{ mobile, tablet, desktop }` */
    gap?: Responsive<GapValue>
    /**
     * How cells sit within their own row. Accepts `{ mobile, tablet,
     * desktop }`
     */
    align?: Responsive<AlignValue>
  }

const columnsMobile = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  12: 'grid-cols-12',
} as const

const columnsDesktop = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
  12: 'lg:grid-cols-12',
} as const

const columnsTablet = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
  5: 'sm:grid-cols-5',
  6: 'sm:grid-cols-6',
  12: 'sm:grid-cols-12',
} as const

/**
 * Layout primitive for content laid out in columns — cards, form fields,
 * slices of a summary. The sibling of `Box`: one lays children along a
 * direction, this one across a grid.
 *
 * Column widths that are not equal fractions (`[20rem_1fr]`, `minmax`) stay
 * in the screen's own CSS: there the measure belongs to that one layout, not
 * to a scale the whole product shares.
 *
 * ```tsx
 * <Grid columns={{ mobile: 1, desktop: 3 }} gap={4}>
 *   <Card>…</Card>
 * </Grid>
 *
 * - `m` — Margin on every side. `mt`, `mb`, `mx` and `my` narrow it to one axis or side. Accepts `{ mobile, desktop }`
 * ```
 */
export function Grid({
  as: Component = 'div',
  columns = 1,
  gap,
  align,
  m,
  mt,
  mb,
  mx,
  my,
  className,
  children,
  ...props
}: GridProps) {
  return (
    <Component
      className={mergeClasses(
        'grid',
        responsiveToClasses(
          columns,
          columnsMobile,
          columnsDesktop,
          columnsTablet
        ),
        responsiveToClasses(gap, gapMobile, gapDesktop, gapTablet),
        responsiveToClasses(align, alignMobile, alignDesktop, alignTablet),
        marginToClasses({ m, mt, mb, mx, my }),
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
