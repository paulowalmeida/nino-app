import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useAcceptedPayments } from '@pages/Counter/hooks/useAcceptedPayments/useAcceptedPayments'

import { useCounterPaymentMethods } from './useCounterPaymentMethods'

vi.mock('@pages/Counter/hooks/useAcceptedPayments/useAcceptedPayments', () => ({
  useAcceptedPayments: vi.fn(),
}))

describe(useCounterPaymentMethods.name, () => {
  it('only offers cash at the counter', () => {
    vi.mocked(useAcceptedPayments).mockReturnValue({
      methods: ['CASH', 'CARD_ONLINE', 'PIX', 'CARD_ON_DELIVERY'],
    } as never)
    const { result } = renderHook(() => useCounterPaymentMethods('unit-1'))
    expect(result.current.methods).toEqual(['CASH'])
  })
})
