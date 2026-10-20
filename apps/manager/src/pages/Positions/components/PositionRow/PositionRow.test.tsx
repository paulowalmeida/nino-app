import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePositionsFacade } from '@pages/Positions/facades/usePositionsFacade/usePositionsFacade'

import { PositionRow } from './PositionRow'
import {
  positionRowCustomMock,
  positionRowDefaultMock,
  positionRowOwnerMock,
} from './PositionRow.mock'

vi.mock('@pages/Positions/facades/usePositionsFacade/usePositionsFacade')

const duplicatePosition = vi.fn()
const onEdit = vi.fn()
const onRemove = vi.fn()

const givenDuplicating = (duplicatingId?: string) =>
  vi.mocked(usePositionsFacade).mockReturnValue({
    duplicatePosition,
    duplicatingId,
  } as never)

describe(PositionRow.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    givenDuplicating()
  })

  it('shows the owner as full access with no actions', () => {
    render(
      <ul>
        <PositionRow
          position={positionRowOwnerMock}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      </ul>
    )

    expect(screen.getByText('Acesso total · 1 pessoa')).toBeInTheDocument()
    expect(screen.getByText('Padrão')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /Mais ações/ })
    ).not.toBeInTheDocument()
  })

  it('lets a default cargo be duplicated but not edited or removed', async () => {
    render(
      <ul>
        <PositionRow
          position={positionRowDefaultMock}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      </ul>
    )
    expect(
      screen.getByText('Nível 50 · 2 permissões · 2 pessoas')
    ).toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', { name: 'Mais ações para Gerente' })
    )

    expect(
      screen.queryByRole('menuitem', { name: 'Editar' })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('menuitem', { name: 'Remover' })
    ).not.toBeInTheDocument()
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Duplicar' })
    )
    expect(duplicatePosition).toHaveBeenCalledWith('position-manager')
  })

  it('lets a custom cargo be edited, duplicated and removed', async () => {
    render(
      <ul>
        <PositionRow
          position={positionRowCustomMock}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      </ul>
    )
    const open = () =>
      userEvent.click(
        screen.getByRole('button', { name: 'Mais ações para Caixa' })
      )

    expect(screen.queryByText('Padrão')).not.toBeInTheDocument()
    expect(
      screen.getByText('Nível 30 · 1 permissão · 1 pessoa')
    ).toBeInTheDocument()
    await open()
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Editar' }))
    expect(onEdit).toHaveBeenCalledWith(positionRowCustomMock)

    await open()
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Duplicar' })
    )
    expect(duplicatePosition).toHaveBeenCalledWith('position-cashier')

    await open()
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Remover' })
    )
    expect(onRemove).toHaveBeenCalledWith(positionRowCustomMock)
  })

  it('disables the actions while the cargo is being duplicated', () => {
    givenDuplicating('position-cashier')

    render(
      <ul>
        <PositionRow
          position={positionRowCustomMock}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      </ul>
    )

    expect(
      screen.getByRole('button', { name: 'Mais ações para Caixa' })
    ).toBeDisabled()
  })
})
