import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { OrderChangeLine } from './OrderChangeLine'
import {
  counterChangeOrderMock,
  deliveryChangeOrderMock,
  exactCounterOrderMock,
} from './OrderChangeLine.mock'

describe(OrderChangeLine.name, () => {
  it('tells the courier how much change to carry', () => {
    render(<OrderChangeLine order={deliveryChangeOrderMock} />)

    expect(screen.getByText(/Levar troco para/)).toHaveTextContent('50,00')
  })

  it('reports what the counter received and gave back', () => {
    render(<OrderChangeLine order={counterChangeOrderMock} />)

    expect(screen.getByText(/Recebido/)).toHaveTextContent(
      'Recebido R$ 50,00 · troco R$ 2,10'
    )
  })

  it('never asks the counter to carry change', () => {
    render(<OrderChangeLine order={counterChangeOrderMock} />)

    expect(screen.queryByText(/Levar troco/)).not.toBeInTheDocument()
  })

  it('says nothing when the sale was paid with the exact amount', () => {
    const { container } = render(
      <OrderChangeLine order={exactCounterOrderMock} />
    )

    expect(container).toBeEmptyDOMElement()
  })
})
