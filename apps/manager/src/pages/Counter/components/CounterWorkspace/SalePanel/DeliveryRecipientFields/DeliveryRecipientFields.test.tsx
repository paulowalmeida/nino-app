import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import {
  deliveryCitiesMock,
  deliveryRecipientMock,
} from './DeliveryRecipientFields.mock'
import { DeliveryRecipientFields } from './DeliveryRecipientFields'

describe('DeliveryRecipientFields', () => {
  it('renders recipient and configured delivery city fields', () => {
    render(
      <DeliveryRecipientFields
        value={deliveryRecipientMock}
        storeAddress={{ city: 'Belém', state: 'PA' }}
        deliveryCities={deliveryCitiesMock}
        addressSuggestions={[]}
        isSearchingAddress={false}
        onChange={vi.fn()}
      />
    )

    expect(
      screen.getByRole('textbox', { name: 'Nome de quem pediu' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('combobox', { name: 'Logradouro' })
    ).toBeInTheDocument()
  })
})
