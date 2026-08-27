import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { OrdersHeader } from './OrdersHeader'
import { ordersHeaderMock } from './OrdersHeader.mock'

describe('OrdersHeader', () => {
  it('names the orders screen', () => {
    render(<OrdersHeader />)
    expect(screen.getByRole('heading', { name: ordersHeaderMock.title })).toBeInTheDocument()
  })
})
