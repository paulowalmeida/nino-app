import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'

import { CheckoutFooter } from './CheckoutFooter'
import { checkoutFooterMock } from './CheckoutFooter.mock'

vi.mock('@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade')

describe('CheckoutFooter', () => {
  it('shows the current total and confirmation action', () => {
    vi.mocked(useCheckoutFacade).mockReturnValue({
      total: checkoutFooterMock.total,
      isSubmitting: false,
    } as never)

    render(<CheckoutFooter disabled={false} />)

    expect(screen.getByText('Total')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirmar pedido' })).toBeEnabled()
  })
})
