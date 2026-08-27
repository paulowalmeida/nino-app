import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CollaboratorHeader } from './CollaboratorHeader'

const makeMember = (active: boolean) => ({
  role: 'MANAGER' as const,
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

  it('falls back to the persisted role name', () => {
    render(
      <CollaboratorHeader
        member={{ ...makeMember(false), role: 'UNKNOWN' } as never}
      />
    )
    expect(screen.getByText(/UNKNOWN/)).toBeInTheDocument()
  })
})
