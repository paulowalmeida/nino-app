import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useMenu } from '@pages/Storefront/hooks/useMenu/useMenu'
import { useOpeningHours } from '@hooks/useOpeningHours/useOpeningHours'
import { usePublicSettings } from '@hooks/usePublicSettings/usePublicSettings'
import { useStore } from '@hooks/useStore/useStore'
import { useIsDesktop } from '@pages/Storefront/hooks/useIsDesktop/useIsDesktop'
import { useMenuSections } from '@pages/Storefront/hooks/useMenuSections/useMenuSections'
import { useMenuItemAction } from '@pages/Storefront/hooks/useMenuItemAction/useMenuItemAction'
import { useStorefrontCart } from '@pages/Storefront/hooks/useStorefrontCart/useStorefrontCart'
import { useStorefrontSlug } from '@pages/Storefront/hooks/useStorefrontSlug/useStorefrontSlug'
import { useConsumerSession } from '@shared/hooks/useConsumerSession/useConsumerSession'
import { useLogout } from '@shared/hooks/useLogout/useLogout'

import { useStorefrontFacade } from './useStorefrontFacade'
import { storefrontFacadeMock } from './useStorefrontFacade.mock'

vi.mock('@pages/Storefront/hooks/useMenu/useMenu', () => ({ useMenu: vi.fn() }))
vi.mock('@hooks/useOpeningHours/useOpeningHours')
vi.mock('@hooks/usePublicSettings/usePublicSettings')
vi.mock('@hooks/useStore/useStore')
vi.mock('@pages/Storefront/hooks/useIsDesktop/useIsDesktop')
vi.mock('@pages/Storefront/hooks/useMenuSections/useMenuSections')
vi.mock('@pages/Storefront/hooks/useMenuItemAction/useMenuItemAction')
vi.mock('@pages/Storefront/hooks/useStorefrontCart/useStorefrontCart')
vi.mock('@pages/Storefront/hooks/useStorefrontSlug/useStorefrontSlug')
vi.mock('@shared/hooks/useConsumerSession/useConsumerSession')
vi.mock('@shared/hooks/useLogout/useLogout')

vi.mock('@hooks/usePromotionOffers/usePromotionOffers', () => ({
  usePromotionOffers: () => ({
    freeDelivery: undefined,
    discountOffers: [],
    couponSuggestions: [],
    refetchOffers: () => undefined,
  }),
}))

describe('useStorefrontFacade', () => {
  it('exposes the composed home contract for the requested store', () => {
    vi.mocked(useStorefrontSlug).mockReturnValue(storefrontFacadeMock.slug)
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
    vi.mocked(useStorefrontCart).mockReturnValue({
      cart: {},
      cartLines: [],
      cartCount: 0,
      cartTotal: 0,
    } as unknown as ReturnType<typeof useStorefrontCart>)
    vi.mocked(useMenuSections).mockReturnValue({
      visibleSections: [],
      activeId: null,
      goToSection: vi.fn(),
      sectionDomId: vi.fn(),
      isSearching: false,
    })
    vi.mocked(useMenuItemAction).mockReturnValue({
      addFromMenu: vi.fn(),
      openProduct: vi.fn(),
    })
    vi.mocked(useIsDesktop).mockReturnValue(true)
    vi.mocked(useConsumerSession).mockReturnValue({
      consumer: null,
      isPending: false,
    })
    vi.mocked(useLogout).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useLogout>)

    const { result } = renderHook(() =>
      useStorefrontFacade(storefrontFacadeMock.slug)
    )

    expect(useStore).toHaveBeenCalledWith(storefrontFacadeMock.slug)
    expect(useMenu).toHaveBeenCalledWith(storefrontFacadeMock.storeId)
    expect(result.current.estimatedMinutes).toBe(
      storefrontFacadeMock.estimatedMinutes
    )
    expect(result.current.cartCount).toBe(0)
    expect(result.current.isDesktop).toBe(true)
  })
})
