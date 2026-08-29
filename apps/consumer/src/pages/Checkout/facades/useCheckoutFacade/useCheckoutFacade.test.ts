import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCartSummary } from '@hooks/useCartSummary'
import { useDeliveryZones } from '@hooks/useDeliveryZones'
import { useOpeningHours } from '@hooks/useOpeningHours'
import { usePublicSettings } from '@hooks/usePublicSettings'
import { useStore } from '@hooks/useStore'
import { useGuestCheckout } from '@pages/checkout/hooks/useGuestCheckout/useGuestCheckout'
import { useCheckoutStore } from '@pages/checkout/states/checkout/checkout.state'

import { useCheckoutFacade } from './useCheckoutFacade'
import { useCheckoutFacadeMock } from './useCheckoutFacade.mock'

vi.mock('@hooks/useCartSummary')
vi.mock('@hooks/useDeliveryZones')
vi.mock('@hooks/useOpeningHours')
vi.mock('@hooks/usePublicSettings')
vi.mock('@hooks/useStore')
vi.mock('@pages/checkout/hooks/useGuestCheckout/useGuestCheckout')
vi.mock('@pages/checkout/states/checkout/checkout.state')

describe('useCheckoutFacade', () => {
  it('composes checkout data and exposes the existing workflow contract', () => {
    const setSlug = vi.fn()
    vi.mocked(useCheckoutStore).mockImplementation(((selector: (state: unknown) => unknown) =>
      selector({ slug: useCheckoutFacadeMock.slug, setSlug })) as never)
    vi.mocked(useStore).mockReturnValue({
      store: { id: useCheckoutFacadeMock.storeId },
      isPending: false,
    } as never)
    vi.mocked(usePublicSettings).mockReturnValue({ settings: undefined } as never)
    vi.mocked(useDeliveryZones).mockReturnValue({ zones: [], isPending: false } as never)
    vi.mocked(useOpeningHours).mockReturnValue({ hours: [], isPending: false } as never)
    vi.mocked(useCartSummary).mockReturnValue({
      lines: {},
      cartLines: [],
      count: useCheckoutFacadeMock.cartCount,
      total: useCheckoutFacadeMock.total,
      clear: vi.fn(),
    } as never)
    const checkout = { submit: vi.fn(), created: undefined }
    vi.mocked(useGuestCheckout).mockReturnValue(checkout as never)

    const { result } = renderHook(() => useCheckoutFacade())

    expect(useStore).toHaveBeenCalledWith(useCheckoutFacadeMock.slug)
    expect(result.current.store?.id).toBe(useCheckoutFacadeMock.storeId)
    expect(result.current.setSlug).toBe(setSlug)
    expect(result.current.submit).toBe(checkout.submit)
  })
})
