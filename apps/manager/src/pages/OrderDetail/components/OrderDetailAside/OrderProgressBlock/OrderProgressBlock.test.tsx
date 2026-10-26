import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useOrderDetailFacade } from '@pages/OrderDetail/facades/useOrderDetailFacade/useOrderDetailFacade'

import { OrderProgressBlock } from './OrderProgressBlock'
import {
  cancelledOrderMock,
  orderInProgressMock,
} from './OrderProgressBlock.mock'

vi.mock('@pages/OrderDetail/facades/useOrderDetailFacade/useOrderDetailFacade')
vi.mock('@shared/components/OrderTimeline/OrderTimeline', () => ({
  OrderTimeline: ({ entries }: { entries: unknown[] }) => (
    <div>timeline with {entries.length}</div>
  ),
}))

const facadeWithOrder = (order: unknown) =>
  vi.mocked(useOrderDetailFacade).mockReturnValue({
    order,
  } as unknown as ReturnType<typeof useOrderDetailFacade>)

describe('OrderProgressBlock', () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows the stages the order already went through', () => {
    facadeWithOrder(orderInProgressMock)

    render(<OrderProgressBlock />)

    expect(screen.getByText('timeline with 1')).toBeInTheDocument()
    expect(screen.queryByText(/Motivo do cancelamento/)).not.toBeInTheDocument()
  })

  it('states why a cancelled order stopped', () => {
    facadeWithOrder(cancelledOrderMock)

    render(<OrderProgressBlock />)

    expect(screen.getByText(/Motivo do cancelamento/)).toHaveTextContent(
      'Cliente desistiu'
    )
  })

  it('renders nothing while the order is unknown', () => {
    facadeWithOrder(undefined)

    const { container } = render(<OrderProgressBlock />)

    expect(container).toBeEmptyDOMElement()
  })
})
