import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { MenuItem } from '@custom_types/product'

import { MenuSection } from './MenuSection'

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>)

const { mutate } = vi.hoisted(() => ({ mutate: vi.fn() }))

vi.mock('@hooks/product/useReorderMenuItems', () => ({
  useReorderMenuItems: () => ({ mutate }),
}))

const buildItem = (overrides: Partial<MenuItem>): MenuItem => ({
  id: 'item-1',
  name: 'Item',
  description: null,
  price: '10.00',
  position: 1,
  isActive: true,
  category: { id: 'cat-1', name: 'Categoria' },
  images: [],
  ...overrides,
})

describe(MenuSection.name, () => {
  it('renders every item with the singular count label', () => {
    renderWithRouter(
      <MenuSection
        tenantId="tenant-1"
        name="Bebidas"
        items={[buildItem({ id: 'a', name: 'Suco' })]}
        sectionIndex={0}
        onToggleAvailability={vi.fn()}
      />
    )

    expect(screen.getByText('Bebidas')).toBeInTheDocument()
    expect(screen.getByText('1 item')).toBeInTheDocument()
    expect(screen.getByText('Suco')).toBeInTheDocument()
  })

  it('renders the plural count label for more than one item', () => {
    renderWithRouter(
      <MenuSection
        tenantId="tenant-1"
        name="Bebidas"
        items={[
          buildItem({ id: 'a', name: 'Suco' }),
          buildItem({ id: 'b', name: 'Refrigerante' }),
        ]}
        sectionIndex={0}
        onToggleAvailability={vi.fn()}
      />
    )

    expect(screen.getByText('2 itens')).toBeInTheDocument()
  })

  it('calls onToggleAvailability when the switch is toggled', async () => {
    const onToggleAvailability = vi.fn()
    const item = buildItem({ id: 'a', name: 'Suco', isActive: true })

    renderWithRouter(
      <MenuSection
        tenantId="tenant-1"
        name="Bebidas"
        items={[item]}
        sectionIndex={0}
        onToggleAvailability={onToggleAvailability}
      />
    )

    await userEvent.click(
      screen.getByRole('checkbox', { name: 'Suco disponível' })
    )

    expect(onToggleAvailability).toHaveBeenCalledWith('a', false)
  })
})
