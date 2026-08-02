import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { RosterEntry } from './TeamRoster.types'
import { TeamRoster } from './TeamRoster'

const entry: RosterEntry = {
  id: 'user-1',
  name: 'Weskley Almeida',
  email: 'weskley@nino.delivery',
  role: 'Dono',
  lastLoginAt: null,
  removable: false,
}

const renderRoster = (props: Partial<React.ComponentProps<typeof TeamRoster>>) =>
  render(
    <TeamRoster
      title="No painel"
      hint="Quem recebe, aceita e acompanha os pedidos."
      entries={[]}
      empty="Só você por enquanto."
      onRemove={vi.fn()}
      {...props}
    />
  )

describe(TeamRoster.name, () => {
  it('shows ghost rows while the team is loading', () => {
    const { container } = renderRoster({ isPending: true })

    expect(container.querySelectorAll('li')).toHaveLength(3)
    expect(screen.queryByText('Só você por enquanto.')).not.toBeInTheDocument()
  })

  it('does not show the empty state while loading', () => {
    renderRoster({ isPending: true, entries: [] })

    expect(screen.queryByText('Só você por enquanto.')).not.toBeInTheDocument()
  })

  it('replaces the ghosts with people once they arrive', () => {
    renderRoster({ isPending: false, entries: [entry] })

    expect(screen.getByText('Weskley Almeida')).toBeInTheDocument()
    expect(screen.getByText(/Nunca entrou/)).toBeInTheDocument()
  })

  it('falls back to the empty state with no one on the list', () => {
    renderRoster({ isPending: false, entries: [] })

    expect(screen.getByText('Só você por enquanto.')).toBeInTheDocument()
  })
})
