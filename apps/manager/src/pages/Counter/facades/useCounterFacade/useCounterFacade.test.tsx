import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCounterFacade } from './useCounterFacade'

const stateOverride = vi.hoisted(() => ({
  value: {} as Record<string, unknown>,
}))

const unit = vi.hoisted(() => ({
  value: { unitId: 'unit-1' } as { unitId: string } | null,
}))

const deliveryQuoteState = vi.hoisted(() => ({
  value: undefined as { fee: number } | undefined,
}))

const availabilityState = vi.hoisted(() => ({
  value: { city: '', state: '' },
}))

const addressSearchSpy = vi.hoisted(() => vi.fn())

vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit', () => ({
  useCurrentUnit: () => unit.value,
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
      storeAddress: availabilityState.value,
      deliveryCities: [],
    }),
  })
)
vi.mock(
  '@pages/Counter/hooks/useCounterAddressSearch/useCounterAddressSearch',
  () => ({
    useCounterAddressSearch: (...args: unknown[]) => {
      addressSearchSpy(...args)
      return { suggestions: [], isSearching: false }
    },
  })
)
vi.mock(
  '@pages/Counter/hooks/useCounterDeliveryQuote/useCounterDeliveryQuote',
  () => ({
    useCounterDeliveryQuote: () => ({
      quote: deliveryQuoteState.value,
      isQuoting: false,
    }),
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
  it('keeps delivery blocked until name and phone have valid lengths', () => {
    deliveryQuoteState.value = { fee: 300 }
    stateOverride.value = {
      step: 'destination',
      channel: 'DELIVERY',
      recipient: {
        name: 'E',
        phone: '9',
        zipCode: '67143450',
        street: 'Travessa WE-69-A',
        number: '471',
        neighborhood: 'Coqueiro',
        city: 'Ananindeua',
        state: 'PA',
        complement: '',
        zoneId: '',
      },
    }

    const { result, rerender } = renderHook(() => useCounterFacade())

    expect(result.current.canContinue).toBe(false)

    stateOverride.value = {
      ...stateOverride.value,
      recipient: {
        ...(stateOverride.value.recipient as object),
        name: 'Edu',
        phone: '(91) 98888-0000',
      },
    }
    rerender()

    expect(result.current.canContinue).toBe(true)
    deliveryQuoteState.value = undefined
    stateOverride.value = {}
  })

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

  it('passes the unit state to address search without forcing a city', () => {
    availabilityState.value = { city: 'Belém', state: 'PA' }
    stateOverride.value = {
      recipient: {
        name: '',
        phone: '',
        street: 'Avenida Nazaré',
        number: '',
        complement: '',
        neighborhood: '',
        zoneId: '',
      },
    }

    renderHook(() => useCounterFacade())

    expect(addressSearchSpy).toHaveBeenCalledWith('Avenida Nazaré', 'PA')
    availabilityState.value = { city: '', state: '' }
    stateOverride.value = {}
    addressSearchSpy.mockClear()
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

  it('composes the feature without an active unit', () => {
    unit.value = null
    const { result } = renderHook(() => useCounterFacade())
    expect(result.current.sections).toEqual([])
  })
})
