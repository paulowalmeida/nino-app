import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { TeamRoster } from '@organisms/TeamRoster/TeamRoster'

import {
  changeableEntry,
  ownerEntry,
  teammateEntry,
} from './TeamRoster.mock'

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
    renderRoster({ isPending: false, entries: [ownerEntry] })

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

  it('shows the role as a plain label with no way to change it', () => {
    // Arrange / Act
    renderRoster({ entries: [ownerEntry] })

    // Assert
    expect(
      screen.queryByRole('button', { name: 'Dono' })
    ).not.toBeInTheDocument()
    expect(screen.getByText('Dono')).toBeInTheDocument()
  })

  it('opens the role menu from the role pill, not the kebab', async () => {
    // Arrange
    const onChangeRole = vi.fn()
    renderRoster({ entries: [changeableEntry], onChangeRole })

    // Act
    await userEvent.click(screen.getByRole('button', { name: /Gerente/ }))
    await userEvent.click(
      screen.getByRole('menuitem', { name: /Dono — Tudo/ })
    )

    // Assert
    expect(onChangeRole).toHaveBeenCalledWith('user-2', 'TENANT_OWNER')
  })

  it('hides the search field when the group has nobody to filter', () => {
    // Arrange / Act
    renderRoster({ entries: [], searchLabel: 'Buscar quem está no painel' })

    // Assert
    expect(
      screen.queryByRole('searchbox', { name: 'Buscar quem está no painel' })
    ).not.toBeInTheDocument()
  })

  it('narrows the group to the people matching the typed name', async () => {
    // Arrange
    renderRoster({
      entries: [ownerEntry, teammateEntry],
      searchLabel: 'Buscar quem está no painel',
    })

    // Act
    await userEvent.type(screen.getByRole('searchbox'), 'bruna')

    // Assert
    expect(screen.getByText('Bruna Carvalho')).toBeInTheDocument()
    expect(screen.queryByText('Weskley Almeida')).not.toBeInTheDocument()
  })

  it('matches the e-mail as well as the name', async () => {
    // Arrange
    renderRoster({
      entries: [ownerEntry, teammateEntry],
      searchLabel: 'Buscar quem está no painel',
    })

    // Act
    await userEvent.type(screen.getByRole('searchbox'), 'weskley@nino')

    // Assert
    expect(screen.getByText('Weskley Almeida')).toBeInTheDocument()
    expect(screen.queryByText('Bruna Carvalho')).not.toBeInTheDocument()
  })

  it('keeps the search field up when the term matches nobody', async () => {
    // Arrange
    renderRoster({
      entries: [ownerEntry],
      searchLabel: 'Buscar quem está no painel',
    })

    // Act
    await userEvent.type(screen.getByRole('searchbox'), 'ninguém')

    // Assert
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
    expect(screen.getByText(/Ninguém com "ninguém"/)).toBeInTheDocument()
  })
})
