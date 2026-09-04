import type { CSSProperties } from 'react'

import type { Store } from '@shared/types/store/store'

export const toStoreTheme = (store?: Store | null): CSSProperties => {
  const colors = {
    '--store-tint': store?.primaryColor,
    '--color-brand': store?.primaryColor,
    '--color-brand-strong': store?.primaryColor,
    '--store-secondary': store?.secondaryColor,
    '--store-highlight': store?.tertiaryColor,
    '--color-brand-soft': store?.tertiaryColor,
    '--color-surface-page': store?.backgroundColor,
    '--color-surface-raised': store?.cardColor,
    '--color-border': store?.borderColor,
    '--color-fg-strong': store?.textColor,
    '--color-fg-default': store?.textColor,
    '--color-fg-subtle': store?.mutedTextColor,
    '--color-fg-muted': store?.mutedTextColor,
    '--color-fg-faint': store?.mutedTextColor,
  }

  return Object.fromEntries(
    Object.entries(colors).filter(([, value]) => value != null)
  ) as CSSProperties
}
