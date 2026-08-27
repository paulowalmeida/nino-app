import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TeamRoster } from './TeamRoster'

describe(TeamRoster.name, () => {
  it('presents the roster heading and member identity', () => {
    render(
      <MemoryRouter>
        <TeamRoster
          title="No painel"
          hint="Quem recebe pedidos."
          entries={[{ id: 'user-1', name: 'Ana Souza', email: 'ana@example.com', role: 'Gerente', lastLoginAt: null, removable: true }]}
          empty="Nenhuma pessoa"
          onRemove={() => undefined}
        />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: 'No painel' })).toBeInTheDocument()
    expect(screen.getByText('Ana Souza')).toBeInTheDocument()
  })
})
