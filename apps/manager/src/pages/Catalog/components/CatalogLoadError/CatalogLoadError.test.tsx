import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CatalogLoadError } from './CatalogLoadError'
import { catalogLoadErrorMock } from './CatalogLoadError.mock'

describe(CatalogLoadError.name, () => {
  it('explains that the catalog failed to load', () => {
    render(<CatalogLoadError />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      catalogLoadErrorMock.message
    )
  })
})
