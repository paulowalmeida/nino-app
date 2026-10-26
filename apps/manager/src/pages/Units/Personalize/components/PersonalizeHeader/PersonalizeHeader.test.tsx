import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PersonalizeHeader } from './PersonalizeHeader'
import { personalizeHeaderMock } from './PersonalizeHeader.mock'

describe(PersonalizeHeader.name, () => {
  it('names the screen and says when the changes go live', () => {
    render(<PersonalizeHeader />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: personalizeHeaderMock.title,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/nada vai pro ar antes de você publicar/)
    ).toBeInTheDocument()
  })

  it('offers the real storefront without leaving the studio', () => {
    render(<PersonalizeHeader storeUrl={personalizeHeaderMock.storeUrl} />)

    expect(screen.getByRole('link', { name: /Ver na loja/ })).toHaveAttribute(
      'href',
      personalizeHeaderMock.storeUrl
    )
    expect(screen.getByRole('link', { name: /Ver na loja/ })).toHaveAttribute(
      'target',
      '_blank'
    )
  })
})
