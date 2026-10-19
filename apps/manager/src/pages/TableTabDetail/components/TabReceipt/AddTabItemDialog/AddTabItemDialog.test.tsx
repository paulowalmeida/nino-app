import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useTableTabDetailFacade } from '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'

import { AddTabItemDialog } from './AddTabItemDialog'
import { addTabItemDialogMock } from './AddTabItemDialog.mock'

vi.mock(
  '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'
)

const mockFacade = (isAddingItem = false) => {
  const submitAddItem = vi.fn()
  vi.mocked(useTableTabDetailFacade).mockReturnValue({
    menuSections: addTabItemDialogMock.sections,
    submitAddItem,
    isAddingItem,
  } as unknown as ReturnType<typeof useTableTabDetailFacade>)
  return submitAddItem
}

const pickProduct = async () => {
  const user = userEvent.setup({ pointerEventsCheck: 0 })
  await user.click(screen.getByRole('combobox'))
  const listbox = await screen.findByRole('listbox', { hidden: true })
  await user.click(within(listbox).getByText(addTabItemDialogMock.productLabel))
}

describe('AddTabItemDialog', () => {
  beforeEach(() => vi.clearAllMocks())

  it('keeps the confirm action disabled until a product is chosen', async () => {
    mockFacade()
    render(<AddTabItemDialog open onClose={vi.fn()} />)

    const confirm = screen.getByRole('button', { name: 'Lançar item' })
    expect(confirm).toBeDisabled()

    await pickProduct()

    expect(confirm).toBeEnabled()
  })

  it('launches the chosen product with quantity and trimmed notes, then closes', async () => {
    const submitAddItem = mockFacade()
    submitAddItem.mockImplementation((_request, options) => options.onSuccess())
    const onClose = vi.fn()
    render(<AddTabItemDialog open onClose={onClose} />)

    await pickProduct()
    const quantityField = screen.getByRole('spinbutton', {
      name: 'Quantidade',
    })
    fireEvent.change(quantityField, { target: { value: '3' } })
    await userEvent.type(
      screen.getByRole('textbox', { name: /Observação/ }),
      addTabItemDialogMock.notes
    )
    await userEvent.click(screen.getByRole('button', { name: 'Lançar item' }))

    expect(submitAddItem).toHaveBeenCalledWith(
      { productId: 'product-1', quantity: 3, notes: 'sem cebola' },
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
    expect(onClose).toHaveBeenCalled()
  })

  it('launches without notes when none are typed', async () => {
    const submitAddItem = mockFacade()
    render(<AddTabItemDialog open onClose={vi.fn()} />)

    await pickProduct()
    await userEvent.click(screen.getByRole('button', { name: 'Lançar item' }))

    expect(submitAddItem).toHaveBeenCalledWith(
      { productId: 'product-1', quantity: 1, notes: undefined },
      expect.anything()
    )
  })

  it('does not submit with the form when no product is chosen', async () => {
    const submitAddItem = mockFacade()
    render(<AddTabItemDialog open onClose={vi.fn()} />)

    const notesField = screen.getByRole('textbox', { name: /Observação/ })
    await userEvent.type(notesField, 'sem cebola')
    fireEvent.submit(notesField.closest('form') as HTMLFormElement)

    expect(submitAddItem).not.toHaveBeenCalled()
  })

  it('closes without launching when the person cancels or dismisses', async () => {
    const submitAddItem = mockFacade()
    const onClose = vi.fn()
    render(<AddTabItemDialog open onClose={onClose} />)

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }))

    expect(onClose).toHaveBeenCalledTimes(2)
    expect(submitAddItem).not.toHaveBeenCalled()
  })

  it('shows the loading state on the confirm action while launching', () => {
    mockFacade(true)
    render(<AddTabItemDialog open onClose={vi.fn()} />)

    expect(screen.getByRole('button', { name: /Carregando/ })).toHaveAttribute(
      'aria-busy',
      'true'
    )
  })
})
