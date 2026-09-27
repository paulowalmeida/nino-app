import type { Store } from '@custom_types/store/store'

type ThemeVars = Record<`--${string}`, string>

const value = (input?: string | null): string | undefined => {
  const normalized = input?.trim()
  return normalized || undefined
}

export const storeThemePrimaryColor = (store?: Store): string | undefined =>
  value(store?.theme?.config.colors.primary) ?? value(store?.primaryColor)

export const storeThemeLogoUrl = (store?: Store): string | null =>
  value(store?.theme?.config.brand.logoUrl) ?? value(store?.logoUrl) ?? null

export const storeThemeBannerUrl = (store?: Store): string | null =>
  value(store?.theme?.config.brand.bannerUrl) ?? value(store?.bannerUrl) ?? null

const radiusVars = (radius: 'square' | 'soft' | 'round'): ThemeVars => {
  if (radius === 'square') {
    return {
      '--radius-1': '0px',
      '--radius-2': '0px',
      '--radius-3': '0px',
      '--radius-4': '0px',
      '--radius-5': '0px',
      '--radius-6': '0px',
    }
  }

  if (radius === 'round') {
    return {
      '--radius-1': '8px',
      '--radius-2': '12px',
      '--radius-3': '16px',
      '--radius-4': '20px',
      '--radius-5': '24px',
      '--radius-6': '28px',
    }
  }

  return {}
}

/** Tema publicado -> tokens semânticos do Design System do Consumer. */
export const storeThemeVariables = (store?: Store): ThemeVars => {
  if (!store) return {}

  const config = store.theme?.config
  const colors = config?.colors
  const primary = storeThemePrimaryColor(store)
  const secondary = value(colors?.secondary) ?? value(store.secondaryColor)
  const tertiary = value(colors?.tertiary) ?? value(store.tertiaryColor)
  const background = value(colors?.background) ?? value(store.backgroundColor)
  const surface = value(colors?.surface) ?? value(store.cardColor)
  const foreground = value(colors?.text) ?? value(store.textColor)
  const muted = value(colors?.mutedText) ?? value(store.mutedTextColor)
  const border = value(colors?.border) ?? value(store.borderColor)

  const vars: ThemeVars = {}

  if (primary) {
    vars['--store-tint'] = primary
    vars['--color-brand'] = primary
    vars['--color-brand-light'] = secondary ?? primary
    vars['--color-brand-strong'] = tertiary ?? primary
    vars['--color-input-border-focus'] = primary
  }

  if (background) vars['--color-surface-page'] = background

  if (surface) {
    const mixTarget = foreground ?? '#000000'
    vars['--color-surface-raised'] = surface
    vars['--color-surface-1'] = surface
    vars['--color-surface-2'] = `color-mix(in srgb, ${surface} 94%, ${mixTarget})`
    vars['--color-surface-3'] = `color-mix(in srgb, ${surface} 90%, ${mixTarget})`
    vars['--color-surface-4'] = `color-mix(in srgb, ${surface} 86%, ${mixTarget})`
    vars['--color-surface-5'] = `color-mix(in srgb, ${surface} 82%, ${mixTarget})`
    vars['--color-surface-6'] = `color-mix(in srgb, ${surface} 78%, ${mixTarget})`
  }

  if (foreground) {
    vars['--color-fg-default'] = foreground
    vars['--color-fg-strong'] = foreground
  }

  if (muted ?? foreground) {
    const mutedValue = muted ?? foreground
    if (mutedValue) {
      vars['--color-fg-muted'] = mutedValue
      vars['--color-fg-subtle'] = mutedValue
      vars['--color-fg-faint'] = mutedValue
    }
  }

  if (border) vars['--color-border'] = border
  if (config?.shape.border === 'none') vars['--color-border'] = 'transparent'
  if (config?.shape.radius) Object.assign(vars, radiusVars(config.shape.radius))

  const headingFont = value(config?.typography.headingFont)
  const bodyFont = value(config?.typography.bodyFont)
  if (headingFont && headingFont !== 'default') vars['--font-display'] = headingFont
  if (bodyFont && bodyFont !== 'default') vars['--font-sans'] = bodyFont

  return vars
}
