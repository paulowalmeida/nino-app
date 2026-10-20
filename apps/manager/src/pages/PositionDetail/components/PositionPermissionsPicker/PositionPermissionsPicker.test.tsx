import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePositionDetailFacade } from '@pages/PositionDetail/facades/usePositionDetailFacade/usePositionDetailFacade'

import { PositionPermissionsPicker } from './PositionPermissionsPicker'
import { positionPermissionsPickerCatalogMock } from './PositionPermissionsPicker.mock'

vi.mock('@pages/PositionDetail/facades/usePositionDetailFacade/usePositionDetailFacade')

const onChange = vi.fn()

const renderPicker = (disabled = false) =>
  render(
    <PositionPermissionsPicker
      value={['cashbox.operate']}
      disabled={disabled}
      onChange={onChange}
    />
  )

describe(PositionPermissionsPicker.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(usePositionDetailFacade).mockReturnValue({
      permissionCatalog: positionPermissionsPickerCatalogMock,
    } as never)
  })

  it('counts the chosen permissions in each group header', () => {
    renderPicker()

    expect(
      screen.getByRole('button', { name: /Operação do dia/ })
    ).toHaveTextContent('1 de 2')
    expect(
      screen.getByRole('button', { name: /Vendas e clientes/ })
    ).toHaveTextContent('0 de 1')
  })

  it('adds and removes a permission', async () => {
    renderPicker()

    await userEvent.click(screen.getByLabelText(/Operar pedidos/))
    expect(onChange).toHaveBeenLastCalledWith([
      'cashbox.operate',
      'orders.operate',
    ])

    await userEvent.click(screen.getByLabelText(/Mexer no caixa/))
    expect(onChange).toHaveBeenLastCalledWith([])
  })

  it('opens another group by clicking its header', async () => {
    renderPicker()

    await userEvent.click(
      screen.getByRole('button', { name: /Vendas e clientes/ })
    )

    expect(screen.getByLabelText(/Ver relatórios/)).toBeVisible()
  })

  it('filters by name or description and opens the matching groups', async () => {
    renderPicker()

    await userEvent.type(
      screen.getByRole('searchbox', { name: 'Filtrar permissões' }),
      'relatorios'
    )

    expect(screen.getByLabelText(/Ver relatórios/)).toBeVisible()
    expect(screen.queryByLabelText(/Mexer no caixa/)).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /Operação do dia/ })
    ).not.toBeInTheDocument()
  })

  it('says when nothing matches', async () => {
    renderPicker()

    await userEvent.type(
      screen.getByRole('searchbox', { name: 'Filtrar permissões' }),
      'zzz'
    )

    expect(screen.getByText('Nenhuma permissão com "zzz".')).toBeVisible()
  })

  it('locks every checkbox when disabled', () => {
    renderPicker(true)

    expect(screen.getByLabelText(/Mexer no caixa/)).toBeDisabled()
  })
})
