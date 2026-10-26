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
          entries={[
            {
              id: 'user-1',
              kind: 'STAFF',
              name: 'Ana Souza',
              email: 'ana@example.com',
              role: 'Gerente',
              lastLoginAt: null,
              removable: true,
            },
          ]}
          empty="Nenhuma pessoa"
          onRemove={() => undefined}
        />
      </MemoryRouter>
    )
    expect(
      screen.getByRole('heading', { name: 'No painel' })
    ).toBeInTheDocument()
    expect(screen.getByText('Ana Souza')).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: 'E-mail' })
    ).toBeInTheDocument()
  })

  it('promotes a member through the cargo menu', async () => {
    const onChangePosition = vi.fn()
    render(
      <MemoryRouter>
        <TeamRoster
          title="No painel"
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

  it('filters the roster by name or e-mail and explains an empty search', () => {
    const renderWithTerm = (term: string) => (
      <MemoryRouter>
        <TeamRoster
          title="No painel"
          entries={[teamRosterPromotableEntryMock, teamRosterEditableEntryMock]}
          empty="Nenhuma pessoa"
          term={term}
          onRemove={() => undefined}
        />
      </MemoryRouter>
    )
    const { rerender } = render(renderWithTerm('duda@'))

    expect(screen.getByText('Duda Reis')).toBeInTheDocument()
    expect(screen.queryByText('Caio Dias')).not.toBeInTheDocument()

    rerender(renderWithTerm('zzz'))
    expect(screen.getByText(/Ninguém com "zzz"/)).toBeInTheDocument()
  })

  it('shows placeholder rows while loading and the empty message after', () => {
    const { rerender } = render(
      <MemoryRouter>
        <TeamRoster
          title="No painel"
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
          entries={[]}
          empty="Nenhuma pessoa"
          onRemove={() => undefined}
        />
      </MemoryRouter>
    )
    expect(screen.getByText('Nenhuma pessoa')).toBeInTheDocument()
  })

  it('edits, suspends, and removes a member from the compact menu', async () => {
    const onEdit = vi.fn()
    const onRemove = vi.fn()
    const onSetActivity = vi.fn()
    render(
      <MemoryRouter>
        <TeamRoster
          title="No painel"
          entries={[teamRosterEditableEntryMock]}
          empty="Nenhuma pessoa"
          onRemove={onRemove}
          onEdit={onEdit}
          onSetActivity={onSetActivity}
        />
      </MemoryRouter>
    )

    await userEvent.click(
      screen.getByRole('button', { name: 'Mais ações para Duda Reis' })
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Editar' })
    )
    expect(onEdit).toHaveBeenCalledWith('user-3')

    await userEvent.click(
      screen.getByRole('button', { name: 'Mais ações para Duda Reis' })
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Suspender' })
    )
    expect(onSetActivity).toHaveBeenCalledWith('user-3')

    await userEvent.click(
      screen.getByRole('button', { name: 'Mais ações para Duda Reis' })
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Remover da loja' })
    )
    expect(onRemove).toHaveBeenCalledWith('user-3', 'STAFF')
  })

  it('removes a courier through the kebab without e-mail or activity actions', async () => {
    const onRemove = vi.fn()
    render(
      <MemoryRouter>
        <TeamRoster
          title="Ativos"
          entries={[teamRosterCourierEntryMock]}
          empty="Nenhum"
          removingId="other"
          onRemove={onRemove}
          onSetActivity={vi.fn()}
          onChangePosition={vi.fn()}
        />
      </MemoryRouter>
    )

    await userEvent.click(
      screen.getByRole('button', { name: 'Mais ações para Beto Lima' })
    )
    expect(screen.queryByRole('menuitem', { name: 'Editar' })).toBeNull()
    expect(screen.queryByRole('menuitem', { name: 'Suspender' })).toBeNull()
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Remover da loja' })
    )

    expect(onRemove).toHaveBeenCalledWith('courier-1', 'COURIER')
  })

  it('offers no actions for a member that cannot be removed', () => {
    render(
      <MemoryRouter>
        <TeamRoster
          title="No painel"
          entries={[teamRosterFixedEntryMock]}
          empty="Nenhuma pessoa"
          onRemove={() => undefined}
          onEdit={() => undefined}
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
