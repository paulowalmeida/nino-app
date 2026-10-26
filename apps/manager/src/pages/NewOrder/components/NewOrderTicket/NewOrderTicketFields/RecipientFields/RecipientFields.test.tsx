import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { RecipientFields } from './RecipientFields'
import { deliveryZonesMock, recipientMock } from './RecipientFields.mock'

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

const onChange = vi.fn()

const renderFields = (hasAddress: boolean, zones = deliveryZonesMock) =>
  render(
    <RecipientFields
      value={recipientMock}
      zones={zones}
      hasAddress={hasAddress}
      onChange={onChange}
    />
  )

describe('RecipientFields', () => {
  beforeEach(() => vi.clearAllMocks())

  it('asks only who ordered at the counter', () => {
    renderFields(false)

    expect(screen.getByText('Quem pediu')).toBeInTheDocument()
    expect(screen.getByText(/Opcional/)).toBeInTheDocument()
    expect(screen.queryByLabelText('Rua')).not.toBeInTheDocument()
  })

  it('asks where the order goes on a delivery', () => {
    renderFields(true)

    expect(screen.getByText('Quem recebe')).toBeInTheDocument()
    expect(screen.getByLabelText('Rua')).toHaveValue(recipientMock.street)
    expect(screen.getByLabelText('Número')).toHaveValue(recipientMock.number)
    expect(screen.getByLabelText('Bairro')).toHaveValue(
      recipientMock.neighborhood
    )
  })

  it('patches who ordered field by field', async () => {
    renderFields(false)

    await userEvent.type(screen.getByLabelText('Nome de quem pediu'), '!')
    await userEvent.type(screen.getByLabelText('Telefone de quem pediu'), '9')

    expect(onChange).toHaveBeenNthCalledWith(1, {
      name: `${recipientMock.name}!`,
    })
    expect(onChange).toHaveBeenNthCalledWith(2, {
      phone: `${recipientMock.phone}9`,
    })
  })

  it('patches the address field by field', async () => {
    renderFields(true)

    await userEvent.type(screen.getByLabelText('Rua'), '!')
    await userEvent.type(screen.getByLabelText('Número'), '1')
    await userEvent.type(screen.getByLabelText('Complemento'), 'a')
    await userEvent.type(screen.getByLabelText('Bairro'), '!')

    expect(onChange).toHaveBeenNthCalledWith(1, {
      street: `${recipientMock.street}!`,
    })
    expect(onChange).toHaveBeenNthCalledWith(2, {
      number: `${recipientMock.number}1`,
    })
    expect(onChange).toHaveBeenNthCalledWith(3, { complement: 'a' })
    expect(onChange).toHaveBeenNthCalledWith(4, {
      neighborhood: `${recipientMock.neighborhood}!`,
    })
  })

  it('picks the delivery zone that drives the fee', async () => {
    renderFields(true)

    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Região da entrega' }),
      'zone-2'
    )

    expect(onChange).toHaveBeenCalledWith({ zoneId: 'zone-2' })
  })

  it('says when the store has no delivery zone registered', () => {
    renderFields(true, [])

    expect(
      screen.getByRole('combobox', { name: 'Região da entrega' })
    ).toBeInTheDocument()
  })
})
