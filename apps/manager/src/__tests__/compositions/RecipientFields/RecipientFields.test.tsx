import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { RecipientFields } from '@compositions/RecipientFields/RecipientFields'

import { emptyRecipient, zones } from './RecipientFields.mock'

const renderFields = (
  props: Partial<React.ComponentProps<typeof RecipientFields>> = {}
) =>
  render(
    <RecipientFields
      value={emptyRecipient}
      zones={zones}
      hasAddress={false}
      onChange={vi.fn()}
      {...props}
    />
  )

describe(RecipientFields.name, () => {
  it('titles the block by who ordered when there is no delivery', () => {
    // Arrange / Act
    renderFields({ hasAddress: false })

    // Assert
    expect(screen.getByText('Quem pediu')).toBeInTheDocument()
  })

  it('titles the block by who receives when it is a delivery', () => {
    // Arrange / Act
    renderFields({ hasAddress: true })

    // Assert
    expect(screen.getByText('Quem recebe')).toBeInTheDocument()
  })

  it('hides address fields when the order has no delivery', () => {
    // Arrange / Act
    renderFields({ hasAddress: false })

    // Assert
    expect(screen.queryByLabelText('Rua')).not.toBeInTheDocument()
    expect(screen.queryByText('Região da entrega')).not.toBeInTheDocument()
  })

  it('shows address fields and zones when it is a delivery', () => {
    // Arrange / Act
    renderFields({ hasAddress: true })

    // Assert
    expect(screen.getByLabelText('Rua')).toBeInTheDocument()
    expect(screen.getByText('Região da entrega')).toBeInTheDocument()
  })

  it('warns there are no zones registered when the list is empty', () => {
    // Arrange / Act
    renderFields({ hasAddress: true, zones: [] })

    // Assert
    expect(
      screen.getByText('Nenhuma região cadastrada')
    ).toBeInTheDocument()
  })

  it('reports only the changed field when typing the name', async () => {
    // Arrange
    const onChange = vi.fn()
    renderFields({ onChange })

    // Act
    await userEvent.type(screen.getByLabelText('Nome de quem pediu'), 'A')

    // Assert
    expect(onChange).toHaveBeenCalledWith({ name: 'A' })
  })

  it('reports the changed street without touching other fields', async () => {
    // Arrange
    const onChange = vi.fn()
    renderFields({ hasAddress: true, onChange })

    // Act
    await userEvent.type(screen.getByLabelText('Rua'), 'R')

    // Assert
    expect(onChange).toHaveBeenCalledWith({ street: 'R' })
  })
})
