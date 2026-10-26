import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useConsumerDetailFacade } from '@pages/ConsumerDetail/facades/useConsumerDetailFacade/useConsumerDetailFacade'

import { ConsumerWorkspace } from './ConsumerWorkspace'
import { consumerWorkspaceMock } from './ConsumerWorkspace.mock'

vi.mock(
  '@pages/ConsumerDetail/facades/useConsumerDetailFacade/useConsumerDetailFacade'
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
  '@pages/ConsumerDetail/components/ConsumerWorkspace/ConsumerOrderHistory/ConsumerOrderHistory',
  () => ({ ConsumerOrderHistory: () => <div>order history</div> })
)
vi.mock(
  '@pages/ConsumerDetail/components/ConsumerWorkspace/ConsumerAddresses/ConsumerAddresses',
  () => ({ ConsumerAddresses: () => <div>addresses</div> })
)

describe('ConsumerWorkspace', () => {
  it('counts orders and addresses on their own tabs', () => {
    vi.mocked(useConsumerDetailFacade).mockReturnValue({
      consumer: { orders: consumerWorkspaceMock.orders },
      addressRows: [{ id: 'address-primary' }],
    } as unknown as ReturnType<typeof useConsumerDetailFacade>)

    render(<ConsumerWorkspace />)

    expect(
      screen.getByRole('region', { name: consumerWorkspaceMock.ordersTabLabel })
    ).toHaveTextContent('order history')
    expect(
      screen.getByRole('region', {
        name: consumerWorkspaceMock.addressesTabLabel,
      })
    ).toHaveTextContent('addresses')
  })

  it('renders nothing while the consumer is unknown', () => {
    vi.mocked(useConsumerDetailFacade).mockReturnValue({
      consumer: undefined,
      addressRows: [],
    } as unknown as ReturnType<typeof useConsumerDetailFacade>)

    const { container } = render(<ConsumerWorkspace />)

    expect(container).toBeEmptyDOMElement()
  })
})
