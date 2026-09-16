import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ProductConfigurationModal } from './ProductConfigurationModal'
import { configurableProductMock } from './ProductConfigurationModal.mock'

describe(ProductConfigurationModal.name, () => {
  it('requires mandatory choices and emits the configured item', async () => {
    const onAdd = vi.fn()
    render(
      <ProductConfigurationModal
        item={configurableProductMock}
        onAdd={onAdd}
        onOpenChange={vi.fn()}
      />
    )

    const addButton = screen.getByRole('button', { name: /Adicionar/ })
    expect(addButton).toBeDisabled()

    await userEvent.click(screen.getByRole('radio', { name: /Ao ponto/ }))
    await userEvent.click(screen.getByRole('checkbox'))
    expect(addButton).toBeEnabled()
    expect(addButton).toHaveTextContent('R$ 30,90')

    await userEvent.click(addButton)
    expect(onAdd).toHaveBeenCalledWith(configurableProductMock, [
      {
        optionId: 'option-1',
        name: 'Ao ponto',
        unitPrice: '0',
        quantity: 1,
        groupName: 'Ponto da carne',
      },
      {
        optionId: 'option-3',
        name: 'Bacon extra',
        unitPrice: '6',
        quantity: 1,
        groupName: 'Adicionais',
      },
    ])
  })

  it('closes without adding the product', async () => {
    const onAdd = vi.fn()
    const onOpenChange = vi.fn()
    render(
      <ProductConfigurationModal
        item={configurableProductMock}
        onAdd={onAdd}
        onOpenChange={onOpenChange}
      />
    )

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onAdd).not.toHaveBeenCalled()
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
