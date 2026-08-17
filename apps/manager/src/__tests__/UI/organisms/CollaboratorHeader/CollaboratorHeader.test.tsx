import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  CollaboratorHeader,
} from '@organisms/CollaboratorHeader/CollaboratorHeader'

import {
  deactivatedStaffMember,
  staffMember,
  staffMemberWithoutPhone,
} from './CollaboratorHeader.mock'

describe(CollaboratorHeader.name, () => {
  it('shows the name, role and how long they have been around', () => {
    // Arrange / Act
    render(<CollaboratorHeader member={staffMember} />)

    // Assert
    expect(
      screen.getByRole('heading', { name: 'João Pereira' })
    ).toBeInTheDocument()
    expect(screen.getByText(/Atendente/)).toBeInTheDocument()
    expect(screen.getByText(/Na equipe desde/)).toBeInTheDocument()
  })

  it('keeps the header intact for someone without a phone', () => {
    // Arrange / Act
    render(<CollaboratorHeader member={staffMemberWithoutPhone} />)

    // Assert
    expect(
      screen.getByRole('heading', { name: 'João Pereira' })
    ).toBeInTheDocument()
  })

  it('flags a deactivated account right next to the name', () => {
    // Arrange / Act
    render(<CollaboratorHeader member={deactivatedStaffMember} />)

    // Assert
    expect(screen.getByText('Acesso desativado')).toBeInTheDocument()
  })
})
