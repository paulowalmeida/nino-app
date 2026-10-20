import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePositionsFacade } from '@pages/Positions/facades/usePositionsFacade/usePositionsFacade'
import type { UnitPosition } from '@shared/types/team/unit-position.type'

import { PositionsContent } from './PositionsContent'
import { positionsContentPositionsMock } from './PositionsContent.mock'

vi.mock('@pages/Positions/facades/usePositionsFacade/usePositionsFacade')
vi.mock('../PositionRow/PositionRow', () => ({
  PositionRow: (props: {
    position: UnitPosition
    onEdit: (position: UnitPosition) => void
    onRemove: (position: UnitPosition) => void
  }) => (
    <li>
      <span>{props.position.name}</span>
      <button onClick={() => props.onEdit(props.position)}>
        {`edit ${props.position.name}`}
      </button>
      <button onClick={() => props.onRemove(props.position)}>
        {`remove ${props.position.name}`}
      </button>
    </li>
  ),
}))
vi.mock('../PositionDialog/PositionDialog', () => ({
  PositionDialog: (props: {
    open: boolean
    position: UnitPosition | null
    onOpenChange: (open: boolean) => void
  }) => (
    <div>
      <span>{`dialog:${props.open ? (props.position?.name ?? 'new') : 'closed'}`}</span>
      <button onClick={() => props.onOpenChange(false)}>close form</button>
      <button onClick={() => props.onOpenChange(true)}>keep form</button>
    </div>
  ),
}))
vi.mock('../PositionRemoveDialog/PositionRemoveDialog', () => ({
  PositionRemoveDialog: (props: {
    position: UnitPosition
    onClose: () => void
  }) => (
    <div>
      <span>{`removing:${props.position.name}`}</span>
      <button onClick={props.onClose}>close remove</button>
    </div>
  ),
}))

const givenFacade = (state: object) =>
  vi.mocked(usePositionsFacade).mockReturnValue({
    positions: positionsContentPositionsMock,
    isPending: false,
    isError: false,
    ...state,
  } as never)

describe(PositionsContent.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    givenFacade({})
  })

  it('shows placeholders while the cargos load', () => {
    givenFacade({ isPending: true, positions: [] })

    render(<PositionsContent />)

    expect(
      screen.queryByRole('button', { name: /Novo cargo/ })
    ).not.toBeInTheDocument()
    expect(document.querySelector('[aria-busy="true"]')).not.toBeNull()
  })

  it('explains a failed load', () => {
    givenFacade({ isError: true, positions: [] })

    render(<PositionsContent />)

    expect(screen.getByText(/Não foi possível carregar os cargos/)).toBeVisible()
  })

  it('lists every cargo', () => {
    render(<PositionsContent />)

    expect(screen.getByText('Dono')).toBeInTheDocument()
    expect(screen.getByText('Caixa')).toBeInTheDocument()
    expect(screen.getByText('dialog:closed')).toBeInTheDocument()
  })

  it('opens the form empty for a new cargo and closes it', async () => {
    render(<PositionsContent />)

    await userEvent.click(screen.getByRole('button', { name: /Novo cargo/ }))
    expect(screen.getByText('dialog:new')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'keep form' }))
    expect(screen.getByText('dialog:new')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'close form' }))
    expect(screen.getByText('dialog:closed')).toBeInTheDocument()
  })

  it('opens the form for the cargo being edited', async () => {
    render(<PositionsContent />)

    await userEvent.click(screen.getByRole('button', { name: 'edit Caixa' }))

    expect(screen.getByText('dialog:Caixa')).toBeInTheDocument()
  })

  it('asks to confirm before removing and dismisses the confirmation', async () => {
    render(<PositionsContent />)

    await userEvent.click(screen.getByRole('button', { name: 'remove Caixa' }))
    expect(screen.getByText('removing:Caixa')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'close remove' }))
    expect(screen.queryByText('removing:Caixa')).not.toBeInTheDocument()
  })
})
