import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCustomerDetailFacade } from '@pages/CustomerDetail/facades/useCustomerDetailFacade/useCustomerDetailFacade'

import { CustomerContact } from './CustomerContact'
import {
  customerContactMock,
  customerWithoutContactExtrasMock,
} from './CustomerContact.mock'

vi.mock(
  '@pages/CustomerDetail/facades/useCustomerDetailFacade/useCustomerDetailFacade'
)

describe('CustomerContact', () => {
  it('offers calling and writing to the customer', () => {
    vi.mocked(useCustomerDetailFacade).mockReturnValue({
      customer: customerContactMock,
    } as unknown as ReturnType<typeof useCustomerDetailFacade>)

    render(<CustomerContact />)

    expect(screen.getByRole('link', { name: /11/ })).toHaveAttribute(
      'href',
      'tel:11988887777'
    )
    expect(
      screen.getByRole('link', { name: customerContactMock.email })
    ).toHaveAttribute('href', 'mailto:maria@example.com')
    expect(screen.getByText(/CPF/)).toHaveTextContent('390.533.447-05')
  })

  it('keeps only the phone action when email and document are missing', () => {
    vi.mocked(useCustomerDetailFacade).mockReturnValue({
      customer: customerWithoutContactExtrasMock,
    } as unknown as ReturnType<typeof useCustomerDetailFacade>)

    render(<CustomerContact />)

    expect(screen.getAllByRole('link')).toHaveLength(1)
    expect(screen.queryByText(/CPF/)).not.toBeInTheDocument()
  })

  it('renders nothing while the customer is unknown', () => {
    vi.mocked(useCustomerDetailFacade).mockReturnValue({
      customer: undefined,
    } as unknown as ReturnType<typeof useCustomerDetailFacade>)

    const { container } = render(<CustomerContact />)

    expect(container).toBeEmptyDOMElement()
  })
})
