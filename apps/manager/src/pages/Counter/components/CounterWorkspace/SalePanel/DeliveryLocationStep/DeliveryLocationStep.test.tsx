import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { DeliveryLocationStep } from './DeliveryLocationStep'
import { deliveryLocationRecipientMock } from './DeliveryLocationStep.mock'

describe(DeliveryLocationStep.name, () => {
  it('shows the delivery point independently from the postal code', () => {
    render(<DeliveryLocationStep recipient={deliveryLocationRecipientMock} />)

    expect(screen.getByText(/Rua We 26, 471/)).toBeInTheDocument()
    expect(
      screen.getByText(/A taxa usa este ponto, não o CEP/)
    ).toBeInTheDocument()
    expect(
      screen.getByTitle(/Localização de entrega/).getAttribute('src')
    ).toContain('-1.363783%2C-48.4010281')
  })
})
