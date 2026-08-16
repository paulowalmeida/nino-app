import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  CollaboratorHeader,
} from '@organisms/CollaboratorHeader/CollaboratorHeader'

import { staffMember, staffMemberWithoutPhone } from './CollaboratorHeader.mock'

describe(CollaboratorHeader.name, () => {
  it('shows the name, phone and role of the collaborator', () => {
    // Arrange / Act
    render(<CollaboratorHeader member={staffMember} />)

    // Assert
    expect(
      screen.getByRole('heading', { name: 'João Pereira' })
    ).toBeInTheDocument()
    expect(screen.getByText('(11) 98888-7777')).toBeInTheDocument()
    expect(screen.getByText('Atendente')).toBeInTheDocument()
  })

  it('omits the phone link when the collaborator has none', () => {
    // Arrange
    render(<CollaboratorHeader member={staffMemberWithoutPhone} />)

    // Act
    const phoneLink = screen.queryByRole('link')

    // Assert
    expect(phoneLink).not.toBeInTheDocument()
  })
})
