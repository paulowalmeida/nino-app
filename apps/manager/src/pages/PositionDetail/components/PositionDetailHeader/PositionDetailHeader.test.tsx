import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePositionDetailFacade } from '@pages/PositionDetail/facades/usePositionDetailFacade/usePositionDetailFacade'

import { PositionDetailHeader } from './PositionDetailHeader'
import {
  positionDetailHeaderCustomMock,
  positionDetailHeaderDefaultMock,
  positionDetailHeaderOwnerMock,
} from './PositionDetailHeader.mock'

vi.mock('@pages/PositionDetail/facades/usePositionDetailFacade/usePositionDetailFacade')
vi.mock('@shared/components/PositionRemoveDialog/PositionRemoveDialog', () => ({
  PositionRemoveDialog: (props: {
    onConfirm: () => Promise<unknown>
    onClose: () => void
  }) => (
    <div>
      <button onClick={() => void props.onConfirm()}>confirm remove</button>
      <button onClick={props.onClose}>close remove</button>
    </div>
  ),
}))

const duplicatePosition = vi.fn()
const removePosition = vi.fn()

const givenFacade = (state: object) =>
  vi.mocked(usePositionDetailFacade).mockReturnValue({
    isCreating: false,
    isDuplicating: false,
    duplicatePosition,
    removePosition,
    ...state,
  } as never)

const renderHeader = () =>
  render(
    <MemoryRouter>
      <PositionDetailHeader />
    </MemoryRouter>
  )

describe(PositionDetailHeader.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('titles a cargo being created and offers no actions', () => {
    givenFacade({ isCreating: true, position: undefined })

    renderHeader()

    expect(
      screen.getByRole('heading', { name: 'Novo cargo' })
    ).toBeInTheDocument()
    expect(screen.getByText(/Escolha o nome, o nível/)).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('explains the owner cargo and offers no actions', () => {
    givenFacade({ position: positionDetailHeaderOwnerMock })

    renderHeader()

    expect(screen.getByText(/O Dono sempre tem acesso total/)).toBeVisible()
    expect(screen.getByText('Padrão')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('lets a default cargo be duplicated to customise', async () => {
    givenFacade({ position: positionDetailHeaderDefaultMock })

    renderHeader()
    await userEvent.click(
      screen.getByRole('button', { name: 'Duplicar para personalizar' })
    )

    expect(screen.getByText('Cargo padrão da loja.')).toBeVisible()
    expect(duplicatePosition).toHaveBeenCalledTimes(1)
    expect(
      screen.queryByRole('button', { name: 'Remover cargo' })
    ).not.toBeInTheDocument()
  })

  it('lets a custom cargo be removed after confirming', async () => {
    givenFacade({ position: positionDetailHeaderCustomMock })

    renderHeader()
    expect(screen.queryByText('Padrão')).not.toBeInTheDocument()
    expect(screen.getByText(/só faz o que estiver marcado/)).toBeVisible()

    await userEvent.click(screen.getByRole('button', { name: 'Remover cargo' }))
    await userEvent.click(
      screen.getByRole('button', { name: 'confirm remove' })
    )
    expect(removePosition).toHaveBeenCalledTimes(1)

    await userEvent.click(screen.getByRole('button', { name: 'close remove' }))
    expect(
      screen.queryByRole('button', { name: 'confirm remove' })
    ).not.toBeInTheDocument()
  })
})
