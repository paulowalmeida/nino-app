import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StorefrontPreview } from './StorefrontPreview'
import { storefrontPreviewMock } from './StorefrontPreview.mock'

describe(StorefrontPreview.name, () => {
  it('shows the store identity and a representative menu', () => {
    render(
      <StorefrontPreview {...storefrontPreviewMock} />
    )

    expect(
      screen.getByRole('region', { name: 'Prévia da loja para o cliente' })
    ).toBeInTheDocument()
    expect(screen.getByText('Unidade Centro')).toBeInTheDocument()
    expect(screen.getByText('Especial da casa')).toBeInTheDocument()
  })

  it('falls back to a placeholder name while the unit has none', () => {
    render(
      <StorefrontPreview
        {...storefrontPreviewMock}
        storeName="  "
      />
    )

    expect(screen.getByText('Nome da unidade')).toBeInTheDocument()
  })


})
