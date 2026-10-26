import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { MenuRowTrailingActions } from '@pages/Catalog/components/CatalogContent/CatalogItems/MenuRow/MenuRowTrailingActions/MenuRowTrailingActions'
import { item } from '@pages/Catalog/components/CatalogContent/CatalogItems/MenuRow/MenuRowTrailingActions/MenuRowTrailingActions.mock'

describe(MenuRowTrailingActions.name, () => {
  it('forwards availability changes and deletion requests', async () => {
    const user = userEvent.setup()
    const onToggleAvailability = vi.fn()
    const onDelete = vi.fn()

    render(
      <MenuRowTrailingActions
        item={item}
        isSelecting={false}
        onToggleAvailability={onToggleAvailability}
        onDelete={onDelete}
      />
    )

    await user.click(screen.getByLabelText('Coxinha disponível'))
    await user.click(screen.getByRole('button', { name: 'Excluir Coxinha' }))

    expect(onToggleAvailability).toHaveBeenCalled()
    expect(onDelete).toHaveBeenCalledOnce()
  })
})
