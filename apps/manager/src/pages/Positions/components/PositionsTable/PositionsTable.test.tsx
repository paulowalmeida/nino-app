import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
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
const onRemove = vi.fn()

const givenFacade = (duplicatingId?: string) =>
  vi.mocked(usePositionsFacade).mockReturnValue({
    duplicatePosition,
    duplicatingId,
    permissionTotal: 22,
  } as never)

const renderTable = (positions = [positionsTableOwnerMock]) =>
  render(
    <MemoryRouter>
      <PositionsTable positions={positions} onRemove={onRemove} />
    </MemoryRouter>
  )

const openMenu = (name: string) =>
  userEvent.click(screen.getByRole('button', { name: `Mais ações para ${name}` }))

describe(PositionsTable.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    givenFacade()
  })

  it('shows the owner as full access, linked to its detail, with no actions', () => {
    renderTable()

    expect(screen.getByRole('link', { name: /Dono/ })).toHaveAttribute(
      'href',
      '/position-owner'
    )
    expect(screen.getByText('Acesso total')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /Mais ações/ })
    ).not.toBeInTheDocument()
  })

  it('counts the permissions of a cargo against the whole catalog', () => {
    renderTable([positionsTableDefaultMock])

    expect(screen.getByText('2 de 22')).toBeInTheDocument()
    expect(screen.getByText('2 pessoas')).toBeInTheDocument()
  })

  it('lets a default cargo be duplicated but not removed', async () => {
    renderTable([positionsTableDefaultMock])

    await openMenu('Gerente')
    expect(
      screen.queryByRole('menuitem', { name: 'Remover' })
    ).not.toBeInTheDocument()
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Duplicar' })
    )

    expect(duplicatePosition).toHaveBeenCalledWith('position-manager')
  })

  it('lets a custom cargo be duplicated and removed', async () => {
    renderTable([positionsTableCustomMock])
    expect(screen.getByText('1 pessoa')).toBeInTheDocument()

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

  it('disables the actions of the cargo being duplicated', () => {
    givenFacade('position-cashier')

    renderTable([positionsTableCustomMock])

    expect(
      screen.getByRole('button', { name: 'Mais ações para Caixa' })
    ).toBeDisabled()
  })
})
