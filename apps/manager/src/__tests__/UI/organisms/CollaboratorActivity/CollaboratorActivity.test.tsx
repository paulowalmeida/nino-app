import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  CollaboratorActivity,
} from '@organisms/CollaboratorActivity/CollaboratorActivity'

import {
  counterTicketEntry,
  guestOrderEntry,
} from './CollaboratorActivity.mock'

describe(CollaboratorActivity.name, () => {
  it('shows the empty message when there is no activity', () => {
    // Arrange / Act
    render(<CollaboratorActivity activity={[]} />)

    // Assert
    expect(
      screen.getByText('Nenhum pedido passou pela mão desta pessoa ainda.')
    ).toBeInTheDocument()
  })

  it('lists each entry with the customer name', () => {
    // Arrange / Act
    render(<CollaboratorActivity activity={[counterTicketEntry]} />)

    // Assert
    expect(screen.getByText('Maria Silva')).toBeInTheDocument()
  })

  it('falls back to "Visitante" when the entry has no customer name', () => {
    // Arrange / Act
    render(<CollaboratorActivity activity={[guestOrderEntry]} />)

    // Assert
    expect(screen.getByText('Visitante')).toBeInTheDocument()
  })

  it('describes the row for screen readers via aria-label', () => {
    // Arrange
    render(<CollaboratorActivity activity={[counterTicketEntry]} />)

    // Act
    const row = screen.getByRole('listitem')

    // Assert
    expect(row).toHaveAccessibleName(/Pedido #.*Maria Silva.*Balcão/)
  })
})
