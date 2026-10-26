import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePromotionsFacade } from '@pages/Promotions/facades/usePromotionsFacade/usePromotionsFacade'

import { Promotions } from './Promotions'
import { promotionsPageMock } from './Promotions.mock'

vi.mock('@pages/Promotions/facades/usePromotionsFacade/usePromotionsFacade')
vi.mock('@pages/Promotions/components/PromotionsHeader/PromotionsHeader', () => ({
  PromotionsHeader: () => <div>promotions header</div>,
}))
vi.mock('@pages/Promotions/components/PromotionsContent/PromotionsContent', () => ({
  PromotionsContent: () => <div>promotions content</div>,
}))
vi.mock(
  '@pages/Promotions/components/PromotionsLoadError/PromotionsLoadError',
  () => ({ PromotionsLoadError: () => <div>load error</div> })
)
vi.mock(
  '@pages/Promotions/skeletons/CampaignTableSkeleton/CampaignTableSkeleton',
  () => ({ CampaignTableSkeleton: () => <div>loading campaigns</div> })
)

const withFacade = (state: { isPending: boolean; isError: boolean }) =>
  vi
    .mocked(usePromotionsFacade)
    .mockReturnValue(state as unknown as ReturnType<typeof usePromotionsFacade>)

describe('Promotions', () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows the campaigns under the screen header', () => {
    withFacade({ isPending: false, isError: false })

    render(<Promotions />)

    expect(screen.getByText(promotionsPageMock.header)).toBeInTheDocument()
    expect(screen.getByText(promotionsPageMock.content)).toBeInTheDocument()
  })

  it('holds the table geometry while the campaigns load', () => {
    withFacade({ isPending: true, isError: false })

    render(<Promotions />)

    expect(screen.getByText(promotionsPageMock.skeleton)).toBeInTheDocument()
  })

  it('offers a retry when the campaigns fail to load', () => {
    withFacade({ isPending: false, isError: true })

    render(<Promotions />)

    expect(screen.getByText(promotionsPageMock.error)).toBeInTheDocument()
    expect(screen.queryByText(promotionsPageMock.content)).not.toBeInTheDocument()
  })
})
