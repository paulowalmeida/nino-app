/**
 * `cursor-pointer` é explícito porque o Tailwind v4 deixou de aplicá-lo a
 * `button` no preflight — sem isto todo botão do DS mostra a seta comum.
 */
export const baseLayout =
  'inline-flex cursor-pointer items-center justify-center rounded-full font-medium transition-all'

export const baseFocus =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2'

export const baseDisabled = 'disabled:pointer-events-none disabled:opacity-50'
