import { StrictMode } from 'react'

import { fireEvent, render, screen } from '@testing-library/react'
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

  it('fills a fixed crop frame with the measured image', () => {
    render(
      <PhotoCropper
        {...photoCropperMock}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    )

    expect(screen.queryByRole('group')).toBeNull()

    loadImage()

    // 2:1 image, square crop: the image fills the fixed frame by width.
    expect(screen.getByRole('group')).toHaveStyle({
      left: '0px',
      width: '100%',
      height: '100%',
    })
    expect(screen.getByAltText('Imagem a recortar')).toHaveStyle({
      left: '-50%',
      width: '200%',
      height: '100%',
    })
  })

  it('moves the image with the arrow keys', () => {
    render(
      <PhotoCropper
        {...photoCropperMock}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    )
    loadImage()

    fireEvent.keyDown(screen.getByRole('group'), { key: 'ArrowRight' })

    expect(screen.getByAltText('Imagem a recortar')).toHaveStyle({
      left: '-48%',
    })
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

    // 2:1 image, 3:1 crop: the viewport stays fixed while the image fills it.
    expect(screen.getByRole('group')).toHaveStyle({
      width: '100%',
      height: '100%',
    })
    expect(screen.getByAltText('Imagem a recortar')).toHaveStyle({
      width: '100%',
      height: '150%',
    })
  })

  it('visibly enlarges the image when zoom increases', () => {
    render(
      <PhotoCropper
        {...photoCropperMock}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    )
    loadImage()

    fireEvent.click(screen.getByRole('button', { name: 'Aumentar zoom' }))

    expect(screen.getByAltText('Imagem a recortar')).toHaveStyle({
      width: '220%',
      maxWidth: 'none',
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
