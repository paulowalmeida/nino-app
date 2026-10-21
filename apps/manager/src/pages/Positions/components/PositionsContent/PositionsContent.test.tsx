import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePositionsFacade } from '@pages/Positions/facades/usePositionsFacade/usePositionsFacade'
import type { UnitPosition } from '@shared/types/team/unit-position.type'

import { PositionsContent } from './PositionsContent'
import { positionsContentPositionsMock } from './PositionsContent.mock'

vi.mock('@pages/Positions/facades/usePositionsFacade/usePositionsFacade')
vi.mock('../PositionsTable/PositionsTable', () => ({
  PositionsTable: (props: {
    positions: UnitPosition[]
    onRemove: (position: UnitPosition) => void
  }) => (
    <div>
      {props.positions.map((position) => (
        <button key={position.id} onClick={() => props.onRemove(position)}>
          {`remove ${position.name}`}
        </button>
      ))}
    </div>
  ),
}))
vi.mock('@shared/components/PositionRemoveDialog/PositionRemoveDialog', () => ({
  PositionRemoveDialog: (props: {
    position: UnitPosition
    onConfirm: () => Promise<unknown>
    onClose: () => void
  }) => (
    <div>
      <span>{`removing:${props.position.name}`}</span>
      <button onClick={() => void props.onConfirm()}>confirm remove</button>
      <button onClick={props.onClose}>close remove</button>
    </div>
  ),
}))

const removePosition = vi.fn()

const givenFacade = (state: object = {}) =>
  vi.mocked(usePositionsFacade).mockReturnValue({
    positions: positionsContentPositionsMock,
    isPending: false,
    isError: false,
    removePosition,
    ...state,
  } as never)

const renderContent = () =>
  render(
    <MemoryRouter>
      <PositionsContent />
    </MemoryRouter>
  )

describe(PositionsContent.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    removePosition.mockResolvedValue(undefined)
    givenFacade()
  })

  it('shows placeholders while the cargos load', () => {
    givenFacade({ isPending: true, positions: [] })

    renderContent()

    expect(document.querySelector('[aria-busy="true"]')).not.toBeNull()
  })

  it('explains a failed load', () => {
    givenFacade({ isError: true, positions: [] })

    renderContent()

    expect(screen.getByText(/Não foi possível carregar os cargos/)).toBeVisible()
  })

  it('lists the cargos with their actions', () => {
    renderContent()

    expect(screen.getByText('remove Caixa')).toBeInTheDocument()
  })

  it('asks to confirm, removes through the facade and dismisses', async () => {
    renderContent()

    await userEvent.click(screen.getByRole('button', { name: 'remove Caixa' }))
    expect(screen.getByText('removing:Caixa')).toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', { name: 'confirm remove' })
    )
    expect(removePosition).toHaveBeenCalledWith('position-cashier')

    await userEvent.click(screen.getByRole('button', { name: 'close remove' }))
    expect(screen.queryByText('removing:Caixa')).not.toBeInTheDocument()
  })
})
