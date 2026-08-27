import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useProductDetailFacade } from '@pages/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'
import { menuItemMock } from '@pages/ProductDetail/hooks/useProductDetail/useProductDetail.mock'

import { ProductDeleteAction } from './ProductDeleteAction'
import { productDeleteActionMock } from './ProductDeleteAction.mock'

vi.mock(
  '@pages/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'
)

const removeProduct = vi.fn()

const mockAction = (item: typeof menuItemMock | null) =>
  vi.mocked(useProductDetailFacade).mockReturnValue({
    item,
    removeProduct,
    isRemoving: false,
  } as unknown as ReturnType<typeof useProductDetailFacade>)

const openConfirmation = async () =>
  userEvent.click(
    screen.getByRole('button', { name: productDeleteActionMock.trigger })
  )

describe('ProductDeleteAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAction(menuItemMock)
  })

  it('asks for confirmation before removing the item', async () => {
    render(<ProductDeleteAction />)

    await openConfirmation()

    expect(
      screen.getByText(productDeleteActionMock.description)
    ).toBeInTheDocument()
    expect(removeProduct).not.toHaveBeenCalled()
  })

  it('removes the item once the attendant confirms', async () => {
    removeProduct.mockResolvedValue(true)
    render(<ProductDeleteAction />)

    await openConfirmation()
    await userEvent.click(
      screen.getByRole('button', { name: productDeleteActionMock.confirm })
    )

    expect(removeProduct).toHaveBeenCalled()
  })

  it('closes the confirmation when the removal fails', async () => {
    removeProduct.mockResolvedValue(false)
    render(<ProductDeleteAction />)

    await openConfirmation()
    await userEvent.click(
      screen.getByRole('button', { name: productDeleteActionMock.confirm })
    )

    await waitFor(() =>
      expect(
        screen.queryByText(productDeleteActionMock.description)
      ).not.toBeInTheDocument()
    )
  })

  it('gives up the removal when the attendant cancels', async () => {
    render(<ProductDeleteAction />)

    await openConfirmation()
    await userEvent.click(
      screen.getByRole('button', { name: productDeleteActionMock.cancel })
    )

    await waitFor(() =>
      expect(
        screen.queryByText(productDeleteActionMock.description)
      ).not.toBeInTheDocument()
    )
    expect(removeProduct).not.toHaveBeenCalled()
  })

  it('renders nothing while there is no item to remove', () => {
    mockAction(null)

    const { container } = render(<ProductDeleteAction />)

    expect(container).toBeEmptyDOMElement()
  })
})
