import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'

import { CheckoutHeader } from './CheckoutHeader'
import { checkoutHeaderMock } from './CheckoutHeader.mock'

describe('CheckoutHeader', () => {
  it('identifies the checkout and links back to the menu', () => {
    render(
      <MemoryRouter>
        <CheckoutHeader {...checkoutHeaderMock} />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'Finalizar pedido' })).toBeInTheDocument()
    expect(screen.getByText(checkoutHeaderMock.storeName)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Voltar' })).toHaveAttribute(
      'href',
      checkoutHeaderMock.backHref
    )
  })
})
