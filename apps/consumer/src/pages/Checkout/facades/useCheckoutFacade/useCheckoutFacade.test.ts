import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCartSummary } from '@hooks/useCartSummary/useCartSummary'
import { useDeliveryZones } from '@pages/checkout/hooks/useDeliveryZones/useDeliveryZones'
import { useOpeningHours } from '@hooks/useOpeningHours/useOpeningHours'
import { usePublicSettings } from '@hooks/usePublicSettings/usePublicSettings'
import { useStore } from '@hooks/useStore/useStore'
import { useCheckoutWorkflow } from '@pages/checkout/hooks/useCheckoutWorkflow/useCheckoutWorkflow'
import { useCheckoutStore } from '@pages/checkout/states/checkout/checkout.state'
import { useCustomerSession } from '@shared/hooks/useCustomerSession/useCustomerSession'
import { useMyAddresses } from '@shared/hooks/useMyAddresses/useMyAddresses'

import { useCheckoutFacade } from './useCheckoutFacade'
import { useCheckoutFacadeMock } from './useCheckoutFacade.mock'

vi.mock('@hooks/useCartSummary/useCartSummary')
vi.mock('@pages/checkout/hooks/useDeliveryZones/useDeliveryZones')
vi.mock('@hooks/useOpeningHours/useOpeningHours')
vi.mock('@hooks/usePublicSettings/usePublicSettings')
vi.mock('@hooks/useStore/useStore')
vi.mock('@pages/checkout/hooks/useCheckoutWorkflow/useCheckoutWorkflow')
vi.mock('@pages/checkout/states/checkout/checkout.state')
vi.mock('@shared/hooks/useCustomerSession/useCustomerSession')
vi.mock('@shared/hooks/useMyAddresses/useMyAddresses')

describe('useCheckoutFacade', () => {
  it('composes checkout data and exposes the existing workflow contract', () => {
    const setSlug = vi.fn()
    vi.mocked(useCheckoutStore).mockImplementation(((
      selector: (state: unknown) => unknown
    ) =>
      selector({
        slug: useCheckoutFacadeMock.slug,
        setSlug,
      })) as unknown as typeof useCheckoutStore)
    vi.mocked(useStore).mockReturnValue({
      store: { id: useCheckoutFacadeMock.storeId },
      isPending: false,
    } as unknown as ReturnType<typeof useStore>)
    vi.mocked(usePublicSettings).mockReturnValue({
      settings: undefined,
      estimatedMinutes: undefined,
    } as unknown as ReturnType<typeof usePublicSettings>)
    vi.mocked(useDeliveryZones).mockReturnValue({
      zones: [],
      isPending: false,
    } as unknown as ReturnType<typeof useDeliveryZones>)
    vi.mocked(useOpeningHours).mockReturnValue({
      hours: [],
      isPending: false,
    } as unknown as ReturnType<typeof useOpeningHours>)
    vi.mocked(useCustomerSession).mockReturnValue({
      customer: null,
    } as unknown as ReturnType<typeof useCustomerSession>)
    vi.mocked(useMyAddresses).mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useMyAddresses>)
    vi.mocked(useCartSummary).mockReturnValue({
      tenantId: 'another-store',
      lines: {},
      cartLines: [
        {
          item: {
            id: 'item-1',
            name: 'Item de outra loja',
            price: '10',
            imageUrl: null,
          },
          quantity: 1,
        },
      ],
      count: useCheckoutFacadeMock.cartCount,
      total: useCheckoutFacadeMock.total,
      clear: vi.fn(),
    } as unknown as ReturnType<typeof useCartSummary>)
    const checkout = { submit: vi.fn(), created: undefined }
    vi.mocked(useCheckoutWorkflow).mockReturnValue(
      checkout as unknown as ReturnType<typeof useCheckoutWorkflow>
    )

    const { result } = renderHook(() => useCheckoutFacade())

    expect(useStore).toHaveBeenCalledWith(useCheckoutFacadeMock.slug)
    expect(result.current.store?.id).toBe(useCheckoutFacadeMock.storeId)
    expect(result.current.setSlug).toBe(setSlug)
    expect(result.current.submit).toBe(checkout.submit)
    expect(result.current.cartLines).toEqual([])
    expect(useCheckoutWorkflow).toHaveBeenCalledWith(
      expect.objectContaining({ cartLines: [] })
    )
  })
})
