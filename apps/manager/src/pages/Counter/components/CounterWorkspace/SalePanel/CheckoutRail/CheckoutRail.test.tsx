import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CheckoutRail } from './CheckoutRail'
import { checkoutRailMock } from './CheckoutRail.mock'

describe('CheckoutRail', () => {
  it('allows returning to a completed step', () => {
    const onStep = vi.fn()
    render(<CheckoutRail {...checkoutRailMock} onStep={onStep} />)

    fireEvent.click(screen.getByRole('button', { name: 'Voltar para Itens' }))

    expect(onStep).toHaveBeenCalledWith('items')
  })
})
