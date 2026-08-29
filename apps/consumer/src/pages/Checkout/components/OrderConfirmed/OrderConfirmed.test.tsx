import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { OrderConfirmed } from './OrderConfirmed'
import { orderConfirmedMock } from './OrderConfirmed.mock'

describe('OrderConfirmed', () => {
  it('shows the pickup confirmation and tracks the order', async () => {
    const onTrack = vi.fn()
    const onBackToStore = vi.fn()
    render(
      <OrderConfirmed
        order={orderConfirmedMock}
        onTrack={onTrack}
        onBackToStore={onBackToStore}
      />
    )

    expect(screen.getByRole('heading', { name: 'Pedido enviado!' })).toBeInTheDocument()
    expect(screen.getByText('#42')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Acompanhar pedido' }))
    expect(onTrack).toHaveBeenCalledOnce()
  })
})
