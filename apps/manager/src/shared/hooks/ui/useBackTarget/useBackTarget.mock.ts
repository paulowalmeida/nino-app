import type { BackTarget } from '@shared/types/ui/back-target'

export const backFallbackMock = { to: '..', label: 'Pedidos' } satisfies BackTarget

export const backOriginMock = {
  to: '/loja/comandas',
  label: 'Comandas',
} satisfies BackTarget

export const brokenOriginMock = { to: 42, label: null }
