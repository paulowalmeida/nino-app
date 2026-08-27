import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCustomerDetailFacade } from '@pages/CustomerDetail/facades/useCustomerDetailFacade/useCustomerDetailFacade'

import { CustomerHeader } from './CustomerHeader'
import { customerHeaderMock } from './CustomerHeader.mock'

vi.mock(
  '@pages/CustomerDetail/facades/useCustomerDetailFacade/useCustomerDetailFacade'
)

describe('CustomerHeader', () => {
  it('names the customer and states how long they have bought here', () => {
    vi.mocked(useCustomerDetailFacade).mockReturnValue({
      customer: customerHeaderMock,
    } as unknown as ReturnType<typeof useCustomerDetailFacade>)

    render(<CustomerHeader />)

    expect(
      screen.getByRole('heading', { name: customerHeaderMock.name })
    ).toBeInTheDocument()
    expect(screen.getByText(customerHeaderMock.eyebrow)).toBeInTheDocument()
    expect(screen.getByText(/Cliente desde/)).toHaveTextContent(
      'ainda sem pedido aqui'
    )
  })

  it('renders nothing while the customer is unknown', () => {
    vi.mocked(useCustomerDetailFacade).mockReturnValue({
      customer: undefined,
    } as unknown as ReturnType<typeof useCustomerDetailFacade>)

    const { container } = render(<CustomerHeader />)

    expect(container).toBeEmptyDOMElement()
  })
})
