import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useConsumerDetailFacade } from '@pages/ConsumerDetail/facades/useConsumerDetailFacade/useConsumerDetailFacade'

import { ConsumerDetail } from './ConsumerDetail'
import { consumerDetailPageMock } from './ConsumerDetail.mock'

vi.mock(
  '@pages/ConsumerDetail/facades/useConsumerDetailFacade/useConsumerDetailFacade'
)
vi.mock(
  '@pages/ConsumerDetail/components/ConsumerHeader/ConsumerHeader',
  () => ({ ConsumerHeader: () => <div>header</div> })
)
vi.mock(
  '@pages/ConsumerDetail/components/ConsumerSummary/ConsumerSummary',
  () => ({ ConsumerSummary: () => <div>summary</div> })
)
vi.mock(
  '@pages/ConsumerDetail/components/ConsumerContact/ConsumerContact',
  () => ({ ConsumerContact: () => <div>contact</div> })
)
vi.mock(
  '@pages/ConsumerDetail/components/ConsumerWorkspace/ConsumerWorkspace',
  () => ({ ConsumerWorkspace: () => <div>workspace</div> })
)
vi.mock(
  '@pages/ConsumerDetail/skeletons/ConsumerDetailSkeleton/ConsumerDetailSkeleton',
  () => ({ ConsumerDetailSkeleton: () => <div>loading</div> })
)

const renderPage = () =>
  render(
    <MemoryRouter>
      <ConsumerDetail />
    </MemoryRouter>
  )

describe('ConsumerDetail', () => {
  beforeEach(() => {
    vi.mocked(useConsumerDetailFacade).mockReturnValue({
      consumer: { name: consumerDetailPageMock.consumerName },
      isPending: false,
    } as unknown as ReturnType<typeof useConsumerDetailFacade>)
  })

  it('composes the consumer detail regions', () => {
    renderPage()

    expect(screen.getByText('header')).toBeInTheDocument()
    expect(screen.getByText('summary')).toBeInTheDocument()
    expect(screen.getByText('contact')).toBeInTheDocument()
    expect(screen.getByText('workspace')).toBeInTheDocument()
    expect(
      screen.getByText(consumerDetailPageMock.consumerName)
    ).toHaveAttribute('aria-current', 'page')
  })

  it('shows the loading skeleton while the consumer is pending', () => {
    vi.mocked(useConsumerDetailFacade).mockReturnValue({
      consumer: undefined,
      isPending: true,
    } as unknown as ReturnType<typeof useConsumerDetailFacade>)

    renderPage()

    expect(screen.getByText('loading')).toBeInTheDocument()
  })

  it('states that the consumer has no order in this store', () => {
    vi.mocked(useConsumerDetailFacade).mockReturnValue({
      consumer: undefined,
      isPending: false,
    } as unknown as ReturnType<typeof useConsumerDetailFacade>)

    renderPage()

    expect(
      screen.getByText(consumerDetailPageMock.emptyMessage)
    ).toBeInTheDocument()
    expect(screen.queryByText('workspace')).not.toBeInTheDocument()
  })
})
