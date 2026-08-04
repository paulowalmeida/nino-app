import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import {
  TeamRoster,
  type RosterEntry,
} from '@compositions/TeamRoster/TeamRoster'

const entry: RosterEntry = {
  id: 'user-1',
  name: 'Weskley Almeida',
  email: 'weskley@nino.delivery',
  role: 'Dono',
  lastLoginAt: null,
  removable: false,
}

const renderRoster = (
  props: Partial<React.ComponentProps<typeof TeamRoster>>
) =>
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
    // Arrange / Act
    const { container } = renderRoster({ isPending: true })

    // Assert
    expect(container.querySelectorAll('li')).toHaveLength(3)
    expect(
      screen.queryByText('Só você por enquanto.')
    ).not.toBeInTheDocument()
  })

  it('does not show the empty state while loading', () => {
    // Arrange / Act
    renderRoster({ isPending: true, entries: [] })

    // Assert
    expect(
      screen.queryByText('Só você por enquanto.')
    ).not.toBeInTheDocument()
  })

  it('replaces the ghosts with people once they arrive', () => {
    // Arrange / Act
    renderRoster({ isPending: false, entries: [entry] })

    // Assert
    expect(screen.getByText('Weskley Almeida')).toBeInTheDocument()
    expect(screen.getByText(/Nunca entrou/)).toBeInTheDocument()
  })

  it('falls back to the empty state with no one on the list', () => {
    // Arrange / Act
    renderRoster({ isPending: false, entries: [] })

    // Assert
    expect(screen.getByText('Só você por enquanto.')).toBeInTheDocument()
  })
})
