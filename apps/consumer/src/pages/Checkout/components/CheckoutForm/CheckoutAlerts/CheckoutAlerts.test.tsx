import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CheckoutAlerts } from './CheckoutAlerts'
import { checkoutAlertsMock } from './CheckoutAlerts.mock'

describe('CheckoutAlerts', () => {
  it('shows submission and closed-store guidance when both apply', () => {
    render(<CheckoutAlerts isSubmitFailed isStoreClosed />)

    expect(screen.getByText(checkoutAlertsMock.failedTitle)).toBeInTheDocument()
    expect(screen.getByText(checkoutAlertsMock.closedTitle)).toBeInTheDocument()
  })

  it('shows the API reason when order creation fails', () => {
    render(
      <CheckoutAlerts
        isSubmitFailed
        isStoreClosed={false}
        submitErrorMessage="Forma de pagamento não aceita pela loja"
      />
    )

    expect(
      screen.getByText('Forma de pagamento não aceita pela loja')
    ).toBeInTheDocument()
  })
})
