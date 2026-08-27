import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StorePreview } from './StorePreview'
import { storePreviewMock } from './StorePreview.mock'

describe(StorePreview.name, () => {
  it('renders the placeholder state', () => {
    const { container } = render(<StorePreview name="" />)

    expect(container).toHaveTextContent('O nome da sua loja')
    expect(container).toHaveTextContent('sua-loja.dev.nino.delivery')
    expect(container.firstElementChild).toHaveAttribute('data-lit', 'false')
  })

  it('renders the typed store name and slug', () => {
    const { container } = render(<StorePreview {...storePreviewMock} />)

    expect(container).toHaveTextContent('Café da Vila')
    expect(container).toHaveTextContent('cafe-da-vila.dev.nino.delivery')
    expect(container.firstElementChild).toHaveAttribute('data-lit', 'true')
  })
})
