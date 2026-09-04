import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DestinationStep } from './DestinationStep'
import { destinationStepMock } from './DestinationStep.mock'

vi.mock('../DeliveryRecipientFields/DeliveryRecipientFields', () => ({
  DeliveryRecipientFields: () => <div>delivery fields</div>,
}))

describe('DestinationStep', () => {
  it('requests only name and phone for pickup', () => {
    render(
      <DestinationStep
        {...destinationStepMock}
        channel="PICKUP"
        onChannel={vi.fn()}
        onCustomerName={vi.fn()}
        onTableNumber={vi.fn()}
        onRecipient={vi.fn()}
        addressSuggestions={[]}
        isSearchingAddress={false}
      />
    )
    expect(
      screen.getByRole('textbox', { name: 'Nome de quem pediu' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('textbox', { name: 'Telefone' })
    ).toBeInTheDocument()
    expect(screen.getAllByRole('textbox')).toHaveLength(2)
    expect(screen.queryByText('delivery fields')).not.toBeInTheDocument()
  })
  it('presents the available order destinations', () => {
    render(
      <DestinationStep
        {...destinationStepMock}
        onChannel={vi.fn()}
        onCustomerName={vi.fn()}
        onTableNumber={vi.fn()}
        onRecipient={vi.fn()}
        addressSuggestions={[]}
        isSearchingAddress={false}
      />
    )

    expect(screen.getByText('Retirada')).toBeInTheDocument()
    expect(screen.getByText('No local')).toBeInTheDocument()
    expect(screen.getByText('Entrega')).toBeInTheDocument()
  })
})
