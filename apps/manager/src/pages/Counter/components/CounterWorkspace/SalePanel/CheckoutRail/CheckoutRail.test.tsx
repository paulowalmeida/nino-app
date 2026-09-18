import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CheckoutRail } from './CheckoutRail'
import { checkoutRailMock } from './CheckoutRail.mock'

describe('CheckoutRail', () => {
  it('allows returning to a completed step', () => {
    const onStep = vi.fn()
    render(<CheckoutRail {...checkoutRailMock} onStep={onStep} />)

    fireEvent.click(screen.getByRole('button', { name: 'Itens' }))

    expect(onStep).toHaveBeenCalledWith('items')
  })

  it('does not jump to a step the sale has not reached', () => {
    const onStep = vi.fn()
    render(<CheckoutRail {...checkoutRailMock} onStep={onStep} />)

    fireEvent.click(screen.getByRole('button', { name: 'Revisão' }))

    expect(onStep).not.toHaveBeenCalled()
  })

  it('fills the bar up to the step the sale is on', () => {
    render(<CheckoutRail {...checkoutRailMock} onStep={vi.fn()} />)

    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '75'
    )
  })
})
