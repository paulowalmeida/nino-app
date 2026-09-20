import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useProductDetailFacade } from '@pages/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'
import { menuItemMock } from '@pages/ProductDetail/hooks/useProductDetail/useProductDetail.mock'
import type { ItemPhotoProps } from '@shared/components/ItemPhoto/ItemPhoto'

import { ProductDetailPhoto } from './ProductDetailPhoto'
import { productDetailPhotoMock } from './ProductDetailPhoto.mock'

vi.mock(
  '@pages/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'
)
vi.mock('@shared/components/ItemPhoto/ItemPhoto', () => ({
  ItemPhoto: ({ name, onUpload, onRemove }: ItemPhotoProps) => (
    <div>
      <span>{name}</span>
      <button
        type="button"
        onClick={() =>
          onUpload?.(new File([''], 'foto.png'), {
            onSuccess: () => {},
            onError: () => {},
          })
        }
      >
        enviar foto
      </button>
      <button type="button" onClick={() => onRemove?.('image-1')}>
        remover foto
      </button>
    </div>
  ),
}))

const uploadImage = vi.fn()
const removeImage = vi.fn()

const mockPhoto = (item: typeof menuItemMock | null) =>
  vi.mocked(useProductDetailFacade).mockReturnValue({
    item,
    uploadImage,
    removeImage,
    isUploadingImage: false,
    isRemovingImage: false,
  } as unknown as ReturnType<typeof useProductDetailFacade>)

describe('ProductDetailPhoto', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPhoto(menuItemMock)
  })

  it('sends the chosen photo to the item being edited', async () => {
    render(<ProductDetailPhoto />)

    await userEvent.click(
      screen.getByRole('button', { name: productDetailPhotoMock.uploadLabel })
    )

    expect(uploadImage).toHaveBeenCalledWith(
      expect.objectContaining({ name: productDetailPhotoMock.fileName }),
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
  })

  it('drops the photo the attendant removed', async () => {
    render(<ProductDetailPhoto />)

    await userEvent.click(
      screen.getByRole('button', { name: productDetailPhotoMock.removeLabel })
    )

    expect(removeImage).toHaveBeenCalledWith(productDetailPhotoMock.imageId)
  })

  it('opens the known fallback photo in the product detail modal', async () => {
    render(<ProductDetailPhoto />)

    await userEvent.click(
      screen.getByRole('button', { name: 'Ampliar foto de X-Tudo' })
    )

    expect(
      screen.getByRole('dialog', { name: 'Prévia da foto de X-Tudo' })
    ).toBeInTheDocument()
  })

  it('renders nothing while there is no item to illustrate', () => {
    mockPhoto(null)

    const { container } = render(<ProductDetailPhoto />)

    expect(container).toBeEmptyDOMElement()
  })
})
