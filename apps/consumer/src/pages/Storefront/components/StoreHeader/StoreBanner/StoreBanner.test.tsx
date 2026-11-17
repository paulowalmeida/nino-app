import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'

import { StoreBanner } from './StoreBanner'

vi.mock(
  '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade',
  () => ({
    useStorefrontFacade: vi.fn(),
  })
)

describe('StoreBanner', () => {
  it('renders the store identity banner when there is no custom banner', () => {
    vi.mocked(useStorefrontFacade).mockReturnValue({
      store: { logoUrl: 'https://cdn.example/logo.png' },
      bannerOffers: [],
    } as never)
    const { container } = render(
      <MemoryRouter>
        <StoreBanner />
      </MemoryRouter>
    )

    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      'https://cdn.example/logo.png'
    )
  })

  it('renders the custom banner image', () => {
    vi.mocked(useStorefrontFacade).mockReturnValue({
      store: {
        logoUrl: 'https://cdn.example/logo.png',
        bannerUrl: 'https://cdn.example/banner.png',
      },
      bannerOffers: [],
    } as never)
    const { container } = render(
      <MemoryRouter>
        <StoreBanner />
      </MemoryRouter>
    )

    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      'https://cdn.example/banner.png'
    )
    expect(container.querySelectorAll('img')).toHaveLength(1)
  })
})
