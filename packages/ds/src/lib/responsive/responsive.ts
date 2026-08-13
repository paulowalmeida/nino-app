/*
 * The DS has a single breakpoint — `lg`. One value per breakpoint covers what
 * the screens ask for (stack on mobile, line up on desktop) without opening
 * the door to five variations of the same block, which nobody can review
 * afterwards. `mobile` is the unprefixed value, which in Tailwind already
 * applies from the smallest screen up — that is why there is no `base` beside
 * it: they would be the same value under two names. `desktop` becomes `lg:`,
 * the same 1024px cut the apps' CSS Modules already use.
 */
export type Responsive<T> = T | { mobile?: T; desktop?: T }

/* Half steps (1.5, 2.5) exist only in the gap: between a title and its
 * subtitle 4px is too little and 8px already separates too much — it is the
 * distance the manager screens were using by hand. Margin between blocks does
 * not need that resolution. */
export type GapValue = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 4 | 5 | 6 | 8 | 10 | 12

/* Spelled out because Tailwind reads the code as text: `gap-${n}` assembled at
 * runtime does not exist for it, and the class is never generated. */
export const gapMobile: Record<GapValue, string> = {
  0: 'gap-0',
  0.5: 'gap-0.5',
  1: 'gap-1',
  1.5: 'gap-1.5',
  2: 'gap-2',
  2.5: 'gap-2.5',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12',
}

export const gapDesktop: Record<GapValue, string> = {
  0: 'lg:gap-0',
  0.5: 'lg:gap-0.5',
  1: 'lg:gap-1',
  1.5: 'lg:gap-1.5',
  2: 'lg:gap-2',
  2.5: 'lg:gap-2.5',
  3: 'lg:gap-3',
  4: 'lg:gap-4',
  5: 'lg:gap-5',
  6: 'lg:gap-6',
  8: 'lg:gap-8',
  10: 'lg:gap-10',
  12: 'lg:gap-12',
}

export const alignMobile = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
} as const

export const alignDesktop = {
  start: 'lg:items-start',
  center: 'lg:items-center',
  end: 'lg:items-end',
  stretch: 'lg:items-stretch',
  baseline: 'lg:items-baseline',
} as const

export type AlignValue = keyof typeof alignMobile

/**
 * Turns one responsive prop into the classes it needs: nothing when the value
 * is absent, the mobile class alone when it is a plain value, and one class
 * per declared breakpoint when it is an object.
 */
export const responsiveToClasses = <T extends string | number>(
  value: Responsive<T> | undefined,
  mobile: Record<T, string>,
  desktop: Record<T, string>
) => {
  if (value === undefined) return []
  if (typeof value !== 'object') return [mobile[value]]

  return [
    value.mobile !== undefined && mobile[value.mobile],
    value.desktop !== undefined && desktop[value.desktop],
  ].filter(Boolean)
}
