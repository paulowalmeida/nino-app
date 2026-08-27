import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCustomerDetailFacade } from '@pages/CustomerDetail/facades/useCustomerDetailFacade/useCustomerDetailFacade'

import { CustomerAddresses } from './CustomerAddresses'
import { customerAddressRowsMock } from './CustomerAddresses.mock'

vi.mock(
  '@pages/CustomerDetail/facades/useCustomerDetailFacade/useCustomerDetailFacade'
)

describe('CustomerAddresses', () => {
  it('lists every address and marks the primary one', () => {
    vi.mocked(useCustomerDetailFacade).mockReturnValue({
      addressRows: customerAddressRowsMock,
    } as unknown as ReturnType<typeof useCustomerDetailFacade>)

    render(<CustomerAddresses />)

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(
      screen.getByText(customerAddressRowsMock[0].streetLine)
    ).toHaveTextContent('Principal')
    expect(
      screen.getByText(customerAddressRowsMock[1].streetLine)
    ).not.toHaveTextContent('Principal')
  })

  it('states the absence of addresses', () => {
    vi.mocked(useCustomerDetailFacade).mockReturnValue({
      addressRows: [],
    } as unknown as ReturnType<typeof useCustomerDetailFacade>)

    render(<CustomerAddresses />)

    expect(
      screen.getByText('Nenhum endereço registrado ainda.')
    ).toBeInTheDocument()
  })
})
