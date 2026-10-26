import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useConsumerDetailFacade } from '@pages/ConsumerDetail/facades/useConsumerDetailFacade/useConsumerDetailFacade'

import { ConsumerContact } from './ConsumerContact'
import {
  consumerContactMock,
  consumerWithoutContactExtrasMock,
} from './ConsumerContact.mock'

vi.mock(
  '@pages/ConsumerDetail/facades/useConsumerDetailFacade/useConsumerDetailFacade'
)

describe('ConsumerContact', () => {
  it('offers calling and writing to the consumer', () => {
    vi.mocked(useConsumerDetailFacade).mockReturnValue({
      consumer: consumerContactMock,
    } as unknown as ReturnType<typeof useConsumerDetailFacade>)

    render(<ConsumerContact />)

    expect(screen.getByRole('link', { name: /11/ })).toHaveAttribute(
      'href',
      'tel:11988887777'
    )
    expect(
      screen.getByRole('link', { name: consumerContactMock.email })
    ).toHaveAttribute('href', 'mailto:maria@example.com')
    expect(screen.getByText(/CPF/)).toHaveTextContent('390.533.447-05')
  })

  it('keeps only the phone action when email and document are missing', () => {
    vi.mocked(useConsumerDetailFacade).mockReturnValue({
      consumer: consumerWithoutContactExtrasMock,
    } as unknown as ReturnType<typeof useConsumerDetailFacade>)

    render(<ConsumerContact />)

    expect(screen.getAllByRole('link')).toHaveLength(1)
    expect(screen.queryByText(/CPF/)).not.toBeInTheDocument()
  })

  it('renders nothing while the consumer is unknown', () => {
    vi.mocked(useConsumerDetailFacade).mockReturnValue({
      consumer: undefined,
    } as unknown as ReturnType<typeof useConsumerDetailFacade>)

    const { container } = render(<ConsumerContact />)

    expect(container).toBeEmptyDOMElement()
  })
})
