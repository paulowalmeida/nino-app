import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useNewOrderFacade } from '@pages/NewOrder/facades/useNewOrderFacade/useNewOrderFacade'

import { NewOrderTicketFields } from './NewOrderTicketFields'
import { ticketFieldsMock } from './NewOrderTicketFields.mock'

vi.mock('@pages/NewOrder/facades/useNewOrderFacade/useNewOrderFacade')
vi.mock('@nino/ds/components/Select', () => ({
  Select: ({
    options,
    value,
    onValueChange,
    ...props
  }: {
    options: { value: string; label: string }[]
    value: string
    onValueChange: (value: string) => void
  }) => (
    <select
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}))
vi.mock(
  '@pages/NewOrder/components/NewOrderTicket/NewOrderTicketFields/RecipientFields/RecipientFields',
  () => ({
    RecipientFields: ({ hasAddress }: { hasAddress: boolean }) => (
      <div>{hasAddress ? 'recipient with address' : 'recipient contact'}</div>
    ),
  })
)

const setNotes = vi.fn()
const setChannel = vi.fn()
const setChosenMethod = vi.fn()

const facadeWith = (channel: string) =>
  vi.mocked(useNewOrderFacade).mockReturnValue({
    draft: {
      channel,
      notes: ticketFieldsMock.notes,
      recipient: ticketFieldsMock.recipient,
      setChannel,
      setChosenMethod,
      setRecipient: vi.fn(),
      setNotes,
    },
    availability: {
      methods: ticketFieldsMock.methods,
      method: ticketFieldsMock.method,
      zoneOptions: ticketFieldsMock.zoneOptions,
    },
  } as unknown as ReturnType<typeof useNewOrderFacade>)

describe('NewOrderTicketFields', () => {
  beforeEach(() => vi.clearAllMocks())

  it('asks only for contact at the counter', () => {
    facadeWith('COUNTER')

    render(<NewOrderTicketFields />)

    expect(screen.getByText('recipient contact')).toBeInTheDocument()
    expect(screen.getByText('Como sai')).toBeInTheDocument()
    expect(screen.getByText('Pagamento')).toBeInTheDocument()
  })

  it('asks for the address on a delivery', () => {
    facadeWith('DELIVERY')

    render(<NewOrderTicketFields />)

    expect(screen.getByText('recipient with address')).toBeInTheDocument()
  })

  it('keeps what the kitchen has to know', async () => {
    facadeWith('COUNTER')

    render(<NewOrderTicketFields />)
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Observação' }),
      '!'
    )

    expect(setNotes).toHaveBeenCalledWith(`${ticketFieldsMock.notes}!`)
  })

  it('changes how the order leaves the store', async () => {
    facadeWith('COUNTER')

    render(<NewOrderTicketFields />)
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Como sai' }),
      'DELIVERY'
    )

    expect(setChannel).toHaveBeenCalledWith('DELIVERY')
  })

  it('changes how the customer pays', async () => {
    facadeWith('COUNTER')

    render(<NewOrderTicketFields />)
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Pagamento' }),
      'PIX'
    )

    expect(setChosenMethod).toHaveBeenCalledWith('PIX')
  })
})
