import { useLocation } from 'react-router'

import type { BackTarget } from '@custom_types/ui/back-target'

const isBackTarget = (value: unknown): value is BackTarget =>
  typeof value === 'object' &&
  value !== null &&
  'to' in value &&
  'label' in value &&
  typeof value.to === 'string' &&
  typeof value.label === 'string'

/**
 * Pra onde o voltar desta tela devolve a pessoa: o lugar de onde ela veio,
 * quando a navegação disse qual foi, ou o caminho de sempre. O `state` chega
 * do histórico do navegador e sobrevive ao F5, mas some se a pessoa colou a
 * URL — daí o fallback, que nunca pode faltar.
 */
export const useBackTarget = (fallback: BackTarget): BackTarget => {
  const { state } = useLocation()

  const origin = (state as { from?: unknown } | null)?.from

  return isBackTarget(origin) ? origin : fallback
}
