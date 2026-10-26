import { MemoryRouter } from 'react-router'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { useSidemenu } from '@layouts/AppLayout/hooks/useSidemenu/useSidemenu'
import { useUnitRole } from '@layouts/AppLayout/hooks/useUnitRole/useUnitRole'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

import { CommandPalette } from './CommandPalette'
import { commandPaletteMock } from './CommandPalette.mock'

vi.mock('@layouts/AppLayout/hooks/useSidemenu/useSidemenu', () => ({
  useSidemenu: vi.fn(),
}))

vi.mock('@layouts/AppLayout/hooks/useUnitRole/useUnitRole', () => ({
  useUnitRole: vi.fn(),
}))

vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit', () => ({
  useCurrentUnit: vi.fn(),
}))

const navigate = vi.fn()

vi.mock('react-router', async () => {
  const actual =
    await vi.importActual<typeof import('react-router')>('react-router')
  return { ...actual, useNavigate: () => navigate }
})

describe(CommandPalette.name, () => {
  it('renders the searchable navigation when opened', async () => {
    vi.mocked(useCurrentUnit).mockReturnValue(commandPaletteMock.currentUnit)
    vi.mocked(useSidemenu).mockReturnValue({
      groups: [
        {
          title: 'Operação',
          items: [
            { section: 'pedidos', label: 'Pedidos', icon: 'bag' },
            { section: 'caixa', label: 'Caixa', icon: 'banknote' },
          ],
        },
      ],
    })

    render(
      <MemoryRouter>
        <CommandPalette open onOpenChange={vi.fn()} />
      </MemoryRouter>
    )

    expect(screen.getByRole('dialog')).toHaveAccessibleName(
      'Buscar funcionalidade'
    )
    expect(screen.getByRole('searchbox')).toHaveAccessibleName(
      'Buscar funcionalidade'
    )
  })

  it('closes through the close button', async () => {
    const onOpenChange = vi.fn()
    vi.mocked(useCurrentUnit).mockReturnValue(commandPaletteMock.currentUnit)
    vi.mocked(useSidemenu).mockReturnValue({ groups: [] })

    render(
      <MemoryRouter>
        <CommandPalette open onOpenChange={onOpenChange} />
      </MemoryRouter>
    )

    await userEvent.click(screen.getByRole('button', { name: 'Fechar busca' }))

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('includes settings controls in the search index', async () => {
    vi.mocked(useCurrentUnit).mockReturnValue(commandPaletteMock.currentUnit)
    vi.mocked(useSidemenu).mockReturnValue({
      groups: [
        {
          title: 'Unidade',
          items: [
            {
              section: 'unidade/pagamento',
              label: 'Pagamento',
              icon: 'credit-card',
            },
          ],
        },
      ],
    })

    render(
      <MemoryRouter>
        <CommandPalette open onOpenChange={vi.fn()} />
      </MemoryRouter>
    )

    const input = screen.getByRole('searchbox')
    await waitFor(() => expect(input).toHaveFocus())
    await userEvent.type(input, 'Pedir CPF na nota')

    expect(
      screen.getByRole('option', {
        name: 'Unidade · Pagamento · Pedir CPF na nota',
        hidden: true,
      })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('option', {
        name: 'Pedido mínimo · Unidade · Pagamento',
        hidden: true,
      })
    ).not.toBeInTheDocument()
  })

  it('includes notifications from the account navigation', async () => {
    navigate.mockClear()
    vi.mocked(useUnitRole).mockReturnValue(null)
    vi.mocked(useCurrentUnit).mockReturnValue(commandPaletteMock.currentUnit)
    vi.mocked(useSidemenu).mockReturnValue({ groups: [] })

    render(
      <MemoryRouter>
        <CommandPalette open onOpenChange={vi.fn()} />
      </MemoryRouter>
    )

    await userEvent.click(
      screen.getByRole('option', { name: 'Conta · Notificações', hidden: true })
    )

    expect(navigate).toHaveBeenCalledWith(
      `/${commandPaletteMock.currentUnit.unitId}/notificacoes`
    )
  })

  it('indexes the overview functionality and keeps its deep link', async () => {
    vi.mocked(useCurrentUnit).mockReturnValue(commandPaletteMock.currentUnit)
    vi.mocked(useSidemenu).mockReturnValue({
      groups: [
        {
          items: [
            { section: 'visao-geral', label: 'Visão geral', icon: 'home' },
          ],
        },
      ],
    })

    render(
      <MemoryRouter>
        <CommandPalette open onOpenChange={vi.fn()} />
      </MemoryRouter>
    )

    const input = screen.getByRole('searchbox')
    await waitFor(() => expect(input).toHaveFocus())
    await userEvent.type(input, 'Últimos vendidos')
    await userEvent.click(
      screen.getByRole('option', {
        name: 'Visão geral · O que mais sai · Últimos vendidos',
        hidden: true,
      })
    )

    expect(navigate).toHaveBeenCalledWith(
      `/${commandPaletteMock.currentUnit.unitId}/visao-geral#ultimos-vendidos`
    )
  })
})
