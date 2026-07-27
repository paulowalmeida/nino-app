/**
 * `cursor-pointer` é explícito porque o Tailwind v4 deixou de aplicá-lo a
 * `button` no preflight — sem isto todo botão do DS mostra a seta comum.
 */
/* Mesma curva das superfícies, tempo mais curto: troca de cor no hover não
 * é deslocamento, e a 460ms do cartão parece atraso de resposta. */
export const baseLayout =
  'inline-flex cursor-pointer items-center justify-center rounded-full ' +
  'font-semibold transition-all duration-200 ' +
  'ease-[cubic-bezier(0.22,1,0.36,1)]'

/* Contorno, não anel com afastamento: `ring-offset` pinta o vão de branco, e
 * sobre superfície quente aquilo lê como recorte em volta do botão. */
export const baseFocus =
  'focus-visible:outline-2 focus-visible:outline-brand ' +
  'focus-visible:outline-offset-2'

export const baseDisabled = 'disabled:pointer-events-none disabled:opacity-50'
