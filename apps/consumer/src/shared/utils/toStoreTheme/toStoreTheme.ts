import type { CSSProperties } from 'react'

import type { Store } from '@shared/types/store/store'

const RADIUS_BY_SHAPE = {
  square: '0px',
  soft: '10px',
  round: '20px',
} as const

/**
 * As cores da loja viram custom properties na raiz da vitrine.
 *
 * A fonte da verdade é o tema publicado; as colunas de cor do próprio `Unit`
 * ficam como degrau de trás para as lojas que ainda não publicaram nenhuma
 * versão, e saem quando todas tiverem migrado.
 */
export const toStoreTheme = (store?: Store | null): CSSProperties => {
  const themeColors = store?.theme?.config.colors
  const shape = store?.theme?.config.shape

  const primary = themeColors?.primary ?? store?.primaryColor
  const secondary = themeColors?.secondary ?? store?.secondaryColor
  const tertiary = themeColors?.tertiary ?? store?.tertiaryColor
  const background = themeColors?.background ?? store?.backgroundColor
  const surface = themeColors?.surface ?? store?.cardColor
  const text = themeColors?.text ?? store?.textColor
  const mutedText = themeColors?.mutedText ?? store?.mutedTextColor
  const border = themeColors?.border ?? store?.borderColor

  const styles = {
    '--store-tint': primary,
    '--color-brand': primary,
    '--color-brand-strong': primary,
    '--color-fg-on-brand': tertiary,
    '--color-surface-page': background,
    '--color-surface-raised': surface,
    '--color-surface-1': tertiary,
    '--color-fg-strong': text,
    '--color-fg-default': text,
    '--color-fg-muted': mutedText,
    '--color-fg-subtle': mutedText,
    '--color-fg-faint': mutedText,
    '--color-border': border,
    '--color-input-border': border,
    '--store-secondary': secondary,
    '--store-tertiary': tertiary,
    '--store-radius': shape ? RADIUS_BY_SHAPE[shape.radius] : undefined,
  }

  return Object.fromEntries(
    Object.entries(styles).filter(([, value]) => value != null)
  ) as CSSProperties
}
