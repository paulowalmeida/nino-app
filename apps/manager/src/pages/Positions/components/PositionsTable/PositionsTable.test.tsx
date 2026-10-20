import { MemoryRouter } from 'react-router'

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePositionsFacade } from '@pages/Positions/facades/usePositionsFacade/usePositionsFacade'

import { PositionsTable } from './PositionsTable'
import {
  positionsTableCustomMock,
  positionsTableDefaultMock,
  positionsTableOwnerMock,
} from './PositionsTable.mock'

vi.mock('@pages/Positions/facades/usePositionsFacade/usePositionsFacade')

const duplicatePosition = vi.fn()
const movePosition = vi.fn()
const onRemove = vi.fn()

const givenFacade = (duplicatingId?: string) =>
  vi.mocked(usePositionsFacade).mockReturnValue({
    duplicatePosition,
    duplicatingId,
    movePosition,
    permissionTotal: 22,
  } as never)

const allPositions = [
  positionsTableOwnerMock,
  positionsTableDefaultMock,
  positionsTableCustomMock,
]

const renderTable = (positions = allPositions) =>
  render(
    <MemoryRouter>
      <PositionsTable positions={positions} onRemove={onRemove} />
    </MemoryRouter>
  )

const openMenu = (name: string) =>
  userEvent.click(
    screen.getByRole('button', { name: `Mais ações para ${name}` })
  )

describe(PositionsTable.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    givenFacade()
  })

  it('links every cargo name and the eye icon to its detail', () => {
    renderTable()

    expect(screen.getByRole('link', { name: 'Dono' })).toHaveAttribute(
      'href',
      '/position-owner'
    )
    expect(
      screen.getByRole('link', { name: 'Ver detalhes de Caixa' })
    ).toHaveAttribute('href', '/position-cashier')
  })

  it('shows the owner at the top of the hierarchy with full access and no actions but the eye', () => {
    renderTable([positionsTableOwnerMock])

    expect(screen.getByText('Topo da hierarquia')).toBeInTheDocument()
    expect(screen.getByText('Acesso total')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Ver detalhes de Dono' })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /Duplicar|Remover|Mais ações/ })
    ).not.toBeInTheDocument()
  })

  it('counts the permissions of a cargo against the whole catalog', () => {
    renderTable([positionsTableDefaultMock])

    expect(screen.getByText('2 de 22')).toBeInTheDocument()
    expect(screen.getByText('2 pessoas')).toBeInTheDocument()
  })

  it('moves a cargo under the one chosen in the subordinate menu', async () => {
    renderTable()

    await userEvent.click(
      within(screen.getByRole('row', { name: /Caixa/ })).getByRole('button', {
        name: /Dono/,
      })
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Gerente' })
    )

    expect(movePosition).toHaveBeenCalledWith({
      positionId: 'position-cashier',
      draft: { belowPositionId: 'position-manager' },
    })
  })

  it('marks the current superior as taken in the menu', async () => {
    renderTable()

    await userEvent.click(
      within(screen.getByRole('row', { name: /Caixa/ })).getByRole('button', {
        name: /Dono/,
      })
    )

    expect(
      await screen.findByRole('menuitem', { name: 'Dono — atual' })
    ).toHaveAttribute('aria-disabled', 'true')
  })

  it('duplicates through the icon on wide screens', async () => {
    renderTable([positionsTableDefaultMock])

    await userEvent.click(
      screen.getByRole('button', { name: 'Duplicar Gerente' })
    )

    expect(duplicatePosition).toHaveBeenCalledWith('position-manager')
    expect(
      screen.queryByRole('button', { name: 'Remover Gerente' })
    ).not.toBeInTheDocument()
  })

  it('removes a custom cargo through the trash icon', async () => {
    renderTable([positionsTableCustomMock])

    await userEvent.click(screen.getByRole('button', { name: 'Remover Caixa' }))

    expect(onRemove).toHaveBeenCalledWith(positionsTableCustomMock)
  })

  it('keeps the dropdown menu for compact screens', async () => {
    renderTable([positionsTableCustomMock])

    await openMenu('Caixa')
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Duplicar' })
    )
    expect(duplicatePosition).toHaveBeenCalledWith('position-cashier')

    await openMenu('Caixa')
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Remover' })
    )
    expect(onRemove).toHaveBeenCalledWith(positionsTableCustomMock)
  })

  it('offers only duplication in the menu of a starting cargo', async () => {
    renderTable([positionsTableDefaultMock])

    await openMenu('Gerente')

    expect(
      await screen.findByRole('menuitem', { name: 'Duplicar' })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('menuitem', { name: 'Remover' })
    ).not.toBeInTheDocument()
  })

  it('disables the actions of the cargo being duplicated', () => {
    givenFacade('position-cashier')

    renderTable([positionsTableCustomMock])

    expect(
      screen.getByRole('button', { name: 'Mais ações para Caixa' })
    ).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Duplicar Caixa' })).toBeDisabled()
  })
})
