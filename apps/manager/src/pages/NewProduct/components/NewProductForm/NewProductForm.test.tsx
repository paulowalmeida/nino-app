import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useNewProductFacade } from '@pages/NewProduct/facades/useNewProductFacade/useNewProductFacade'

import { NewProductForm } from './NewProductForm'
import { categoryOptionsMock, newProductFormMock } from './NewProductForm.mock'

vi.mock('@pages/NewProduct/facades/useNewProductFacade/useNewProductFacade')
vi.mock('@shared/components/ItemPhoto/ItemPhoto', () => ({
  ItemPhoto: ({
    name,
    onStagedFile,
  }: {
    name: string
    onStagedFile: (file: File | null) => void
  }) => (
    <button type="button" onClick={() => onStagedFile(new File([''], 'p.png'))}>
      photo of {name}
    </button>
  ),
}))
vi.mock('@nino/ds/components/Select', () => ({
  Select: ({
    options,
    value,
    onValueChange,
  }: {
    options: { value: string; label: string }[]
    value: string
    onValueChange: (value: string) => void
  }) => (
    <select
      aria-label="Categoria escolhida"
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
    >
      <option value="">Escolha uma</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}))
vi.mock(
  '@pages/NewProduct/components/NewProductForm/ProductCategoryCreator/ProductCategoryCreator',
  () => ({
    ProductCategoryCreator: ({
      onCategoryCreated,
    }: {
      onCategoryCreated: (categoryId: string) => void
    }) => (
      <button type="button" onClick={() => onCategoryCreated('category-2')}>
        create category
      </button>
    ),
  })
)

const submitProduct = vi.fn()
const cancel = vi.fn()

const fillRequiredFields = async () => {
  await userEvent.type(
    screen.getByLabelText(newProductFormMock.nameLabel),
    newProductFormMock.typedName
  )
  await userEvent.type(
    screen.getByLabelText('Preço'),
    newProductFormMock.typedPrice
  )
  await userEvent.selectOptions(
    screen.getByLabelText('Categoria escolhida'),
    'category-1'
  )
}

describe('NewProductForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    submitProduct.mockResolvedValue(true)
    vi.mocked(useNewProductFacade).mockReturnValue({
      categoryOptions: categoryOptionsMock,
      submitProduct,
      cancel,
    } as unknown as ReturnType<typeof useNewProductFacade>)
  })

  it('sends the filled item with its staged photo', async () => {
    render(<NewProductForm />)

    await fillRequiredFields()
    await userEvent.click(screen.getByRole('button', { name: /photo of/ }))
    await userEvent.click(
      screen.getByRole('button', { name: newProductFormMock.submitLabel })
    )

    await waitFor(() =>
      expect(submitProduct).toHaveBeenCalledWith(
        {
          name: newProductFormMock.typedName,
          description: '',
          price: newProductFormMock.typedPrice,
          categoryId: 'category-1',
          requiresPreparation: true,
        },
        expect.any(File)
      )
    )
  })

  it('demands name, price, and category before sending', async () => {
    render(<NewProductForm />)

    await userEvent.click(
      screen.getByRole('button', { name: newProductFormMock.submitLabel })
    )

    expect(await screen.findByText('Informe o nome')).toBeInTheDocument()
    expect(screen.getByText('Informe o preço')).toBeInTheDocument()
    expect(screen.getByText('Escolha a categoria')).toBeInTheDocument()
    expect(submitProduct).not.toHaveBeenCalled()
  })

  it('refuses a price that is not worth charging', async () => {
    render(<NewProductForm />)

    await userEvent.type(
      screen.getByLabelText(newProductFormMock.nameLabel),
      newProductFormMock.typedName
    )
    await userEvent.type(screen.getByLabelText('Preço'), '0,00')
    await userEvent.selectOptions(
      screen.getByLabelText('Categoria escolhida'),
      'category-1'
    )
    await userEvent.click(
      screen.getByRole('button', { name: newProductFormMock.submitLabel })
    )

    expect(
      await screen.findByText('O preço precisa ser maior que zero')
    ).toBeInTheDocument()
  })

  it('reports a rejected registration on the form itself', async () => {
    submitProduct.mockResolvedValue(false)
    render(<NewProductForm />)

    await fillRequiredFields()
    await userEvent.click(
      screen.getByRole('button', { name: newProductFormMock.submitLabel })
    )

    expect(
      await screen.findByText(newProductFormMock.submitError)
    ).toBeInTheDocument()
  })

  it('selects the category the attendant just created', async () => {
    render(<NewProductForm />)

    await userEvent.click(
      screen.getByRole('button', { name: 'create category' })
    )

    expect(screen.getByLabelText('Categoria escolhida')).toHaveValue(
      'category-2'
    )
  })

  it('names the photo frame after the item being registered', async () => {
    render(<NewProductForm />)

    expect(
      screen.getByRole('button', { name: 'photo of Novo item' })
    ).toBeInTheDocument()

    await userEvent.type(
      screen.getByLabelText(newProductFormMock.nameLabel),
      newProductFormMock.typedName
    )

    expect(
      screen.getByRole('button', {
        name: `photo of ${newProductFormMock.typedName}`,
      })
    ).toBeInTheDocument()
  })

  it('counts the description against its limit', async () => {
    render(<NewProductForm />)

    await userEvent.type(screen.getByLabelText('Descrição'), 'Com tudo')

    expect(screen.getByText(/8\/300/)).toBeInTheDocument()
  })

  it('gives up the registration from the cancel button', async () => {
    render(<NewProductForm />)

    await userEvent.click(
      screen.getByRole('button', { name: newProductFormMock.cancelLabel })
    )

    expect(cancel).toHaveBeenCalledOnce()
  })
})
