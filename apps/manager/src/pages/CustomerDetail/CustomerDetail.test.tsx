import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCustomerDetailFacade } from '@pages/CustomerDetail/facades/useCustomerDetailFacade/useCustomerDetailFacade'

import { CustomerDetail } from './CustomerDetail'
import { customerDetailPageMock } from './CustomerDetail.mock'

vi.mock(
  '@pages/CustomerDetail/facades/useCustomerDetailFacade/useCustomerDetailFacade'
)
vi.mock(
  '@pages/CustomerDetail/components/CustomerHeader/CustomerHeader',
  () => ({ CustomerHeader: () => <div>header</div> })
)
vi.mock(
  '@pages/CustomerDetail/components/CustomerSummary/CustomerSummary',
  () => ({ CustomerSummary: () => <div>summary</div> })
)
vi.mock(
  '@pages/CustomerDetail/components/CustomerContact/CustomerContact',
  () => ({ CustomerContact: () => <div>contact</div> })
)
vi.mock(
  '@pages/CustomerDetail/components/CustomerWorkspace/CustomerWorkspace',
  () => ({ CustomerWorkspace: () => <div>workspace</div> })
)
vi.mock(
  '@pages/CustomerDetail/skeletons/CustomerDetailSkeleton/CustomerDetailSkeleton',
  () => ({ CustomerDetailSkeleton: () => <div>loading</div> })
)

const renderPage = () =>
  render(
    <MemoryRouter>
      <CustomerDetail />
    </MemoryRouter>
  )

describe('CustomerDetail', () => {
  beforeEach(() => {
    vi.mocked(useCustomerDetailFacade).mockReturnValue({
      customer: { name: customerDetailPageMock.customerName },
      isPending: false,
    } as unknown as ReturnType<typeof useCustomerDetailFacade>)
  })

  it('composes the customer detail regions', () => {
    renderPage()

    expect(screen.getByText('header')).toBeInTheDocument()
    expect(screen.getByText('summary')).toBeInTheDocument()
    expect(screen.getByText('contact')).toBeInTheDocument()
    expect(screen.getByText('workspace')).toBeInTheDocument()
    expect(
      screen.getByText(customerDetailPageMock.customerName)
    ).toHaveAttribute('aria-current', 'page')
  })

  it('shows the loading skeleton while the customer is pending', () => {
    vi.mocked(useCustomerDetailFacade).mockReturnValue({
      customer: undefined,
      isPending: true,
    } as unknown as ReturnType<typeof useCustomerDetailFacade>)

    renderPage()

    expect(screen.getByText('loading')).toBeInTheDocument()
  })

  it('states that the customer has no order in this store', () => {
    vi.mocked(useCustomerDetailFacade).mockReturnValue({
      customer: undefined,
      isPending: false,
    } as unknown as ReturnType<typeof useCustomerDetailFacade>)

    renderPage()

    expect(
      screen.getByText(customerDetailPageMock.emptyMessage)
    ).toBeInTheDocument()
    expect(screen.queryByText('workspace')).not.toBeInTheDocument()
  })
})
