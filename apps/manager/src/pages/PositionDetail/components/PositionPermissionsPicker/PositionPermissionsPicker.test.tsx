import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePositionDetailFacade } from '@pages/PositionDetail/facades/usePositionDetailFacade/usePositionDetailFacade'

import { PositionPermissionsPicker } from './PositionPermissionsPicker'
import { positionPermissionsPickerCatalogMock } from './PositionPermissionsPicker.mock'

vi.mock('@pages/PositionDetail/facades/usePositionDetailFacade/usePositionDetailFacade')

const onChange = vi.fn()

const renderPicker = (disabled = false, term = '') =>
  render(
    <PositionPermissionsPicker
      value={['cashbox.operate']}
      term={term}
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

  it('counts the chosen permissions in each tab', () => {
    renderPicker()

    expect(screen.getByRole('tab', { name: /Operação/ })).toHaveTextContent(
      'Operação · 1/2'
    )
    expect(screen.getByRole('tab', { name: /Negócio/ })).toHaveTextContent(
      'Negócio · 0/1'
    )
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

  it('switches to another area by clicking its tab', async () => {
    renderPicker()

    await userEvent.click(screen.getByRole('tab', { name: /Negócio/ }))

    expect(screen.getByLabelText(/Ver relatórios/)).toBeVisible()
  })

  it('shows only the tabs and permissions matching the term', () => {
    renderPicker(false, 'relatorios')

    expect(screen.getByLabelText(/Ver relatórios/)).toBeVisible()
    expect(screen.queryByLabelText(/Mexer no caixa/)).not.toBeInTheDocument()
    expect(
      screen.queryByRole('tab', { name: /Operação/ })
    ).not.toBeInTheDocument()
  })

  it('says when nothing matches', () => {
    renderPicker(false, 'zzz')

    expect(screen.getByText('Nenhuma permissão para mostrar.')).toBeVisible()
  })

  it('says so too while the catalog has not loaded', () => {
    vi.mocked(usePositionDetailFacade).mockReturnValue({
      permissionCatalog: [],
    } as never)

    renderPicker()

    expect(screen.getByText('Nenhuma permissão para mostrar.')).toBeVisible()
  })

  it('locks every checkbox when disabled', () => {
    renderPicker(true)

    expect(screen.getByLabelText(/Mexer no caixa/)).toBeDisabled()
  })
})
