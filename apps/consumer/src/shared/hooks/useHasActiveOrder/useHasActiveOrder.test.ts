import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useConsumerSession } from '@shared/hooks/useConsumerSession/useConsumerSession'
import { useGuestOrders } from '@shared/hooks/useGuestOrders/useGuestOrders'
import { useMyOrders } from '@shared/hooks/useMyOrders/useMyOrders'
import { useHasActiveOrder } from './useHasActiveOrder'

vi.mock('@shared/hooks/useConsumerSession/useConsumerSession')
vi.mock('@shared/hooks/useGuestOrders/useGuestOrders')
vi.mock('@shared/hooks/useMyOrders/useMyOrders')

describe('useHasActiveOrder', () => {
  beforeEach(() => {
    vi.mocked(useConsumerSession).mockReturnValue({ consumer: null } as never)
    vi.mocked(useGuestOrders).mockReturnValue([])
    vi.mocked(useMyOrders).mockReturnValue({ data: [] } as never)
  })

  it('não acende sem pedido guardado nem pedido aberto na conta', () => {
    expect(renderHook(() => useHasActiveOrder('loja')).result.current).toBe(
      false
    )
  })

  it('acende com pedido de convidado guardado no dispositivo', () => {
    vi.mocked(useGuestOrders).mockReturnValue([{ orderId: 'o1' }] as never)
    expect(renderHook(() => useHasActiveOrder('loja')).result.current).toBe(
      true
    )
  })

  it('acende só com pedido da conta que ainda não terminou', () => {
    vi.mocked(useMyOrders).mockReturnValue({
      data: [{ status: 'COMPLETED' }, { status: 'PREPARING' }],
    } as never)
    expect(renderHook(() => useHasActiveOrder('loja')).result.current).toBe(
      true
    )
  })
})
