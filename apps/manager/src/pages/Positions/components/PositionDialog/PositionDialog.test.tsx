import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePositionsFacade } from '@pages/Positions/facades/usePositionsFacade/usePositionsFacade'

import { PositionDialog } from './PositionDialog'
import {
  positionDialogCatalogMock,
  positionDialogEditingMock,
} from './PositionDialog.mock'

vi.mock('@pages/Positions/facades/usePositionsFacade/usePositionsFacade')

const createPosition = vi.fn()
const updatePosition = vi.fn()
const onOpenChange = vi.fn()

describe(PositionDialog.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    createPosition.mockResolvedValue(undefined)
    updatePosition.mockResolvedValue(undefined)
    vi.mocked(usePositionsFacade).mockReturnValue({
      permissionCatalog: positionDialogCatalogMock,
      createPosition,
      updatePosition,
    } as never)
  })

  it('creates a cargo from the typed name, level and chosen permissions', async () => {
    render(
      <PositionDialog open position={null} onOpenChange={onOpenChange} />
    )

    expect(
      screen.getByRole('heading', { name: 'Novo cargo' })
    ).toBeInTheDocument()
    expect(screen.getByText('Operação do dia')).toBeInTheDocument()
    expect(screen.getByText('Vendas e clientes')).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText('Nome do cargo'), '  Caixa ')
    await userEvent.click(screen.getByLabelText(/Mexer no caixa/))
    await userEvent.click(screen.getByLabelText(/Ver relatórios/))
    await userEvent.click(screen.getByLabelText(/Ver relatórios/))
    await userEvent.click(screen.getByRole('button', { name: 'Salvar cargo' }))

    await waitFor(() =>
      expect(createPosition).toHaveBeenCalledWith({
        name: 'Caixa',
        level: 20,
        permissions: ['cashbox.operate'],
      })
    )
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('edits an existing cargo starting from its current values', async () => {
    render(
      <PositionDialog
        open
        position={positionDialogEditingMock}
        onOpenChange={onOpenChange}
      />
    )

    expect(
      screen.getByRole('heading', { name: 'Editar cargo' })
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Nome do cargo')).toHaveValue('Caixa')
    expect(screen.getByLabelText(/Mexer no caixa/)).toBeChecked()

    await userEvent.click(screen.getByLabelText(/Ver relatórios/))
    await userEvent.click(screen.getByRole('button', { name: 'Salvar cargo' }))

    await waitFor(() =>
      expect(updatePosition).toHaveBeenCalledWith({
        positionId: 'position-cashier',
        draft: {
          name: 'Caixa',
          level: 30,
          permissions: ['cashbox.operate', 'reports.view'],
        },
      })
    )
  })

  it('asks for a name before saving', async () => {
    render(
      <PositionDialog open position={null} onOpenChange={onOpenChange} />
    )

    await userEvent.click(screen.getByRole('button', { name: 'Salvar cargo' }))

    expect(
      await screen.findByText('Informe o nome do cargo')
    ).toBeInTheDocument()
    expect(createPosition).not.toHaveBeenCalled()
  })

  it('explains a refused save and keeps the dialog open', async () => {
    createPosition.mockRejectedValue(new Error('duplicate'))
    render(
      <PositionDialog open position={null} onOpenChange={onOpenChange} />
    )

    await userEvent.type(screen.getByLabelText('Nome do cargo'), 'Caixa')
    await userEvent.click(screen.getByRole('button', { name: 'Salvar cargo' }))

    expect(
      await screen.findByText(/Não foi possível salvar o cargo/)
    ).toBeInTheDocument()
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('closes without saving when cancelled', async () => {
    render(
      <PositionDialog open position={null} onOpenChange={onOpenChange} />
    )

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(createPosition).not.toHaveBeenCalled()
  })

  it('renders nothing while closed', () => {
    render(
      <PositionDialog
        open={false}
        position={null}
        onOpenChange={onOpenChange}
      />
    )

    expect(
      screen.queryByRole('heading', { name: 'Novo cargo' })
    ).not.toBeInTheDocument()
  })
})
