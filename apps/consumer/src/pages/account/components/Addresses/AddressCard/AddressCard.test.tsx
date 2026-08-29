import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AddressCard } from './AddressCard'
import { addressCardMock } from './AddressCard.mock'

describe('AddressCard', () => {
  it('shows the street line, the city line, and the primary badge', () => {
    // Arrange
    // Act
    render(
      <AddressCard
        address={addressCardMock.address}
        isEditing={false}
        isConfirmingDelete={false}
        isSaving={false}
        hasSaveError={false}
        isRemoving={false}
        onEdit={vi.fn()}
        onCancelEdit={vi.fn()}
        onSubmit={vi.fn()}
        onMakePrimary={vi.fn()}
        onRequestDelete={vi.fn()}
        onCancelDelete={vi.fn()}
        onConfirmDelete={vi.fn()}
      />
    )

    // Assert
    expect(screen.getByText('Rua das Flores, 123')).toBeInTheDocument()
    expect(
      screen.getByText('Centro · São Paulo/SP · 01001000')
    ).toBeInTheDocument()
    expect(screen.getByText('Principal')).toBeInTheDocument()
  })

  it('hides the "tornar principal" tool for the primary address', () => {
    // Arrange
    // Act
    render(
      <AddressCard
        address={addressCardMock.address}
        isEditing={false}
        isConfirmingDelete={false}
        isSaving={false}
        hasSaveError={false}
        isRemoving={false}
        onEdit={vi.fn()}
        onCancelEdit={vi.fn()}
        onSubmit={vi.fn()}
        onMakePrimary={vi.fn()}
        onRequestDelete={vi.fn()}
        onCancelDelete={vi.fn()}
        onConfirmDelete={vi.fn()}
      />
    )

    // Assert
    expect(
      screen.queryByRole('button', { name: 'Tornar principal' })
    ).not.toBeInTheDocument()
  })

  it('renders the form in place of the card while editing', () => {
    // Arrange
    // Act
    render(
      <AddressCard
        address={addressCardMock.address}
        isEditing={true}
        isConfirmingDelete={false}
        isSaving={false}
        hasSaveError={false}
        isRemoving={false}
        onEdit={vi.fn()}
        onCancelEdit={vi.fn()}
        onSubmit={vi.fn()}
        onMakePrimary={vi.fn()}
        onRequestDelete={vi.fn()}
        onCancelDelete={vi.fn()}
        onConfirmDelete={vi.fn()}
      />
    )

    // Assert
    expect(
      screen.getByRole('button', { name: 'Salvar endereço' })
    ).toBeInTheDocument()
    expect(screen.queryByText('Principal')).not.toBeInTheDocument()
  })

  it('asks for delete confirmation before calling onConfirmDelete', () => {
    // Arrange
    const onRequestDelete = vi.fn()

    // Act
    render(
      <AddressCard
        address={addressCardMock.address}
        isEditing={false}
        isConfirmingDelete={false}
        isSaving={false}
        hasSaveError={false}
        isRemoving={false}
        onEdit={vi.fn()}
        onCancelEdit={vi.fn()}
        onSubmit={vi.fn()}
        onMakePrimary={vi.fn()}
        onRequestDelete={onRequestDelete}
        onCancelDelete={vi.fn()}
        onConfirmDelete={vi.fn()}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Excluir endereço' }))

    // Assert
    expect(onRequestDelete).toHaveBeenCalledTimes(1)
  })

  it('shows the confirmation row once isConfirmingDelete is true', () => {
    // Arrange
    const onConfirmDelete = vi.fn()

    // Act
    render(
      <AddressCard
        address={addressCardMock.address}
        isEditing={false}
        isConfirmingDelete={true}
        isSaving={false}
        hasSaveError={false}
        isRemoving={false}
        onEdit={vi.fn()}
        onCancelEdit={vi.fn()}
        onSubmit={vi.fn()}
        onMakePrimary={vi.fn()}
        onRequestDelete={vi.fn()}
        onCancelDelete={vi.fn()}
        onConfirmDelete={onConfirmDelete}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }))

    // Assert
    expect(screen.getByText('Excluir este endereço?')).toBeInTheDocument()
    expect(onConfirmDelete).toHaveBeenCalledTimes(1)
  })
})
