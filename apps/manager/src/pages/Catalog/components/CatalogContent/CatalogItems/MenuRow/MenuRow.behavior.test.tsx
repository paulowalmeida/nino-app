import type { AnimationEvent, AnimationEventHandler, ReactNode } from 'react'
import { MemoryRouter } from 'react-router'

import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { MenuRow } from '@pages/Catalog/components/CatalogContent/CatalogItems/MenuRow/MenuRow'
import type { MenuItem } from '@shared/types/product/menu-item'

vi.mock('framer-motion', () => ({
  Reorder: {
    Item: ({
      children,
      onAnimationEnd,
    }: {
      children: ReactNode
      onAnimationEnd: AnimationEventHandler<HTMLLIElement>
    }) => (
      <li onAnimationEnd={onAnimationEnd}>
        <button
          onClick={(event) =>
            onAnimationEnd({
              target: event.currentTarget.parentElement,
              currentTarget: event.currentTarget.parentElement,
            } as unknown as AnimationEvent<HTMLLIElement>)
          }
        >
          terminar entrada
        </button>
        <button
          onClick={(event) =>
            onAnimationEnd({
              target: event.currentTarget,
              currentTarget: event.currentTarget.parentElement,
            } as unknown as AnimationEvent<HTMLLIElement>)
          }
        >
          evento filho
        </button>
        {children}
      </li>
    ),
  },
  useDragControls: () => ({ start: vi.fn() }),
}))
vi.mock('@pages/Catalog/components/CatalogContent/CatalogItems/MenuRow/MenuRowLeadingControl/MenuRowLeadingControl', () => ({
  MenuRowLeadingControl: () => null,
}))
vi.mock('@pages/Catalog/components/CatalogContent/CatalogItems/MenuRow/MenuRowContent/MenuRowContent', () => ({
  MenuRowContent: () => <span>conteúdo</span>,
}))
vi.mock('@pages/Catalog/components/CatalogContent/CatalogItems/MenuRow/MenuRowTrailingActions/MenuRowTrailingActions', () => ({
  MenuRowTrailingActions: () => null,
}))

const item = { id: 'item-1', name: 'Coxinha', isActive: true } as MenuItem

describe('MenuRow animation behavior', () => {
  it('removes entrance animation after the row animation ends', () => {
    render(
      <MemoryRouter>
        <MenuRow
          item={item}
          index={0}
          canReorder={false}
          isSelecting={false}
          isSelected={false}
          onToggleSelect={vi.fn()}
          onToggleAvailability={vi.fn()}
          onDelete={vi.fn()}
          onDragEnd={vi.fn()}
        />
      </MemoryRouter>
    )

    fireEvent.animationEnd(screen.getByRole('listitem'))
    fireEvent.click(screen.getByRole('button', { name: 'terminar entrada' }))

    expect(screen.getByRole('listitem')).toBeInTheDocument()
  })

  it('ignores animation events bubbling from child elements', async () => {
    render(
      <MemoryRouter>
        <MenuRow
          item={{ ...item, isActive: false }}
          index={0}
          canReorder={false}
          isSelecting={false}
          isSelected={false}
          onToggleSelect={vi.fn()}
          onToggleAvailability={vi.fn()}
          onDelete={vi.fn()}
          onDragEnd={vi.fn()}
        />
      </MemoryRouter>
    )

    await userEvent.click(screen.getByRole('button', { name: 'evento filho' }))

    expect(screen.getByRole('listitem')).toBeInTheDocument()
  })
})
