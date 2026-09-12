import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCounterFacade } from './useCounterFacade'

const stateOverride = vi.hoisted(() => ({
  value: {} as Record<string, unknown>,
}))

const tenant = vi.hoisted(() => ({
  value: { tenantId: 'tenant-1' } as { tenantId: string } | null,
}))

vi.mock('@shared/hooks/session/useCurrentTenant/useCurrentTenant', () => ({
  useCurrentTenant: () => tenant.value,
}))
vi.mock('@shared/hooks/product/useMenu/useMenu', () => ({
  useMenu: () => ({ sections: [], isPending: false }),
}))
vi.mock(
  '@pages/Counter/hooks/useCounterPaymentMethods/useCounterPaymentMethods',
  () => ({
    useCounterPaymentMethods: () => ({ methods: ['CASH'] }),
  })
)
vi.mock(
  '@pages/Counter/hooks/useCounterAvailability/useCounterAvailability',
  () => ({
    useCounterAvailability: () => ({
      zones: [],
      fee: 0,
      storeAddress: { city: '', state: '' },
      deliveryCities: [],
    }),
  })
)
vi.mock(
  '@pages/Counter/hooks/useCounterAddressSearch/useCounterAddressSearch',
  () => ({
    useCounterAddressSearch: () => ({ suggestions: [], isSearching: false }),
  })
)
vi.mock(
  '@pages/Counter/hooks/useCounterDeliveryQuote/useCounterDeliveryQuote',
  () => ({
    useCounterDeliveryQuote: () => ({ quote: undefined, isQuoting: false }),
  })
)
vi.mock('@pages/Counter/hooks/useCounterCart/useCounterCart', () => ({
  useCounterCart: () => ({ lines: [], count: 0, total: 0, add: vi.fn() }),
}))
vi.mock(
  '@pages/Counter/hooks/useCounterPaymentSelection/useCounterPaymentSelection',
  () => ({
    useCounterPaymentSelection: () => ({ method: 'CASH' }),
  })
)
vi.mock('@pages/Counter/hooks/useCounterCommands/useCounterCommands', () => ({
  useCounterCommands: () => ({ error: null, isSending: false }),
}))
vi.mock('@pages/Counter/hooks/useCounterReceipt/useCounterReceipt', () => ({
  useCounterReceipt: () => ({ lastSale: null, dismissReceipt: vi.fn() }),
}))
vi.mock(
  '@pages/Counter/hooks/useCounterResponsive/useCounterResponsive',
  () => ({
    useCounterResponsive: () => ({ isDesktop: true }),
  })
)
vi.mock('@pages/Counter/states/counter/counter.store', () => ({
  useCounterStore: (selector: (state: object) => unknown) =>
    selector({
      sheet: false,
      consumerName: '',
      tableNumber: '',
      recipient: {
        name: '',
        phone: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        zoneId: '',
      },
      setSheet: vi.fn(),
      setChosenPaymentMethod: vi.fn(),
      setConsumerName: vi.fn(),
      setTableNumber: vi.fn(),
      ...stateOverride.value,
    }),
}))

describe(useCounterFacade.name, () => {
  it('enables pickup with a complete recipient even without a delivery quote', () => {
    stateOverride.value = {
      step: 'destination',
      channel: 'PICKUP',
      recipient: {
        name: 'Ana',
        phone: '91980326878',
        street: 'Travessa We-26',
        number: '471',
        neighborhood: 'Cidade Nova V',
        city: 'Ananindeua',
        state: 'PA',
        complement: '',
        zoneId: '',
      },
    }
    const { result, rerender } = renderHook(() => useCounterFacade())
    expect(result.current.canContinue).toBe(true)
    stateOverride.value = {
      ...stateOverride.value,
      recipient: {
        ...(stateOverride.value.recipient as object),
        phone: '',
      },
    }
    rerender()
    expect(result.current.canContinue).toBe(false)
    stateOverride.value = {}
  })

  it('composes the counter feature contract', () => {
    const { result } = renderHook(() => useCounterFacade())
    expect(result.current).toMatchObject({
      sections: [],
      methods: ['CASH'],
      method: 'CASH',
      isDesktop: true,
    })
  })

  it('composes the feature without an active tenant', () => {
    tenant.value = null
    const { result } = renderHook(() => useCounterFacade())
    expect(result.current.sections).toEqual([])
  })
})
