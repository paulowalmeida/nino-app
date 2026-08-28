import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { TableTabs } from './TableTabs'

vi.mock('@pages/TableTabs/facades/useTableTabsFacade/useTableTabsFacade', () => ({
  useTableTabsFacade: () => ({ orders: [], isPending: false, isError: false }),
}))

describe(TableTabs.name, () => {
  it('renders the open tabs screen', () => {
    render(<TableTabs />)

    expect(screen.getByText('Comandas')).toBeInTheDocument()
    expect(screen.getByText(/Nenhuma comanda aberta/)).toBeInTheDocument()
  })
})
