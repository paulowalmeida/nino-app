import { fireEvent, render, screen } from '@testing-library/react'
import { StrictMode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PhotoCropper } from './PhotoCropper'
import {
  bannerCropperMock,
  loadedImageSizeMock,
  photoCropperMock,
} from './PhotoCropper.mock'

vi.mock('@shared/utils/crop-image/crop-image', () => ({
  cropToArea: vi.fn(),
}))

const loadImage = () => {
  const image = screen.getByAltText('Imagem a recortar')
  Object.defineProperty(image, 'naturalWidth', {
    value: loadedImageSizeMock.naturalWidth,
  })
  Object.defineProperty(image, 'naturalHeight', {
    value: loadedImageSizeMock.naturalHeight,
  })
  fireEvent.load(image)
}

describe(PhotoCropper.name, () => {
  beforeEach(() => {
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL: vi.fn(() => 'blob:dish'),
      revokeObjectURL: vi.fn(),
    })
  })

  it('explains the gesture and lets the person back out', () => {
    const onCancel = vi.fn()

    render(
      <PhotoCropper
        {...photoCropperMock}
        onConfirm={vi.fn()}
        onCancel={onCancel}
        onRemove={vi.fn()}
      />
    )

    expect(screen.getByText(/Arraste a área/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Escolher outra' }))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('opens the biggest centered selection once the image is measured', () => {
    render(
      <PhotoCropper
        {...photoCropperMock}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    )

    expect(screen.queryByRole('group')).toBeNull()

    loadImage()

    // 2:1 image, square crop: half the width, centered.
    expect(screen.getByRole('group')).toHaveStyle({
      left: '25%',
      width: '50%',
      height: '100%',
    })
  })

  it('moves the selection with the arrow keys', () => {
    render(
      <PhotoCropper
        {...photoCropperMock}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    )
    loadImage()

    fireEvent.keyDown(screen.getByRole('group'), { key: 'ArrowRight' })

    expect(screen.getByRole('group')).toHaveStyle({ left: '27%' })
  })

  it('keeps the caller framing ratio when it asks for a wide crop', () => {
    render(
      <PhotoCropper
        {...bannerCropperMock}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    )
    loadImage()

    // 2:1 image, 3:1 crop: full width, two thirds of the height.
    expect(screen.getByRole('group')).toHaveStyle({
      width: '100%',
      height: `${(2 / 3) * 100}%`,
    })
  })

  it('hides removal when the caller has nothing to remove', () => {
    render(
      <PhotoCropper
        {...bannerCropperMock}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    )

    expect(screen.queryByRole('button', { name: 'Remover foto' })).toBeNull()
  })

  it('keeps the active object URL alive in StrictMode', () => {
    let sequence = 0
    const createObjectURL = vi.fn(() => `blob:dish-${++sequence}`)
    const revokeObjectURL = vi.fn()

    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL,
      revokeObjectURL,
    })

    render(
      <StrictMode>
        <PhotoCropper
          {...photoCropperMock}
          onConfirm={vi.fn()}
          onCancel={vi.fn()}
        />
      </StrictMode>
    )

    const image = screen.getByAltText('Imagem a recortar')
    const activeSource = image.getAttribute('src')

    expect(activeSource).toBe('blob:dish-2')
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:dish-1')
    expect(revokeObjectURL).not.toHaveBeenCalledWith(activeSource)
  })
})
