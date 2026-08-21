import { HTMLAttributes } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'
import {
  alignMobile,
  AlignValue,
  gapMobile,
  GapValue,
} from '@ds/lib/responsive/responsive'
import { MarginProps, marginToClasses } from '@ds/lib/spacing/spacing'

type ListRowDivider = 'top' | 'bottom' | 'none'
type ListRowPadding = 0 | 1 | 1.5 | 2 | 2.5 | 3 | 4

type ListRowProps = HTMLAttributes<HTMLLIElement> &
  MarginProps & {
    /** Which edge carries the rule. Default: `top` */
    divider?: ListRowDivider
    /**
     * How the content lines up. Default: `center`; reach for `baseline` when
     * text of different sizes has to sit on the same line
     */
    align?: AlignValue
    /** Space between the blocks in the row. Default: `3` */
    gap?: GapValue
    /** Vertical breathing room. Default: `3` */
    padding?: ListRowPadding
    /** Lets the content fall to the line below */
    wrap?: boolean
  }

const dividerClasses = {
  top: 'border-t border-border',
  bottom: 'border-b border-border',
  none: '',
} as const

const paddingClasses = {
  0: 'py-0',
  1: 'py-1',
  1.5: 'py-1.5',
  2: 'py-2',
  2.5: 'py-2.5',
  3: 'py-3',
  4: 'py-4',
} as const

/**
 * One row of a list: the `<li>` with the rule, the alignment and the
 * breathing room that 21 lists in the product were each writing by hand in
 * their own CSS.
 *
 * The rule sits on top by default because that is how a list reads: the
 * first row meets whatever came before it, and every row after separates
 * from the one above — instead of the last one being left with a stray line
 * hanging under it.
 *
 * Margins come from `MarginProps`: `m` on every side, `mt`/`mb`/`mx`/`my`
 * to narrow it to one axis or side.
 *
 * ```tsx
 * <Box as="ul">
 *   {zones.map((zone) => (
 *     <ListRow key={zone.id}>
 *       <Text>{zone.name}</Text>
 *       <Text color="muted">{zone.fee}</Text>
 *     </ListRow>
 *   ))}
 * </Box>
 * ```
 */
export function ListRow({
  divider = 'top',
  align = 'center',
  gap = 3,
  padding = 3,
  wrap,
  m,
  mt,
  mb,
  mx,
  my,
  className,
  children,
  ...props
}: ListRowProps) {
  return (
    <li
      className={mergeClasses(
        'flex',
        dividerClasses[divider],
        alignMobile[align],
        gapMobile[gap],
        paddingClasses[padding],
        wrap && 'flex-wrap',
        marginToClasses({ m, mt, mb, mx, my }),
        className
      )}
      {...props}
    >
      {children}
    </li>
  )
}
