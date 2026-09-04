import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { BrandAssets } from './BrandAssets'
import { brandAssetsMock, emptyBrandAssetsMock } from './BrandAssets.mock'

describe(BrandAssets.name, () => {
  it('invites the first upload when the store has no images yet', () => {
    render(<BrandAssets {...emptyBrandAssetsMock} onChange={vi.fn()} />)

    expect(screen.getByText('Escolher logo')).toBeInTheDocument()
    expect(screen.getByText('Escolher banner')).toBeInTheDocument()
  })

  it('offers a replacement once the images are already published', () => {
    render(<BrandAssets {...brandAssetsMock} onChange={vi.fn()} />)

    expect(screen.getByText('Trocar logo')).toBeInTheDocument()
    expect(screen.getByText('Trocar banner')).toBeInTheDocument()
  })
})
