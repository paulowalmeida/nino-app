import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { destinationStepMock } from './DestinationStep.mock'
import { DestinationStep } from './DestinationStep'

vi.mock('../DeliveryRecipientFields/DeliveryRecipientFields', () => ({
  DeliveryRecipientFields: () => <div>delivery fields</div>,
}))

describe('DestinationStep', () => {
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
