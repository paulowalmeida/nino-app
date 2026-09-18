import { useState } from 'react'

import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { DestinationStep } from './DestinationStep'
import { destinationStepMock } from './DestinationStep.mock'

vi.mock('../DeliveryRecipientFields/DeliveryRecipientFields', () => ({
  DeliveryRecipientFields: () => <div>delivery fields</div>,
}))

describe('DestinationStep', () => {
  it.each([
    ['91982071243', '(91) 98207-1243'],
    ['9132071243', '(91) 3207-1243'],
  ])('masks pickup phone %s', (phone, maskedPhone) => {
    const onRecipient = vi.fn()
    render(
      <DestinationStep
        {...destinationStepMock}
        channel="PICKUP"
        onChannel={vi.fn()}
        onConsumerName={vi.fn()}
        onTableNumber={vi.fn()}
        onRecipient={onRecipient}
        addressSuggestions={[]}
        isSearchingAddress={false}
        resolveSelectedAddress={vi.fn()}
        isResolvingSelectedAddress={false}
      />
    )
    fireEvent.change(screen.getByRole('textbox', { name: 'Telefone' }), {
      target: { value: phone },
    })
    expect(onRecipient).toHaveBeenCalledWith({ phone: maskedPhone })
  })
  it('requests only name and phone for pickup', () => {
    render(
      <DestinationStep
        {...destinationStepMock}
        channel="PICKUP"
        onChannel={vi.fn()}
        onConsumerName={vi.fn()}
        onTableNumber={vi.fn()}
        onRecipient={vi.fn()}
        addressSuggestions={[]}
        isSearchingAddress={false}
        resolveSelectedAddress={vi.fn()}
        isResolvingSelectedAddress={false}
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

  it('keeps the pickup phone visible after real controlled typing', async () => {
    const TestHarness = () => {
      const [recipient, setRecipient] = useState(destinationStepMock.recipient)

      return (
        <DestinationStep
          {...destinationStepMock}
          channel="PICKUP"
          recipient={recipient}
          onChannel={vi.fn()}
          onConsumerName={vi.fn()}
          onTableNumber={vi.fn()}
          onRecipient={(patch) =>
            setRecipient((current) => ({ ...current, ...patch }))
          }
          addressSuggestions={[]}
          isSearchingAddress={false}
          resolveSelectedAddress={vi.fn()}
          isResolvingSelectedAddress={false}
        />
      )
    }

    render(<TestHarness />)
    const phone = screen.getByRole('textbox', { name: 'Telefone' })

    await userEvent.type(phone, '91982071243')

    expect(phone).toHaveValue('(91) 98207-1243')
  })

  it('presents the available order destinations', () => {
    render(
      <DestinationStep
        {...destinationStepMock}
        onChannel={vi.fn()}
        onConsumerName={vi.fn()}
        onTableNumber={vi.fn()}
        onRecipient={vi.fn()}
        addressSuggestions={[]}
        isSearchingAddress={false}
        resolveSelectedAddress={vi.fn()}
        isResolvingSelectedAddress={false}
      />
    )

    expect(screen.getByText('Retirada')).toBeInTheDocument()
    expect(screen.getByText('No local')).toBeInTheDocument()
    expect(screen.getByText('Entrega')).toBeInTheDocument()
  })
})
