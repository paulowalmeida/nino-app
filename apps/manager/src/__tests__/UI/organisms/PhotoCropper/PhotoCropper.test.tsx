import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { cropToSquare } from '@utils/crop-image'

import { PhotoCropper } from '@organisms/PhotoCropper/PhotoCropper'

import { croppedFile, photoFile } from './PhotoCropper.mock'

vi.mock('@utils/crop-image')

beforeEach(() => {
  URL.createObjectURL = vi.fn().mockReturnValue('blob:preview')
  URL.revokeObjectURL = vi.fn()
})

const renderCropper = (
  props: Partial<React.ComponentProps<typeof PhotoCropper>> = {}
) =>
  render(
    <PhotoCropper
      file={photoFile}
      isSending={false}
      onConfirm={vi.fn()}
      onCancel={vi.fn()}
      onRemove={vi.fn()}
      {...props}
    />
  )

describe(PhotoCropper.name, () => {
  it('shows the chosen photo inside the crop frame', () => {
    // Arrange / Act
    renderCropper()

    // Assert
    expect(screen.getByAltText('Enquadramento da foto')).toHaveAttribute(
      'src',
      'blob:preview'
    )
  })

  it('confirms with the cropped file once the crop resolves', async () => {
    // Arrange
    vi.mocked(cropToSquare).mockResolvedValue(croppedFile)
    const onConfirm = vi.fn()
    renderCropper({ onConfirm })

    // Act
    await userEvent.click(
      screen.getByRole('button', { name: 'Usar esta foto' })
    )

    // Assert
    expect(onConfirm).toHaveBeenCalledWith(croppedFile)
  })

  it('releases the preview url once confirmed', async () => {
    // Arrange
    vi.mocked(cropToSquare).mockResolvedValue(croppedFile)
    renderCropper()

    // Act
    await userEvent.click(
      screen.getByRole('button', { name: 'Usar esta foto' })
    )

    // Assert
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:preview')
  })

  it('cancels back to picking another photo', async () => {
    // Arrange
    const onCancel = vi.fn()
    renderCropper({ onCancel })

    // Act
    await userEvent.click(
      screen.getByRole('button', { name: 'Escolher outra' })
    )

    // Assert
    expect(onCancel).toHaveBeenCalled()
  })

  it('removes the photo when asked', async () => {
    // Arrange
    const onRemove = vi.fn()
    renderCropper({ onRemove })

    // Act
    await userEvent.click(
      screen.getByRole('button', { name: 'Remover foto' })
    )

    // Assert
    expect(onRemove).toHaveBeenCalled()
  })

  it('disables the secondary actions while sending', () => {
    // Arrange / Act
    renderCropper({ isSending: true })

    // Assert
    expect(screen.getByRole('button', { name: 'Escolher outra' }))
      .toBeDisabled()
    expect(screen.getByRole('button', { name: 'Remover foto' }))
      .toBeDisabled()
  })
})
