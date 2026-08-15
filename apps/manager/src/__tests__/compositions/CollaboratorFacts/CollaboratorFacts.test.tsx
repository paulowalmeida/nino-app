import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  CollaboratorFacts,
} from '@compositions/CollaboratorFacts/CollaboratorFacts'

import { staffMember, staffMemberNeverActive } from './CollaboratorFacts.mock'

describe(CollaboratorFacts.name, () => {
  it('shows orders handled, last activity and join date', () => {
    // Arrange / Act
    render(<CollaboratorFacts member={staffMember} />)

    // Assert
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('01 de jan. de 2026')).toBeInTheDocument()
  })

  it('shows "Nenhuma ainda" when the collaborator never had activity', () => {
    // Arrange
    render(<CollaboratorFacts member={staffMemberNeverActive} />)

    // Act
    const lastActivity = screen.getByText('Nenhuma ainda')

    // Assert
    expect(lastActivity).toBeInTheDocument()
  })
})
