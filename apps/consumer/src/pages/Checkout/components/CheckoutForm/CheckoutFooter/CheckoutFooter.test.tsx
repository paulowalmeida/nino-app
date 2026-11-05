import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { flushSync } from 'react-dom'
import { describe, expect, it, vi } from 'vitest'

import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'

import { CheckoutFooter } from './CheckoutFooter'
import { checkoutFooterMock } from './CheckoutFooter.mock'

vi.mock('@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade')
vi.mock('./CheckoutFooter.module.css', () => ({
  default: new Proxy(
    {},
    { get: (_target, property: string) => property }
  ),
}))

const mockFacade = () =>
  vi.mocked(useCheckoutFacade).mockReturnValue({
    total: checkoutFooterMock.total,
    isSubmitting: false,
  } as never)

describe('CheckoutFooter', () => {
  it('shows the current total and confirmation action', () => {
    mockFacade()

    const { container } = render(<CheckoutFooter disabled={false} />)

    expect(container.querySelector('.tearBar')).toBeInTheDocument()
    expect(screen.getByText('Total')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Confirmar pedido' })
    ).toBeEnabled()
  })

  it('does not submit the order when continuing into the review step', () => {
    mockFacade()
    const onSubmit = vi.fn()

    const ContinueIntoReview = () => {
      const [isLastStep, setIsLastStep] = useState(false)
      return (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit()
          }}
        >
          <CheckoutFooter
            disabled={false}
            isLastStep={isLastStep}
            /* WHY: no browser, o re-render do clique roda antes da ação padrão
               do botão; flushSync reproduz essa ordem no jsdom. */
            onContinue={() => flushSync(() => setIsLastStep(true))}
          />
        </form>
      )
    }

    render(<ContinueIntoReview />)
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    expect(
      screen.getByRole('button', { name: 'Confirmar pedido' })
    ).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
