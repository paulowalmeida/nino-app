import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useNewProductFacade } from '@pages/NewProduct/facades/useNewProductFacade/useNewProductFacade'

import { ProductCategoryCreator } from './ProductCategoryCreator'
import { productCategoryCreatorMock } from './ProductCategoryCreator.mock'

vi.mock('@pages/NewProduct/facades/useNewProductFacade/useNewProductFacade')

const createCategory = vi.fn()
const onCategoryCreated = vi.fn()

const openCreator = async () => {
  render(<ProductCategoryCreator onCategoryCreated={onCategoryCreated} />)
  await userEvent.click(
    screen.getByRole('button', { name: productCategoryCreatorMock.openLabel })
  )
  await userEvent.type(
    screen.getByLabelText(productCategoryCreatorMock.nameLabel),
    productCategoryCreatorMock.typedName
  )
}

describe('ProductCategoryCreator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useNewProductFacade).mockReturnValue({
      createCategory,
      isCreatingCategory: false,
    } as unknown as ReturnType<typeof useNewProductFacade>)
  })

  it('stays out of the way until the attendant asks for it', () => {
    render(<ProductCategoryCreator onCategoryCreated={onCategoryCreated} />)

    expect(
      screen.getByRole('button', { name: productCategoryCreatorMock.openLabel })
    ).toBeInTheDocument()
    expect(
      screen.queryByLabelText(productCategoryCreatorMock.nameLabel)
    ).not.toBeInTheDocument()
  })

  it('creates the category and selects it on the form', async () => {
    createCategory.mockResolvedValue({
      id: productCategoryCreatorMock.createdCategoryId,
    })

    await openCreator()
    await userEvent.click(screen.getByRole('button', { name: 'Criar' }))

    expect(createCategory).toHaveBeenCalledWith(
      productCategoryCreatorMock.typedName
    )
    await waitFor(() =>
      expect(onCategoryCreated).toHaveBeenCalledWith(
        productCategoryCreatorMock.createdCategoryId
      )
    )
    await waitFor(() =>
      expect(
        screen.queryByLabelText(productCategoryCreatorMock.nameLabel)
      ).not.toBeInTheDocument()
    )
  })

  it('keeps the typed name when creation fails', async () => {
    createCategory.mockRejectedValue(new Error('offline'))

    await openCreator()
    await userEvent.click(screen.getByRole('button', { name: 'Criar' }))

    await waitFor(() => expect(onCategoryCreated).not.toHaveBeenCalled())
    expect(
      screen.getByLabelText(productCategoryCreatorMock.nameLabel)
    ).toHaveValue(productCategoryCreatorMock.typedName)
  })

  it('blocks creation with no name typed', async () => {
    render(<ProductCategoryCreator onCategoryCreated={onCategoryCreated} />)
    await userEvent.click(
      screen.getByRole('button', { name: productCategoryCreatorMock.openLabel })
    )

    expect(screen.getByRole('button', { name: 'Criar' })).toBeDisabled()
  })

  it('closes the box without creating anything', async () => {
    await openCreator()
    await userEvent.click(screen.getByRole('button', { name: 'Voltar' }))

    expect(createCategory).not.toHaveBeenCalled()
    expect(
      screen.getByRole('button', { name: productCategoryCreatorMock.openLabel })
    ).toBeInTheDocument()
  })
})
