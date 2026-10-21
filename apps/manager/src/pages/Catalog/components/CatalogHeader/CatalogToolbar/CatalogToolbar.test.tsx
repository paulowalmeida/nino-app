import { MemoryRouter } from 'react-router'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CatalogToolbar } from '@pages/Catalog/components/CatalogHeader/CatalogToolbar/CatalogToolbar'

const renderToolbar = () => {
  const onTermChange = vi.fn()

  render(
    <MemoryRouter>
      <CatalogToolbar
        term=""
        onTermChange={onTermChange}
      />
    </MemoryRouter>
  )

  return onTermChange
}

describe(CatalogToolbar.name, () => {
  it('forwards search input changes', () => {
    const onTermChange = renderToolbar()

    fireEvent.change(
      screen.getByRole('searchbox', { name: 'Buscar item pelo nome' }),
      { target: { value: 'suco' } }
    )

    expect(onTermChange).toHaveBeenLastCalledWith('suco')
  })
})
