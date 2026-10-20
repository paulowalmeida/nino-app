import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePositionDetailFacade } from '@pages/PositionDetail/facades/usePositionDetailFacade/usePositionDetailFacade'

import { PositionNameEditor } from './PositionNameEditor'
import { positionNameEditorMock } from './PositionNameEditor.mock'

vi.mock('@pages/PositionDetail/facades/usePositionDetailFacade/usePositionDetailFacade')

const renamePosition = vi.fn()

const startEditing = async () => {
  render(<PositionNameEditor name={positionNameEditorMock.name} />)
  await userEvent.click(
    screen.getByRole('button', { name: 'Editar nome do cargo' })
  )
  return screen.getByRole('textbox', { name: 'Nome do cargo' })
}

describe(PositionNameEditor.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    renamePosition.mockResolvedValue(undefined)
    vi.mocked(usePositionDetailFacade).mockReturnValue({
      renamePosition,
    } as never)
  })

  it('shows the name as the title with a pencil to edit it', () => {
    render(<PositionNameEditor name={positionNameEditorMock.name} />)

    expect(screen.getByRole('heading', { name: 'Caixa' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Editar nome do cargo' })
    ).toBeInTheDocument()
  })

  it('saves the new name when focus leaves the field', async () => {
    const input = await startEditing()

    expect(input).toHaveValue('Caixa')
    await userEvent.clear(input)
    await userEvent.type(input, '  Cozinheiro ')
    await userEvent.tab()

    expect(renamePosition).toHaveBeenCalledWith('Cozinheiro')
    expect(screen.getByRole('heading', { name: 'Caixa' })).toBeInTheDocument()
  })

  it('saves with Enter', async () => {
    const input = await startEditing()

    await userEvent.type(input, ' 2{Enter}')

    expect(renamePosition).toHaveBeenCalledWith('Caixa 2')
  })

  it('does not save an unchanged or empty name', async () => {
    const input = await startEditing()
    await userEvent.tab()
    expect(renamePosition).not.toHaveBeenCalled()

    const again = await (async () => {
      await userEvent.click(
        screen.getByRole('button', { name: 'Editar nome do cargo' })
      )
      return screen.getByRole('textbox', { name: 'Nome do cargo' })
    })()
    await userEvent.clear(again)
    await userEvent.tab()

    expect(input).not.toBeInTheDocument()
    expect(renamePosition).not.toHaveBeenCalled()
  })

  it('discards the edit with Escape', async () => {
    const input = await startEditing()

    await userEvent.type(input, 'xyz{Escape}')

    expect(renamePosition).not.toHaveBeenCalled()
    expect(screen.getByRole('heading', { name: 'Caixa' })).toBeInTheDocument()
  })

  it('swallows a refused rename, which the mutation already reports', async () => {
    renamePosition.mockRejectedValue(new Error('duplicate'))
    const input = await startEditing()

    await userEvent.type(input, 'x{Enter}')

    expect(renamePosition).toHaveBeenCalledWith('Caixax')
  })
})
