import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCustomerDetailFacade } from '@pages/CustomerDetail/facades/useCustomerDetailFacade/useCustomerDetailFacade'

import { CustomerWorkspace } from './CustomerWorkspace'
import { customerWorkspaceMock } from './CustomerWorkspace.mock'

vi.mock(
  '@pages/CustomerDetail/facades/useCustomerDetailFacade/useCustomerDetailFacade'
)
vi.mock('@nino/ds/components/Tabs', () => ({
  Tabs: ({ tabs }: { tabs: { label: string; content: React.ReactNode }[] }) => (
    <div>
      {tabs.map((tab) => (
        <section key={tab.label} aria-label={tab.label}>
          {tab.content}
        </section>
      ))}
    </div>
  ),
}))
vi.mock(
  '@pages/CustomerDetail/components/CustomerWorkspace/CustomerOrderHistory/CustomerOrderHistory',
  () => ({ CustomerOrderHistory: () => <div>order history</div> })
)
vi.mock(
  '@pages/CustomerDetail/components/CustomerWorkspace/CustomerAddresses/CustomerAddresses',
  () => ({ CustomerAddresses: () => <div>addresses</div> })
)

describe('CustomerWorkspace', () => {
  it('counts orders and addresses on their own tabs', () => {
    vi.mocked(useCustomerDetailFacade).mockReturnValue({
      customer: { orders: customerWorkspaceMock.orders },
      addressRows: [{ id: 'address-primary' }],
    } as unknown as ReturnType<typeof useCustomerDetailFacade>)

    render(<CustomerWorkspace />)

    expect(
      screen.getByRole('region', { name: customerWorkspaceMock.ordersTabLabel })
    ).toHaveTextContent('order history')
    expect(
      screen.getByRole('region', {
        name: customerWorkspaceMock.addressesTabLabel,
      })
    ).toHaveTextContent('addresses')
  })

  it('renders nothing while the customer is unknown', () => {
    vi.mocked(useCustomerDetailFacade).mockReturnValue({
      customer: undefined,
      addressRows: [],
    } as unknown as ReturnType<typeof useCustomerDetailFacade>)

    const { container } = render(<CustomerWorkspace />)

    expect(container).toBeEmptyDOMElement()
  })
})
