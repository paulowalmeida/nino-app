import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  CollaboratorAccess,
} from '@organisms/CollaboratorAccess/CollaboratorAccess'

import { invitedStaff, staffWithLogin } from './CollaboratorAccess.mock'

describe(CollaboratorAccess.name, () => {
  it('explains the role instead of only naming it', () => {
    // Arrange / Act
    render(<CollaboratorAccess member={staffWithLogin} />)

    // Assert
    expect(screen.getByText('Atendente')).toBeInTheDocument()
    expect(screen.getByText('Vê e move pedidos')).toBeInTheDocument()
  })

  it('shows the login email and the account status', () => {
    // Arrange / Act
    render(<CollaboratorAccess member={staffWithLogin} />)

    // Assert
    expect(screen.getByText('joao@lojateste.com.br')).toBeInTheDocument()
    expect(screen.getByText('Ativa')).toBeInTheDocument()
  })

  it('reports a pending invite and a missing email as such', () => {
    // Arrange / Act
    render(<CollaboratorAccess member={invitedStaff} />)

    // Assert
    expect(screen.getByText('Convite ainda não aceito')).toBeInTheDocument()
    expect(screen.getByText('Sem e-mail')).toBeInTheDocument()
    expect(screen.getByText('Desativada')).toBeInTheDocument()
    expect(screen.getByText('Nenhuma ainda')).toBeInTheDocument()
  })
})
