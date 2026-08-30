import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { storefrontStoreMock as homeStoreMock } from '@pages/Storefront/Storefront.mock'

import { StoreAvailabilityBanner } from './StoreAvailabilityBanner'
import { storeAvailabilityBannerMock } from './StoreAvailabilityBanner.mock'

vi.mock('@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade', () => ({
  useStorefrontFacade: vi.fn(),
}))

describe('StoreAvailabilityBanner', () => {
  it('explains that ordering is unavailable when the store is paused', () => {
    vi.mocked(useStorefrontFacade).mockReturnValue({
      store: { ...homeStoreMock, isPaused: true },
      hours: [],
      isHoursPending: false,
    } as never)

    render(<StoreAvailabilityBanner />)

    expect(
      screen.getByText(storeAvailabilityBannerMock.title)
    ).toBeInTheDocument()
  })
})
