import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useHomeFacade } from '@pages/Home/facades/useHomeFacade/useHomeFacade'

import { StoreBanner } from './StoreBanner'
import { storeBannerMock } from './StoreBanner.mock'

vi.mock('@pages/Home/facades/useHomeFacade/useHomeFacade', () => ({ useHomeFacade: vi.fn() }))

describe('StoreBanner', () => {
  it('renders without a logo when the store has no logo', () => {
    vi.mocked(useHomeFacade).mockReturnValue({ store: { logoUrl: storeBannerMock.logoUrl } } as never)
    const { container } = render(<StoreBanner />)
    expect(container.querySelector('img')).not.toBeInTheDocument()
  })
})
