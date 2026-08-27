import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CollaboratorAccess } from './CollaboratorAccess'

const member = (completed: string | null, active: boolean) => ({
  role: 'STAFF',
  user: {
    name: 'Ana Souza',
    isActive: active,
    profileCompletedAt: completed,
    credentials: [{ email: 'ana@example.com' }],
  },
})

describe(CollaboratorAccess.name, () => {
  it('shows pending invitation and disabled-account warnings', () => {
    render(
      <CollaboratorAccess
        member={member(null, false) as never}
        isChangingRole={false}
        onChangeRole={vi.fn()}
        onOpenEmailModal={vi.fn()}
        onOpenRemovalConfirm={vi.fn()}
      />
    )
    expect(screen.getByText(/Convite ainda não aceito/)).toBeInTheDocument()
    expect(screen.getByText(/A conta está desativada/)).toBeInTheDocument()
  })

  it('shows access controls for a completed active collaborator', () => {
    render(
      <CollaboratorAccess
        member={member('2024-01-01', true) as never}
        isChangingRole={false}
        onChangeRole={vi.fn()}
        onOpenEmailModal={vi.fn()}
        onOpenRemovalConfirm={vi.fn()}
      />
    )
    expect(screen.getByRole('region', { name: 'Acesso' })).toBeInTheDocument()
    expect(
      screen.queryByText(/Convite ainda não aceito/)
    ).not.toBeInTheDocument()
  })
})
