import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ProductGrid } from '@compositions/ProductGrid/ProductGrid'

import { sections } from './ProductGrid.mock'

const renderGrid = (
  props: Partial<React.ComponentProps<typeof ProductGrid>> = {}
) =>
  render(
    <ProductGrid
      sections={sections}
      isPending={false}
      onPick={vi.fn()}
      {...props}
    />
  )

describe(ProductGrid.name, () => {
  it('shows the empty state with no menu section registered', () => {
    // Arrange / Act
    renderGrid({ sections: [] })

    // Assert
    expect(
      screen.getByText(/O cardápio está vazio/)
    ).toBeInTheDocument()
  })

  it('lists the active items from the first category by default', () => {
    // Arrange / Act
    renderGrid()

    // Assert
    expect(screen.getByText('Coca-Cola')).toBeInTheDocument()
    expect(screen.queryByText('Guaraná')).not.toBeInTheDocument()
  })

  it('switches to another category when its tab is picked', async () => {
    // Arrange
    renderGrid()

    // Act
    await userEvent.click(screen.getByRole('tab', { name: 'Lanches' }))

    // Assert
    expect(screen.getByText('X-Salada')).toBeInTheDocument()
  })

  it('picks an item when the card is tapped', async () => {
    // Arrange
    const onPick = vi.fn()
    renderGrid({ onPick })

    // Act
    await userEvent.click(screen.getByText('Coca-Cola'))

    // Assert
    expect(onPick).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'item-1' })
    )
  })

  it('searches items by name across every category', async () => {
    // Arrange
    renderGrid()

    // Act
    await userEvent.type(
      screen.getByLabelText('Buscar no cardápio'),
      'salada'
    )

    // Assert
    expect(screen.getByText('X-Salada')).toBeInTheDocument()
    expect(screen.queryByText('Coca-Cola')).not.toBeInTheDocument()
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
  })

  it('excludes inactive items from the search results', async () => {
    // Arrange
    renderGrid()

    // Act
    await userEvent.type(
      screen.getByLabelText('Buscar no cardápio'),
      'guaraná'
    )

    // Assert
    expect(
      screen.getByText('Nenhum item com esse nome no cardápio.')
    ).toBeInTheDocument()
  })
})
