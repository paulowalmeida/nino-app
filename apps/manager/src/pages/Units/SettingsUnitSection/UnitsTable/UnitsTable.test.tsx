import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { UnitsTable } from './UnitsTable'
import { unitsTableUnitsMock } from './UnitsTable.mock'

const onRemove = vi.fn()

const renderTable = (isCurrentMain = true) =>
  render(
    <MemoryRouter>
      <UnitsTable
        units={unitsTableUnitsMock}
        currentUnitId="unit-1"
        isCurrentMain={isCurrentMain}
        detailTo={(unitId) => `/${unitId}/unidade/informacoes`}
        onRemove={onRemove}
      />
    </MemoryRouter>
  )

describe(UnitsTable.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('links each unit name and its eye icon to its details', () => {
    renderTable()

    expect(screen.getByRole('link', { name: 'Loja Centro' })).toHaveAttribute(
      'href',
      '/unit-1/unidade/informacoes'
    )
    expect(
      screen.getByRole('link', { name: 'Ver detalhes de Loja Pinheiros' })
    ).toHaveAttribute('href', '/unit-2/unidade/informacoes')
  })

  it('marks the current unit and its headquarters rank', () => {
    renderTable()

    expect(screen.getByText('aqui')).toBeInTheDocument()
    expect(screen.getByText('matriz')).toBeInTheDocument()
  })

  it('does not call the current unit headquarters when it is not', () => {
    renderTable(false)

    expect(screen.getByText('aqui')).toBeInTheDocument()
    expect(screen.queryByText('matriz')).not.toBeInTheDocument()
  })

  it('lets any unit but the current one be deleted', async () => {
    renderTable()

    expect(
      screen.queryByRole('button', { name: 'Excluir Loja Centro' })
    ).not.toBeInTheDocument()
    await userEvent.click(
      screen.getByRole('button', { name: 'Excluir Loja Pinheiros' })
    )

    expect(onRemove).toHaveBeenCalledWith(unitsTableUnitsMock[1])
  })
})
