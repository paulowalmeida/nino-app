import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CheckoutAlerts } from './CheckoutAlerts'
import { checkoutAlertsMock } from './CheckoutAlerts.mock'

describe('CheckoutAlerts', () => {
  it('shows the backend reason when submission fails', () => {
    render(
      <CheckoutAlerts
        isSubmitFailed
        submitErrorMessage="Forma de pagamento não aceita pela loja"
        isStoreClosed={false}
      />
    )

    expect(screen.getByText(checkoutAlertsMock.failedTitle)).toBeInTheDocument()
    expect(
      screen.getByText('Forma de pagamento não aceita pela loja')
    ).toBeInTheDocument()
  })

  it('shows submission and closed-store guidance when both apply', () => {
    render(<CheckoutAlerts isSubmitFailed isStoreClosed />)

    expect(screen.getByText(checkoutAlertsMock.failedTitle)).toBeInTheDocument()
    expect(screen.getByText(checkoutAlertsMock.closedTitle)).toBeInTheDocument()
  })
})
