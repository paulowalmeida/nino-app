import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  CollaboratorSummary,
} from '@organisms/CollaboratorSummary/CollaboratorSummary'

import {
  busyCollaborator,
  untouchedCollaborator,
} from './CollaboratorSummary.mock'

describe(CollaboratorSummary.name, () => {
  it('shows what this person sold, opened and moved', () => {
    // Arrange / Act
    render(<CollaboratorSummary member={busyCollaborator} />)

    // Assert
    expect(screen.getByText('R$ 1.284,50')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('130')).toBeInTheDocument()
  })

  it('puts the cancellations in proportion to the whole work', () => {
    // Arrange / Act
    render(<CollaboratorSummary member={busyCollaborator} />)

    // Assert
    expect(
      screen.getByText(/4 de 130 mudanças foram cancelamento/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Tocando em pedido desde 03 de fev. de 2026/)
    ).toBeInTheDocument()
  })

  it('says there is no cancellation instead of dividing by zero', () => {
    // Arrange / Act
    render(<CollaboratorSummary member={untouchedCollaborator} />)

    // Assert
    expect(screen.getByText(/Nenhum cancelamento/)).toBeInTheDocument()
    expect(
      screen.getByText(/Ainda não tocou em nenhum pedido/)
    ).toBeInTheDocument()
  })
})
