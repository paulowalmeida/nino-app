import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { MenuBoardSelectionActions } from '@pages/Catalog/components/CatalogContent/CatalogControls/MenuBoardSelectionActions/MenuBoardSelectionActions'
import { createSelection } from '@pages/Catalog/components/CatalogContent/CatalogControls/MenuBoardSelectionActions/MenuBoardSelectionActions.mock'

describe(MenuBoardSelectionActions.name, () => {
  it('starts item selection when the trigger is clicked', async () => {
    const user = userEvent.setup()
    const props = createSelection()

    render(<MenuBoardSelectionActions selection={props} />)

    await user.click(screen.getByRole('button', { name: 'Selecionar itens' }))

    expect(props.onStartSelection).toHaveBeenCalledOnce()
  })

  it('toggles all loaded items and cancels selection', async () => {
    const user = userEvent.setup()
    const props = createSelection({
      isSelecting: true,
      isSomeLoadedSelected: true,
      selectedItemCount: 1,
    })

    render(<MenuBoardSelectionActions selection={props} />)

    await user.click(screen.getByRole('checkbox', { name: 'Selecionar todos' }))
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(props.onToggleAllSelection).toHaveBeenCalledOnce()
    expect(props.onCancelSelection).toHaveBeenCalledOnce()
  })

  it('requests bulk deletion only when there are selected items', async () => {
    const user = userEvent.setup()
    const props = createSelection({
      isSelecting: true,
      selectedItemCount: 2,
    })

    render(<MenuBoardSelectionActions selection={props} />)

    await user.click(screen.getByRole('button', { name: 'Excluir' }))

    expect(props.onRequestBulkDelete).toHaveBeenCalledOnce()
  })
})
