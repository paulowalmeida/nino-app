import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { BrandAssetSlot } from './BrandAssetSlot'
import { brandAssetSlotMock } from './BrandAssetSlot.mock'

describe(BrandAssetSlot.name, () => {
  it('starts on the dropzone, with no cropper in the way', () => {
    render(<BrandAssetSlot {...brandAssetSlotMock} onCropped={vi.fn()} />)

    expect(screen.getByText('Escolher banner')).toBeInTheDocument()
    expect(screen.queryByText('Aproximar')).toBeNull()
  })

  it('names the field and what the file has to be', () => {
    render(<BrandAssetSlot {...brandAssetSlotMock} onCropped={vi.fn()} />)

    expect(screen.getByText('Banner')).toBeInTheDocument()
    expect(screen.getByText(brandAssetSlotMock.helperText)).toBeInTheDocument()
  })
})
