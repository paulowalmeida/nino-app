import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCustomerDetailFacade } from '@pages/CustomerDetail/facades/useCustomerDetailFacade/useCustomerDetailFacade'

import { CustomerSummary } from './CustomerSummary'
import { customerSummaryMock } from './CustomerSummary.mock'

vi.mock(
  '@pages/CustomerDetail/facades/useCustomerDetailFacade/useCustomerDetailFacade'
)

describe('CustomerSummary', () => {
  it('shows what the customer spent, ordered, and earned', () => {
    vi.mocked(useCustomerDetailFacade).mockReturnValue({
      customer: customerSummaryMock,
    } as unknown as ReturnType<typeof useCustomerDetailFacade>)

    render(<CustomerSummary />)

    const summary = screen.getByRole('region', { name: 'Resumo' })
    expect(summary).toHaveTextContent('R$ 890,50')
    expect(summary).toHaveTextContent('12')
    expect(summary).toHaveTextContent('120')
  })

  it('renders nothing while the customer is unknown', () => {
    vi.mocked(useCustomerDetailFacade).mockReturnValue({
      customer: undefined,
    } as unknown as ReturnType<typeof useCustomerDetailFacade>)

    const { container } = render(<CustomerSummary />)

    expect(container).toBeEmptyDOMElement()
  })
})
