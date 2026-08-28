import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StorePreview } from './StorePreview'
import { storePreviewMock } from './StorePreview.mock'

describe(StorePreview.name, () => {
  it('shows the store identity and a representative menu', () => {
    render(
      <StorePreview {...storePreviewMock} />
    )

    expect(
      screen.getByRole('region', { name: 'Prévia da loja para o cliente' })
    ).toBeInTheDocument()
    expect(screen.getByText('Unidade Centro')).toBeInTheDocument()
    expect(screen.getByText('Especial da casa')).toBeInTheDocument()
  })
})
