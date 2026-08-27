import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { OrderDetailAside } from './OrderDetailAside'
import { orderDetailAsideMock } from './OrderDetailAside.mock'

vi.mock(
  '@pages/OrderDetail/components/OrderDetailAside/OrderCustomerBlock/OrderCustomerBlock',
  () => ({ OrderCustomerBlock: () => <div>customer</div> })
)
vi.mock(
  '@pages/OrderDetail/components/OrderDetailAside/OrderPaymentBlock/OrderPaymentBlock',
  () => ({ OrderPaymentBlock: () => <div>payment</div> })
)
vi.mock(
  '@pages/OrderDetail/components/OrderDetailAside/OrderProgressBlock/OrderProgressBlock',
  () => ({ OrderProgressBlock: () => <div>progress</div> })
)
vi.mock(
  '@pages/OrderDetail/components/OrderDetailAside/OrderActions/OrderActions',
  () => ({ OrderActions: () => <div>actions</div> })
)

describe('OrderDetailAside', () => {
  it('stacks the four blocks of the order column in reading order', () => {
    const { container } = render(<OrderDetailAside />)

    expect(screen.getByText('customer')).toBeInTheDocument()
    expect(screen.getByText('payment')).toBeInTheDocument()
    expect(screen.getByText('progress')).toBeInTheDocument()
    expect(screen.getByText('actions')).toBeInTheDocument()
    expect(container.firstElementChild?.children).toHaveLength(
      orderDetailAsideMock.regions.length
    )
  })
})
