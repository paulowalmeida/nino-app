import type { CSSProperties } from 'react'

import type { Store } from '@shared/types/store/store'

export const toStoreTheme = (store?: Store | null): CSSProperties => {
  const colors = {
    '--store-tint': store?.primaryColor,
    '--color-brand': store?.primaryColor,
    '--color-brand-strong': store?.primaryColor,
  }

  return Object.fromEntries(
    Object.entries(colors).filter(([, value]) => value != null)
  ) as CSSProperties
}
