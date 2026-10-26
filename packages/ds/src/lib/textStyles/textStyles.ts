/* Color and alignment are the same for Heading, Text and Icon — they live
 * here so the three read one list, instead of each component keeping its own
 * copy. Every class points at a token: a color that is not in the palette
 * cannot be reached through these props. */

export type TextColor =
  | 'strong'
  | 'default'
  | 'muted'
  | 'subtle'
  | 'faint'
  | 'faintest'
  | 'brand'
  | 'brand-strong'
  | 'success'
  | 'danger'
  | 'warning'

export type TextAlign = 'left' | 'center' | 'right'

export const textColorClasses: Record<TextColor, string> = {
  strong: 'text-fg-strong',
  default: 'text-fg-default',
  muted: 'text-fg-muted',
  subtle: 'text-fg-subtle',
  faint: 'text-fg-faint',
  faintest: 'text-fg-faintest',
  brand: 'text-brand',
  'brand-strong': 'text-brand-strong',
  success: 'text-success',
  danger: 'text-danger',
  warning: 'text-warning',
}

export const textAlignClasses: Record<TextAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}
