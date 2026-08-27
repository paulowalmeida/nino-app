import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PhotoCropper } from './PhotoCropper'
import { photoCropperMock } from './PhotoCropper.mock'

vi.mock('@shared/utils/crop-image/crop-image', () => ({
  cropToSquare: vi.fn(),
}))

describe(PhotoCropper.name, () => {
  beforeEach(() => {
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL: vi.fn(() => 'blob:dish'),
      revokeObjectURL: vi.fn(),
    })
  })

  it('renders crop controls and cancellation action', () => {
    const onCancel = vi.fn()

    render(
      <PhotoCropper
        {...photoCropperMock}
        onConfirm={vi.fn()}
        onCancel={onCancel}
        onRemove={vi.fn()}
      />
    )

    expect(screen.getByText('Aproximar')).toBeInTheDocument()
    screen.getByRole('button', { name: 'Escolher outra' }).click()
    expect(onCancel).toHaveBeenCalledOnce()
  })
})
