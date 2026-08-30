import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'

import { StoreBanner } from './StoreBanner'
import { storeBannerMock } from './StoreBanner.mock'

vi.mock('@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade', () => ({
  useStorefrontFacade: vi.fn(),
}))

describe('StoreBanner', () => {
  it('uses the store initials when the store has no logo', () => {
    vi.mocked(useStorefrontFacade).mockReturnValue({
      store: {
        logoUrl: storeBannerMock.logoUrl,
        customName: storeBannerMock.customName,
      },
    } as never)
    const { container } = render(<StoreBanner />)

    expect(container.querySelector('img')).not.toBeInTheDocument()
    expect(container).toHaveTextContent(storeBannerMock.initials)
  })
})
