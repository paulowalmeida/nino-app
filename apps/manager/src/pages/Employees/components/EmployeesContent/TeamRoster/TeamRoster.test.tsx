import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { TeamRoster } from './TeamRoster'
import {
  teamRosterCourierEntryMock,
  teamRosterEditableEntryMock,
  teamRosterFixedEntryMock,
  teamRosterLockedEntryMock,
  teamRosterPromotableEntryMock,
} from './TeamRoster.mock'

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

  it('promotes a member through the cargo menu', async () => {
    const onChangePosition = vi.fn()
    render(
      <MemoryRouter>
        <TeamRoster
          title="No painel"
          hint="Quem recebe pedidos."
          entries={[teamRosterPromotableEntryMock]}
          empty="Nenhuma pessoa"
          onRemove={() => undefined}
          onChangePosition={onChangePosition}
        />
      </MemoryRouter>
    )

    await userEvent.click(screen.getByRole('button', { name: /Atendente/ }))
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Promover a Gerente' })
    )

    expect(onChangePosition).toHaveBeenCalledWith('user-2', 'position-manager')
  })

  it('keeps the cargo as a plain badge when it cannot be changed', () => {
    render(
      <MemoryRouter>
        <TeamRoster
          title="No painel"
          hint="Quem recebe pedidos."
          entries={[teamRosterLockedEntryMock]}
          empty="Nenhuma pessoa"
          onRemove={() => undefined}
          onChangePosition={vi.fn()}
        />
      </MemoryRouter>
    )

    expect(
      screen.queryByRole('button', { name: /Atendente/ })
    ).not.toBeInTheDocument()
    expect(screen.getByText('Atendente')).toBeInTheDocument()
  })

  it('filters the roster by name or e-mail and explains an empty search', async () => {
    render(
      <MemoryRouter>
        <TeamRoster
          title="No painel"
          hint="Quem recebe pedidos."
          entries={[teamRosterPromotableEntryMock, teamRosterEditableEntryMock]}
          empty="Nenhuma pessoa"
          searchLabel="Buscar quem está no painel"
          onRemove={() => undefined}
        />
      </MemoryRouter>
    )
    const search = screen.getByRole('searchbox', {
      name: 'Buscar quem está no painel',
    })

    await userEvent.type(search, 'duda@')
    expect(screen.getByText('Duda Reis')).toBeInTheDocument()
    expect(screen.queryByText('Caio Dias')).not.toBeInTheDocument()

    await userEvent.clear(search)
    await userEvent.type(search, 'zzz')
    expect(screen.getByText(/Ninguém com "zzz"/)).toBeInTheDocument()
  })

  it('shows placeholder rows while loading and the empty message after', () => {
    const { rerender } = render(
      <MemoryRouter>
        <TeamRoster
          title="No painel"
          hint="Quem recebe pedidos."
          entries={[]}
          empty="Nenhuma pessoa"
          isPending
          onRemove={() => undefined}
        />
      </MemoryRouter>
    )
    expect(screen.queryByText('Nenhuma pessoa')).not.toBeInTheDocument()

    rerender(
      <MemoryRouter>
        <TeamRoster
          title="Na rua"
          hint="Quem entrega."
          entries={[]}
          empty="Nenhuma pessoa"
          onRemove={() => undefined}
        />
      </MemoryRouter>
    )
    expect(screen.getByText('Nenhuma pessoa')).toBeInTheDocument()
  })

  it('edits the e-mail and removes a member from the kebab menu', async () => {
    const onEditEmail = vi.fn()
    const onRemove = vi.fn()
    render(
      <MemoryRouter>
        <TeamRoster
          title="No painel"
          hint="Quem recebe pedidos."
          entries={[teamRosterEditableEntryMock]}
          empty="Nenhuma pessoa"
          onRemove={onRemove}
          onEditEmail={onEditEmail}
        />
      </MemoryRouter>
    )

    await userEvent.click(
      screen.getByRole('button', { name: 'Mais ações para Duda Reis' })
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Editar e-mail' })
    )
    expect(onEditEmail).toHaveBeenCalledWith('user-3')

    await userEvent.click(
      screen.getByRole('button', { name: 'Mais ações para Duda Reis' })
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Tirar da loja' })
    )
    expect(onRemove).toHaveBeenCalledWith('user-3')
  })

  it('removes a courier through the kebab without an e-mail action', async () => {
    const onRemove = vi.fn()
    render(
      <MemoryRouter>
        <TeamRoster
          title="Na rua"
          hint="Quem entrega."
          entries={[teamRosterCourierEntryMock]}
          empty="Nenhum"
          removingId="other"
          onRemove={onRemove}
          onChangePosition={vi.fn()}
        />
      </MemoryRouter>
    )

    await userEvent.click(
      screen.getByRole('button', { name: 'Mais ações para Beto Lima' })
    )
    expect(screen.queryByRole('menuitem', { name: 'Editar e-mail' })).toBeNull()
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Tirar da loja' })
    )

    expect(onRemove).toHaveBeenCalledWith('courier-1')
  })

  it('offers no actions for a member that cannot be removed', () => {
    render(
      <MemoryRouter>
        <TeamRoster
          title="No painel"
          hint="Quem recebe pedidos."
          entries={[teamRosterFixedEntryMock]}
          empty="Nenhuma pessoa"
          onRemove={() => undefined}
          onEditEmail={() => undefined}
        />
      </MemoryRouter>
    )

    expect(
      screen.queryByRole('button', { name: /Mais ações/ })
    ).not.toBeInTheDocument()
  })

  it('disables the actions of the row being changed', () => {
    render(
      <MemoryRouter>
        <TeamRoster
          title="No painel"
          hint="Quem recebe pedidos."
          entries={[teamRosterPromotableEntryMock]}
          empty="Nenhuma pessoa"
          changingPositionId="user-2"
          onRemove={() => undefined}
          onChangePosition={vi.fn()}
        />
      </MemoryRouter>
    )

    expect(screen.getByRole('button', { name: /Atendente/ })).toBeDisabled()
  })
})
