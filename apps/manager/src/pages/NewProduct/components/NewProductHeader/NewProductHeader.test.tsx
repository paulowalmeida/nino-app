import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { NewProductHeader } from '@pages/NewProduct/components/NewProductHeader/NewProductHeader'

import { newProductHeaderMock } from './NewProductHeader.mock'

describe(NewProductHeader.name, () => {
  it('presents navigation and the screen guidance', () => {
    render(
      <MemoryRouter>
        <NewProductHeader />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('link', { name: newProductHeaderMock.backLinkLabel })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: newProductHeaderMock.title })
    ).toBeInTheDocument()
  })
})
