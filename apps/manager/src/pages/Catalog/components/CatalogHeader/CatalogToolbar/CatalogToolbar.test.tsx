import { MemoryRouter } from 'react-router'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CatalogToolbar } from '@pages/Catalog/components/CatalogHeader/CatalogToolbar/CatalogToolbar'

const renderToolbar = (canManageCategories: boolean) => {
  const onTermChange = vi.fn()

  render(
    <MemoryRouter>
      <CatalogToolbar
        term=""
        onTermChange={onTermChange}
        canManageCategories={canManageCategories}
      />
    </MemoryRouter>
  )

  return onTermChange
}

describe(CatalogToolbar.name, () => {
  it('forwards search input changes', () => {
    const onTermChange = renderToolbar(false)

    fireEvent.change(
      screen.getByRole('searchbox', { name: 'Buscar item pelo nome' }),
      { target: { value: 'suco' } }
    )

    expect(onTermChange).toHaveBeenLastCalledWith('suco')
    expect(
      screen.queryByRole('link', { name: 'Gerenciar categorias' })
    ).not.toBeInTheDocument()
  })

  it('shows management actions for an authorized owner', () => {
    renderToolbar(true)

    expect(
      screen.getByRole('link', { name: 'Gerenciar categorias' })
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Novo item' })).toBeInTheDocument()
  })
})
