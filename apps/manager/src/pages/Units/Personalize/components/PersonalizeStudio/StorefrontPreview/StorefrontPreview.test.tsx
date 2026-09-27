import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StorefrontPreview } from './StorefrontPreview'
import { storefrontPreviewMock } from './StorefrontPreview.mock'
import styles from './StorefrontPreview.module.css'

describe(StorefrontPreview.name, () => {
  it('shows the store identity and a representative menu', () => {
    render(<StorefrontPreview {...storefrontPreviewMock} />)

    expect(
      screen.getByRole('region', { name: 'Prévia da loja para o cliente' })
    ).toBeInTheDocument()
    expect(screen.getByText('Unidade Centro')).toBeInTheDocument()
    expect(screen.getByText('Especial da casa')).toBeInTheDocument()
    expect(screen.queryByText('CARDÁPIO')).not.toBeInTheDocument()
  })

  it('falls back to a placeholder name while the unit has none', () => {
    render(<StorefrontPreview {...storefrontPreviewMock} storeName="  " />)

    expect(screen.getByText('Nome da unidade')).toBeInTheDocument()
  })

  it('uses the API fallback photos instead of emoji placeholders', () => {
    const { container } = render(
      <StorefrontPreview {...storefrontPreviewMock} />
    )

    expect(
      container.querySelector('img[src*="/product-presets/x-salada.png"]')
    ).toBeInTheDocument()
    expect(screen.queryByText('🍔')).not.toBeInTheDocument()
    expect(screen.queryByText('🥓')).not.toBeInTheDocument()
    expect(screen.queryByText('🍳')).not.toBeInTheDocument()
  })

  it('does not place a watermark over a custom banner', () => {
    const { container } = render(
      <StorefrontPreview
        {...storefrontPreviewMock}
        bannerUrl="https://cdn.example/banner.png"
        logoUrl="https://cdn.example/logo.png"
      />
    )

    expect(
      container.querySelector(`.${styles.bannerMark}`)
    ).not.toBeInTheDocument()
    expect(
      container.querySelector(`.${styles.bannerMonogram}`)
    ).not.toBeInTheDocument()
  })
})
