import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { DragControls } from 'framer-motion'
import { describe, expect, it, vi } from 'vitest'

import { MenuRowLeadingControl } from '@pages/Catalog/components/CatalogContent/CatalogItems/MenuRow/MenuRowLeadingControl/MenuRowLeadingControl'

const dragControls = {
  start: vi.fn(),
} as unknown as DragControls

describe(MenuRowLeadingControl.name, () => {
  it('starts reordering from the drag handle', async () => {
    const user = userEvent.setup()

    render(
      <MenuRowLeadingControl
        itemName="Coxinha"
        canReorder
        isSelecting={false}
        isSelected={false}
        dragControls={dragControls}
        onToggleSelect={vi.fn()}
      />
    )

    await user.pointer({ keys: '[MouseLeft]', target: screen.getByRole('button') })

    expect(dragControls.start).toHaveBeenCalled()
  })

  it('toggles the item checkbox while selecting', async () => {
    const user = userEvent.setup()
    const onToggleSelect = vi.fn()

    render(
      <MenuRowLeadingControl
        itemName="Coxinha"
        canReorder
        isSelecting
        isSelected={false}
        dragControls={dragControls}
        onToggleSelect={onToggleSelect}
      />
    )

    await user.click(screen.getByRole('checkbox', { name: 'Selecionar Coxinha' }))

    expect(onToggleSelect).toHaveBeenCalledOnce()
  })
})
