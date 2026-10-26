import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { BrandAssets } from './BrandAssets'
import { brandAssetsMock, emptyBrandAssetsMock } from './BrandAssets.mock'

const croppedFile = new File(['art'], 'marca.png', { type: 'image/png' })

vi.mock('./BrandAssetSlot/BrandAssetSlot', () => ({
  BrandAssetSlot: ({
    label,
    triggerLabel,
    hasAsset,
    onRemove,
    onCropped,
  }: {
    label: string
    triggerLabel: string
    hasAsset?: boolean
    onRemove?: () => void
    onCropped: (file: File) => void
  }) => (
    <>
      <button onClick={() => onCropped(croppedFile)}>
        {label}: {triggerLabel}
      </button>
      {hasAsset && onRemove && (
        <button onClick={onRemove}>Remover {label.toLowerCase()}</button>
      )}
    </>
  ),
}))

describe(BrandAssets.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('invites the first upload when the store has no images yet', () => {
    render(<BrandAssets {...emptyBrandAssetsMock} onChange={vi.fn()} />)

    expect(
      screen.getByRole('button', { name: 'Logo: Escolher logo' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Banner: Escolher banner' })
    ).toBeInTheDocument()
  })

  it('offers a replacement once the images are already published', () => {
    render(<BrandAssets {...brandAssetsMock} onChange={vi.fn()} />)

    expect(
      screen.getByRole('button', { name: 'Logo: Trocar logo' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Banner: Trocar banner' })
    ).toBeInTheDocument()
  })

  it('files the cropped logo under the logo of the draft', async () => {
    const onChange = vi.fn()
    render(<BrandAssets {...emptyBrandAssetsMock} onChange={onChange} />)

    await userEvent.click(
      screen.getByRole('button', { name: 'Logo: Escolher logo' })
    )

    expect(onChange).toHaveBeenCalledWith({ logoFile: croppedFile })
  })

  it('files the cropped banner under the banner of the draft', async () => {
    const onChange = vi.fn()
    render(<BrandAssets {...emptyBrandAssetsMock} onChange={onChange} />)

    await userEvent.click(
      screen.getByRole('button', { name: 'Banner: Escolher banner' })
    )

    expect(onChange).toHaveBeenCalledWith({ bannerFile: croppedFile })
  })

  it('removes an existing logo from the draft', async () => {
    const onChange = vi.fn()
    render(<BrandAssets {...brandAssetsMock} onChange={onChange} />)

    await userEvent.click(screen.getByRole('button', { name: 'Remover logo' }))

    expect(onChange).toHaveBeenCalledWith({
      logoFile: undefined,
      logoUrl: null,
    })
  })
})
