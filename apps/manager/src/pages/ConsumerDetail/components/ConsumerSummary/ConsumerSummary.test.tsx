import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useConsumerDetailFacade } from '@pages/ConsumerDetail/facades/useConsumerDetailFacade/useConsumerDetailFacade'

import { ConsumerSummary } from './ConsumerSummary'
import { consumerSummaryMock } from './ConsumerSummary.mock'

vi.mock(
  '@pages/ConsumerDetail/facades/useConsumerDetailFacade/useConsumerDetailFacade'
)

describe('ConsumerSummary', () => {
  it('shows what the consumer spent, ordered, and earned', () => {
    vi.mocked(useConsumerDetailFacade).mockReturnValue({
      consumer: consumerSummaryMock,
    } as unknown as ReturnType<typeof useConsumerDetailFacade>)

    render(<ConsumerSummary />)

    const summary = screen.getByRole('region', { name: 'Resumo' })
    expect(summary).toHaveTextContent('R$ 890,50')
    expect(summary).toHaveTextContent('12')
    expect(summary).toHaveTextContent('Cashback')
    expect(summary).toHaveTextContent('R$ 12,50')
  })

  it('renders nothing while the consumer is unknown', () => {
    vi.mocked(useConsumerDetailFacade).mockReturnValue({
      consumer: undefined,
    } as unknown as ReturnType<typeof useConsumerDetailFacade>)

    const { container } = render(<ConsumerSummary />)

    expect(container).toBeEmptyDOMElement()
  })
})
