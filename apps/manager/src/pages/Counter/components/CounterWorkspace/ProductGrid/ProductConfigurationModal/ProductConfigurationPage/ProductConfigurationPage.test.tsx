import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ProductConfigurationPage } from './ProductConfigurationPage'
import { productConfigurationPageMock } from './ProductConfigurationPage.mock'

describe(ProductConfigurationPage.name, () => {
  it('renders the product page composition and disabled action', () => {
    render(
      <ProductConfigurationPage
        {...productConfigurationPageMock}
        onBack={vi.fn()}
        selectedCount={() => 0}
        onSelectSingle={vi.fn()}
        onToggleOption={vi.fn()}
        actions={<button disabled>Adicionar</button>}
      />
    )

    expect(
      screen.getByRole('heading', { name: 'X-Salada' })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Adicionar/ })).toBeDisabled()
  })
})
