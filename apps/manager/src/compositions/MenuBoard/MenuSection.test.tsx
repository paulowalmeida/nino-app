import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Reorder } from 'framer-motion'
import { describe, expect, it, vi } from 'vitest'

import type { MenuItem, MenuSection as MenuSectionData } from '@custom_types/product'

import { MenuSection } from './MenuSection'

const sectionValue: MenuSectionData = {
  id: 'cat-1',
  name: 'Bebidas',
  position: 0,
  items: [],
}

/** Reorder.Item exige um Reorder.Group ancestral, mesmo fora de teste de drag. */
const renderWithRouter = (ui: React.ReactElement) =>
  render(
    <MemoryRouter>
      <Reorder.Group
        as="div"
        axis="y"
        values={[sectionValue]}
        onReorder={() => {}}
      >
        {ui}
      </Reorder.Group>
    </MemoryRouter>
  )

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
  category: { id: 'cat-1', name: 'Categoria', position: 0 },
  images: [],
  ...overrides,
})

describe(MenuSection.name, () => {
  it('renders every item with the singular count label', () => {
    renderWithRouter(
      <MenuSection
        value={sectionValue}
        tenantId="tenant-1"
        name="Bebidas"
        items={[buildItem({ id: 'a', name: 'Suco' })]}
        sectionIndex={0}
        onToggleAvailability={vi.fn()}
        onSectionDragEnd={vi.fn()}
      />
    )

    expect(screen.getByText('Bebidas')).toBeInTheDocument()
    expect(screen.getByText('1 item')).toBeInTheDocument()
    expect(screen.getByText('Suco')).toBeInTheDocument()
  })

  it('renders the plural count label for more than one item', () => {
    renderWithRouter(
      <MenuSection
        value={sectionValue}
        tenantId="tenant-1"
        name="Bebidas"
        items={[
          buildItem({ id: 'a', name: 'Suco' }),
          buildItem({ id: 'b', name: 'Refrigerante' }),
        ]}
        sectionIndex={0}
        onToggleAvailability={vi.fn()}
        onSectionDragEnd={vi.fn()}
      />
    )

    expect(screen.getByText('2 itens')).toBeInTheDocument()
  })

  it('calls onToggleAvailability when the switch is toggled', async () => {
    const onToggleAvailability = vi.fn()
    const item = buildItem({ id: 'a', name: 'Suco', isActive: true })

    renderWithRouter(
      <MenuSection
        value={sectionValue}
        tenantId="tenant-1"
        name="Bebidas"
        items={[item]}
        sectionIndex={0}
        onToggleAvailability={onToggleAvailability}
        onSectionDragEnd={vi.fn()}
      />
    )

    await userEvent.click(
      screen.getByRole('checkbox', { name: 'Suco disponível' })
    )

    expect(onToggleAvailability).toHaveBeenCalledWith('a', false)
  })
})
