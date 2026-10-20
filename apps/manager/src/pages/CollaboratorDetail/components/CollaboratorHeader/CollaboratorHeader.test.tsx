import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CollaboratorHeader } from './CollaboratorHeader'

const makeMember = (active: boolean) => ({
  role: 'MANAGER' as const,
  position: { id: 'position-manager', name: 'Gerente', level: 50 },
  createdAt: '2024-01-02T00:00:00.000Z',
  user: { name: 'Ana Souza', isActive: active, lastLoginAt: null },
})

describe(CollaboratorHeader.name, () => {
  it('presents identity, role, tenure, and active status', () => {
    render(<CollaboratorHeader member={makeMember(true) as never} />)
    expect(
      screen.getByRole('heading', { name: 'Ana Souza' })
    ).toBeInTheDocument()
    expect(screen.getByText(/Gerente/)).toBeInTheDocument()
    expect(screen.queryByText('Acesso desativado')).not.toBeInTheDocument()
  })

  it('announces disabled access', () => {
    render(<CollaboratorHeader member={makeMember(false) as never} />)
    expect(screen.getByText('Acesso desativado')).toBeInTheDocument()
  })

  it('shows the name of a custom cargo', () => {
    render(
      <CollaboratorHeader
        member={
          {
            ...makeMember(false),
            position: { id: 'position-cashier', name: 'Caixa', level: 30 },
          } as never
        }
      />
    )
    expect(screen.getByText(/Caixa/)).toBeInTheDocument()
  })
})
