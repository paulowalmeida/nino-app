import { MemoryRouter } from 'react-router'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePositionDetailFacade } from '@pages/PositionDetail/facades/usePositionDetailFacade/usePositionDetailFacade'

import { PositionDetailForm } from './PositionDetailForm'
import {
  positionDetailFormCatalogMock,
  positionDetailFormCustomMock,
  positionDetailFormDefaultMock,
  positionDetailFormOwnerMock,
  positionDetailFormPositionsMock,
} from './PositionDetailForm.mock'

vi.mock('@pages/PositionDetail/facades/usePositionDetailFacade/usePositionDetailFacade')

const savePosition = vi.fn()

const givenFacade = (position?: object) =>
  vi.mocked(usePositionDetailFacade).mockReturnValue({
    position,
    isCreating: !position,
    permissionCatalog: positionDetailFormCatalogMock,
    positions: positionDetailFormPositionsMock,
    savePosition,
  } as never)

const renderForm = () =>
  render(
    <MemoryRouter>
      <PositionDetailForm />
    </MemoryRouter>
  )

describe(PositionDetailForm.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    savePosition.mockResolvedValue(undefined)
    givenFacade()
  })

  it('groups the permissions and starts empty for a new cargo', () => {
    renderForm()

    expect(screen.getByText('Operação do dia')).toBeInTheDocument()
    expect(screen.getByText('Vendas e clientes')).toBeInTheDocument()
    expect(screen.getByLabelText('Nome do cargo')).toHaveValue('')
    expect(screen.getByText('0 de 2')).toBeInTheDocument()
    expect(screen.getByText('0 pessoas')).toBeInTheDocument()
  })

  it('saves the typed name, placement and chosen permissions', async () => {
    renderForm()

    await userEvent.type(screen.getByLabelText('Nome do cargo'), '  Caixa ')
    await userEvent.click(screen.getByLabelText(/Mexer no caixa/))
    await userEvent.click(screen.getByLabelText(/Ver relatórios/))
    await userEvent.click(screen.getByLabelText(/Ver relatórios/))
    expect(screen.getByText('1 de 2')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Salvar cargo' }))

    await waitFor(() =>
      expect(savePosition).toHaveBeenCalledWith({
        name: 'Caixa',
        belowPositionId: 'position-cashier',
        permissions: ['cashbox.operate'],
      })
    )
  })

  it('starts from the current values of a custom cargo', async () => {
    givenFacade(positionDetailFormCustomMock)
    renderForm()

    expect(screen.queryByLabelText('Nome do cargo')).not.toBeInTheDocument()
    expect(screen.getByLabelText(/Mexer no caixa/)).toBeChecked()
    expect(screen.getByText('2 pessoas')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Salvar cargo' }))

    await waitFor(() =>
      expect(savePosition).toHaveBeenCalledWith({
        belowPositionId: 'position-manager',
        permissions: ['cashbox.operate'],
      })
    )
  })

  it('counts the chosen permissions in each group header', async () => {
    renderForm()
    const operation = screen.getByRole('button', { name: /Operação do dia/ })

    expect(operation).toHaveTextContent('0 de 1')
    await userEvent.click(screen.getByLabelText(/Mexer no caixa/))

    expect(operation).toHaveTextContent('1 de 1')
  })

  it('asks for a name before saving', async () => {
    renderForm()

    await userEvent.click(screen.getByRole('button', { name: 'Salvar cargo' }))

    expect(
      await screen.findByText('Informe o nome do cargo')
    ).toBeInTheDocument()
    expect(savePosition).not.toHaveBeenCalled()
  })

  it('explains a refused save', async () => {
    savePosition.mockRejectedValue(new Error('duplicate'))
    renderForm()

    await userEvent.type(screen.getByLabelText('Nome do cargo'), 'Caixa')
    await userEvent.click(screen.getByRole('button', { name: 'Salvar cargo' }))

    expect(
      await screen.findByText(/Não foi possível salvar o cargo/)
    ).toBeInTheDocument()
  })

  it('offers a way back without saving', () => {
    renderForm()

    expect(screen.getByRole('link', { name: 'Cancelar' })).toBeInTheDocument()
  })

  it('keeps a starting cargo fully editable', () => {
    givenFacade(positionDetailFormDefaultMock)
    renderForm()

    expect(screen.getByText('Hierarquia')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeEnabled()
    expect(screen.getByLabelText(/Mexer no caixa/)).toBeEnabled()
    expect(
      screen.getByRole('button', { name: 'Salvar cargo' })
    ).toBeInTheDocument()
  })

  it('locks the owner cargo: no hierarchy, no save, permissions fixed', () => {
    givenFacade(positionDetailFormOwnerMock)
    renderForm()

    expect(screen.queryByText('Hierarquia')).not.toBeInTheDocument()
    expect(screen.queryByText('fica logo abaixo de')).not.toBeInTheDocument()
    expect(screen.getByLabelText(/Mexer no caixa/)).toBeDisabled()
    expect(
      screen.queryByRole('button', { name: 'Salvar cargo' })
    ).not.toBeInTheDocument()
  })
})
