import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useProductDetailFacade } from '@pages/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'
import { menuItemMock } from '@pages/ProductDetail/hooks/useProductDetail/useProductDetail.mock'

import { ProductDetailForm } from './ProductDetailForm'
import { productDetailFormMock } from './ProductDetailForm.mock'

vi.mock(
  '@pages/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'
)
vi.mock(
  '@pages/ProductDetail/components/ProductDetailForm/ProductDetailPhoto/ProductDetailPhoto',
  () => ({ ProductDetailPhoto: () => <div>foto do item</div> })
)
vi.mock(
  '@pages/ProductDetail/components/ProductDetailForm/ProductDeleteAction/ProductDeleteAction',
  () => ({ ProductDeleteAction: () => <div>excluir item</div> })
)

const submitProduct = vi.fn()
const cancel = vi.fn()

const mockForm = (item: typeof menuItemMock | null) =>
  vi.mocked(useProductDetailFacade).mockReturnValue({
    item,
    categoryOptions: productDetailFormMock.categoryOptions,
    submitProduct,
    cancel,
  } as unknown as ReturnType<typeof useProductDetailFacade>)

const nameField = () =>
  screen.getByLabelText(productDetailFormMock.nameLabel) as HTMLInputElement

const submit = async () =>
  userEvent.click(
    screen.getByRole('button', { name: productDetailFormMock.submitLabel })
  )

describe('ProductDetailForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    submitProduct.mockResolvedValue(true)
    mockForm(menuItemMock)
  })

  it('brings the saved item into the fields', async () => {
    render(<ProductDetailForm />)

    await waitFor(() => expect(nameField().value).toBe(menuItemMock.name))
    expect(
      (screen.getByLabelText(productDetailFormMock.priceLabel) as HTMLInputElement)
        .value
    ).toBe('24,90')
    expect(
      screen.getByLabelText(productDetailFormMock.availabilityLabel)
    ).toBeInTheDocument()
  })

  it('holds the save until something actually changed', async () => {
    render(<ProductDetailForm />)

    await waitFor(() => expect(nameField().value).toBe(menuItemMock.name))
    expect(
      screen.getByRole('button', { name: productDetailFormMock.submitLabel })
    ).toBeDisabled()
  })

  it('saves the edited item', async () => {
    render(<ProductDetailForm />)
    await waitFor(() => expect(nameField().value).toBe(menuItemMock.name))

    await userEvent.clear(nameField())
    await userEvent.type(nameField(), productDetailFormMock.editedName)
    await submit()

    await waitFor(() =>
      expect(submitProduct).toHaveBeenCalledWith(
        expect.objectContaining({ name: productDetailFormMock.editedName })
      )
    )
  })

  it('keeps the attendant on the form when saving fails', async () => {
    submitProduct.mockResolvedValue(false)
    render(<ProductDetailForm />)
    await waitFor(() => expect(nameField().value).toBe(menuItemMock.name))

    await userEvent.type(nameField(), '!')
    await submit()

    expect(
      await screen.findByText(productDetailFormMock.submitError)
    ).toBeInTheDocument()
  })

  it('refuses a price that would put the item out for free', async () => {
    render(<ProductDetailForm />)
    await waitFor(() => expect(nameField().value).toBe(menuItemMock.name))

    const price = screen.getByLabelText(productDetailFormMock.priceLabel)
    await userEvent.clear(price)
    await userEvent.type(price, '0,00')
    await submit()

    expect(
      await screen.findByText(productDetailFormMock.priceError)
    ).toBeInTheDocument()
    expect(submitProduct).not.toHaveBeenCalled()
  })

  it('leaves the card behind when the attendant gives up', async () => {
    render(<ProductDetailForm />)

    await userEvent.click(
      screen.getByRole('button', { name: productDetailFormMock.cancelLabel })
    )

    expect(cancel).toHaveBeenCalled()
  })

  it('opens empty while there is no item to edit', () => {
    mockForm(null)

    render(<ProductDetailForm />)

    expect(nameField().value).toBe('')
  })
})
