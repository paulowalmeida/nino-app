import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'

import { StoreBanner } from './StoreBanner'
import { storeBannerMock } from './StoreBanner.mock'
import styles from './StoreBanner.module.css'

vi.mock(
  '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade',
  () => ({
    useStorefrontFacade: vi.fn(),
  })
)

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

  it('removes the store watermark from a custom banner', () => {
    vi.mocked(useStorefrontFacade).mockReturnValue({
      store: {
        logoUrl: 'https://cdn.example/logo.png',
        bannerUrl: 'https://cdn.example/banner.png',
      },
    } as never)
    const { container } = render(<StoreBanner />)

    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      'https://cdn.example/banner.png'
    )
    expect(container.querySelectorAll('img')).toHaveLength(1)
    expect(container.querySelector(`.${styles.mark}`)).not.toBeInTheDocument()
  })
})
