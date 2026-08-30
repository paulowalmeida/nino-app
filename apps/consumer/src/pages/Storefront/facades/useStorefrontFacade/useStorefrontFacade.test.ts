import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCartSummary } from '@hooks/useCartSummary/useCartSummary'
import { useMenu } from '@pages/Storefront/hooks/useMenu/useMenu'
import { useOpeningHours } from '@hooks/useOpeningHours/useOpeningHours'
import { usePublicSettings } from '@hooks/usePublicSettings/usePublicSettings'
import { useStore } from '@hooks/useStore/useStore'
import { cartItemAdapterMock } from '@pages/Storefront/adapters/cartItem.adapter/cartItem.adapter.mock'

import { useStorefrontFacade } from './useStorefrontFacade'
import { storefrontFacadeMock } from './useStorefrontFacade.mock'

vi.mock('@hooks/useCartSummary/useCartSummary')
vi.mock('@pages/Storefront/hooks/useMenu/useMenu', () => ({ useMenu: vi.fn() }))
vi.mock('@hooks/useOpeningHours/useOpeningHours')
vi.mock('@hooks/usePublicSettings/usePublicSettings')
vi.mock('@hooks/useStore/useStore')

describe('useStorefrontFacade', () => {
  it('exposes the composed home contract for the requested store', () => {
    const add = vi.fn(() => true)
    vi.mocked(useStore).mockReturnValue({
      store: { id: storefrontFacadeMock.storeId },
      isPending: false,
    } as unknown as ReturnType<typeof useStore>)
    vi.mocked(useMenu).mockReturnValue({
      sections: [],
      isPending: false,
    } as unknown as ReturnType<typeof useMenu>)
    vi.mocked(useOpeningHours).mockReturnValue({
      hours: [],
      isPending: false,
    } as unknown as ReturnType<typeof useOpeningHours>)
    vi.mocked(usePublicSettings).mockReturnValue({
      settings: {
        preparationMinutes: 25,
        deliveryMinutes: 10,
      },
      estimatedMinutes: 35,
    } as unknown as ReturnType<typeof usePublicSettings>)
    vi.mocked(useCartSummary).mockReturnValue({
      tenantId: storefrontFacadeMock.storeId,
      lines: {},
      cartLines: [],
      count: 0,
      total: 0,
      add,
      replace: vi.fn(),
    } as unknown as ReturnType<typeof useCartSummary>)

    const { result } = renderHook(() =>
      useStorefrontFacade(storefrontFacadeMock.slug)
    )

    expect(useStore).toHaveBeenCalledWith(storefrontFacadeMock.slug)
    expect(useMenu).toHaveBeenCalledWith(storefrontFacadeMock.storeId)
    expect(result.current.estimatedMinutes).toBe(
      storefrontFacadeMock.estimatedMinutes
    )
    expect(result.current.cartCount).toBe(0)

    expect(result.current.addToCart(cartItemAdapterMock.item, 2)).toBe(true)
    expect(add).toHaveBeenCalledWith(
      storefrontFacadeMock.storeId,
      {
        id: cartItemAdapterMock.item.id,
        name: cartItemAdapterMock.item.name,
        price: cartItemAdapterMock.item.price,
        imageUrl: cartItemAdapterMock.item.images[0].url,
      },
      2
    )
  })
})
