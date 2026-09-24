import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCheckoutCart } from '@pages/checkout/hooks/useCheckoutCart/useCheckoutCart'
import { useDeliveryZones } from '@pages/checkout/hooks/useDeliveryZones/useDeliveryZones'
import { useOpeningHours } from '@hooks/useOpeningHours/useOpeningHours'
import { usePublicSettings } from '@hooks/usePublicSettings/usePublicSettings'
import { useStore } from '@hooks/useStore/useStore'
import { useCheckoutWorkflow } from '@pages/checkout/hooks/useCheckoutWorkflow/useCheckoutWorkflow'
import { useCheckoutStore } from '@pages/checkout/states/checkout/checkout.state'
import { useConsumerSession } from '@shared/hooks/useConsumerSession/useConsumerSession'
import { useMyAddresses } from '@shared/hooks/useMyAddresses/useMyAddresses'
import { useCheckoutResume } from '@pages/checkout/hooks/useCheckoutResume/useCheckoutResume'

import { useCheckoutFacadeValue } from './useCheckoutFacade'
import { useCheckoutFacadeMock } from './useCheckoutFacade.mock'

vi.mock('@pages/checkout/hooks/useCheckoutCart/useCheckoutCart')
vi.mock('@pages/checkout/hooks/useDeliveryZones/useDeliveryZones')
vi.mock('@hooks/useOpeningHours/useOpeningHours')
vi.mock('@hooks/usePublicSettings/usePublicSettings')
vi.mock('@hooks/useStore/useStore')
vi.mock('@pages/checkout/hooks/useCheckoutWorkflow/useCheckoutWorkflow')
vi.mock('@pages/checkout/states/checkout/checkout.state')
vi.mock('@shared/hooks/useConsumerSession/useConsumerSession')
vi.mock('@shared/hooks/useMyAddresses/useMyAddresses')
vi.mock('@pages/checkout/hooks/useCheckoutResume/useCheckoutResume')
vi.mock('@utils/store-info', () => ({ isOpen: vi.fn(() => true) }))

describe('useCheckoutFacadeValue', () => {
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
    vi.mocked(useConsumerSession).mockReturnValue({
      consumer: null,
    } as unknown as ReturnType<typeof useConsumerSession>)
    vi.mocked(useMyAddresses).mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useMyAddresses>)
    vi.mocked(useCheckoutResume).mockReturnValue(null)
    vi.mocked(useCheckoutCart).mockReturnValue({
      unitId: 'store-1',
      lines: {},
      cartLines: [],
      count: useCheckoutFacadeMock.cartCount,
      total: useCheckoutFacadeMock.total,
      clear: vi.fn(),
    } as unknown as ReturnType<typeof useCheckoutCart>)
    const checkout = {
      onSubmit: vi.fn(),
      form: {} as never,
      created: undefined,
    }
    vi.mocked(useCheckoutWorkflow).mockReturnValue(
      checkout as unknown as ReturnType<typeof useCheckoutWorkflow>
    )

    const { result } = renderHook(() =>
      useCheckoutFacadeValue(useCheckoutFacadeMock.slug)
    )

    expect(useStore).toHaveBeenCalledWith(useCheckoutFacadeMock.slug)
    expect(useCheckoutResume).toHaveBeenCalledWith(
      expect.objectContaining({
        storeSlug: useCheckoutFacadeMock.slug,
        isStoreReady: true,
        cartItemCount: 0,
      })
    )
    expect(result.current.store?.id).toBe(useCheckoutFacadeMock.storeId)
    expect(result.current.setSlug).toBe(setSlug)
    expect(result.current.onSubmit).toBe(checkout.onSubmit)
    expect(result.current.cartLines).toEqual([])
    expect(useCheckoutWorkflow).toHaveBeenCalledWith(
      expect.objectContaining({ cartLines: [] })
    )
  })
})
