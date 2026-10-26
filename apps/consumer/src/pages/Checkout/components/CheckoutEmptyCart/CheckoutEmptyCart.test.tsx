import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'

import { CheckoutEmptyCart } from './CheckoutEmptyCart'
import { checkoutEmptyCartMock } from './CheckoutEmptyCart.mock'

describe('CheckoutEmptyCart', () => {
  it('shows the empty bag message and menu link', () => {
    render(
      <MemoryRouter>
        <CheckoutEmptyCart {...checkoutEmptyCartMock} />
      </MemoryRouter>
    )

    expect(screen.getByText('Sua sacola está vazia')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Voltar para o cardápio' })
    ).toHaveAttribute('href', checkoutEmptyCartMock.backHref)
  })
})
