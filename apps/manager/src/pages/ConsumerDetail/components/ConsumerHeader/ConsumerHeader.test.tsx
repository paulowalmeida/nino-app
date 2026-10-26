import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useConsumerDetailFacade } from '@pages/ConsumerDetail/facades/useConsumerDetailFacade/useConsumerDetailFacade'

import { ConsumerHeader } from './ConsumerHeader'
import { consumerHeaderMock } from './ConsumerHeader.mock'

vi.mock(
  '@pages/ConsumerDetail/facades/useConsumerDetailFacade/useConsumerDetailFacade'
)

describe('ConsumerHeader', () => {
  it('names the consumer and states how long they have bought here', () => {
    vi.mocked(useConsumerDetailFacade).mockReturnValue({
      consumer: consumerHeaderMock,
    } as unknown as ReturnType<typeof useConsumerDetailFacade>)

    render(<ConsumerHeader />)

    expect(
      screen.getByRole('heading', { name: consumerHeaderMock.name })
    ).toBeInTheDocument()
    expect(screen.getByText(consumerHeaderMock.eyebrow)).toBeInTheDocument()
    expect(screen.getByText(/Cliente desde/)).toHaveTextContent(
      'ainda sem pedido aqui'
    )
  })

  it('renders nothing while the consumer is unknown', () => {
    vi.mocked(useConsumerDetailFacade).mockReturnValue({
      consumer: undefined,
    } as unknown as ReturnType<typeof useConsumerDetailFacade>)

    const { container } = render(<ConsumerHeader />)

    expect(container).toBeEmptyDOMElement()
  })
})
