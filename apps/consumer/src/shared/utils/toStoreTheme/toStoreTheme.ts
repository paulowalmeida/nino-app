import type { CSSProperties } from 'react'

import type { Store } from '@shared/types/store/store'

export const toStoreTheme = (store?: Store | null): CSSProperties => {
  const colors = {
    '--store-tint': store?.primaryColor,
    '--color-brand': store?.primaryColor,
    '--color-brand-strong': store?.primaryColor,
    '--color-fg-on-brand': store?.tertiaryColor,
    '--color-surface-page': store?.backgroundColor,
    '--color-surface-raised': store?.cardColor,
    '--color-surface-1': store?.tertiaryColor,
    '--color-fg-strong': store?.textColor,
    '--color-fg-default': store?.textColor,
    '--color-fg-muted': store?.mutedTextColor,
    '--color-fg-subtle': store?.mutedTextColor,
    '--color-fg-faint': store?.mutedTextColor,
    '--color-border': store?.borderColor,
    '--color-input-border': store?.borderColor,
    '--store-secondary': store?.secondaryColor,
    '--store-tertiary': store?.tertiaryColor,
  }

  return Object.fromEntries(
    Object.entries(colors).filter(([, value]) => value != null)
  ) as CSSProperties
}
