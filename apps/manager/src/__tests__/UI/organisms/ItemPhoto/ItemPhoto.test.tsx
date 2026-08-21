import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ItemPhoto } from '@organisms/ItemPhoto/ItemPhoto'

import { coverImage } from './ItemPhoto.mock'

const uploadImage = vi.fn()
const removeImage = vi.fn()

/* The cropper has its own confirm/cancel/remove flow — what's under test
 * here is who calls it and what ItemPhoto does with the result. */
vi.mock('@organisms/PhotoCropper/PhotoCropper', () => ({
  PhotoCropper: ({
    onConfirm,
    onCancel,
    onRemove,
  }: {
    onConfirm: (file: File) => void
    onCancel: () => void
    onRemove: () => void
  }) => (
    <div>
      <button onClick={() => onConfirm(new File(['x'], 'edited.png'))}>
        confirmar corte
      </button>
      <button onClick={onCancel}>cancelar corte</button>
      <button onClick={onRemove}>remover no cropper</button>
    </div>
  ),
}))

const image = new File(['x'.repeat(10)], 'photo.png', { type: 'image/png' })
const oversizedImage = new File(['x'.repeat(5 * 1024 * 1024)], 'big.png', {
  type: 'image/png',
})

const fileInput = () =>
  document.querySelector('input[type="file"]') as HTMLInputElement

describe(ItemPhoto.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows the drop hint with no existing photo', () => {
    // Arrange / Act
    render(
      <ItemPhoto
        productId="p1"
        name="Pizza"
        images={[]}
        onUpload={uploadImage}
      />
    )

    // Assert
    expect(screen.getByText('Arraste uma foto aqui')).toBeInTheDocument()
  })

  it('shows the primary image when the item already has photos', () => {
    // Arrange / Act
    render(
      <ItemPhoto
        productId="p1"
        name="Pizza"
        images={[coverImage]}
        onRemove={removeImage}
      />
    )

    // Assert
    expect(screen.getByAltText('Pizza')).toHaveAttribute('src', coverImage.url)
  })

  it('opens the cropper for a file under the size limit', async () => {
    // Arrange
    render(<ItemPhoto productId="p1" name="Pizza" images={[]} />)

    // Act
    await userEvent.upload(fileInput(), image)

    // Assert
    expect(screen.getByText('confirmar corte')).toBeInTheDocument()
  })

  it('rejects a file over 4 MB without opening the cropper', async () => {
    // Arrange
    render(<ItemPhoto productId="p1" name="Pizza" images={[]} />)

    // Act
    await userEvent.upload(fileInput(), oversizedImage)

    // Assert
    expect(
      screen.getByText('A imagem precisa ter no máximo 4 MB')
    ).toBeInTheDocument()
    expect(screen.queryByText('confirmar corte')).not.toBeInTheDocument()
  })

  it('uploads the cropped file when a product already exists', async () => {
    // Arrange
    render(<ItemPhoto productId="p1" name="Pizza" images={[]} onUpload={uploadImage} />)
    await userEvent.upload(fileInput(), image)

    // Act
    await userEvent.click(screen.getByText('confirmar corte'))

    // Assert
    expect(uploadImage).toHaveBeenCalledWith(
      expect.any(File),
      expect.any(Object)
    )
  })

  it('stages the file and reports it up with no product yet', async () => {
    // Arrange
    const onStagedFile = vi.fn()
    render(
      <ItemPhoto
        productId={null}
        name="Pizza"
        images={[]}
        onStagedFile={onStagedFile}
      />
    )
    await userEvent.upload(fileInput(), image)

    // Act
    await userEvent.click(screen.getByText('confirmar corte'))

    // Assert
    expect(uploadImage).not.toHaveBeenCalled()
    expect(onStagedFile).toHaveBeenCalledWith(expect.any(File))
  })

  it('removes the existing cover photo', async () => {
    // Arrange
    render(
      <ItemPhoto
        productId="p1"
        name="Pizza"
        images={[coverImage]}
        onRemove={removeImage}
      />
    )

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Remover' }))

    // Assert
    expect(removeImage).toHaveBeenCalledWith(coverImage.id)
  })
})
