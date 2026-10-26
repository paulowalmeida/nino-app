import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { NinoLogo } from './NinoLogo'
import { ninoLogoMock } from './NinoLogo.mock'

describe(NinoLogo.name, () => {
  it('links the manager logo to the requested destination', () => {
    render(
      <MemoryRouter initialEntries={['/settings']}>
        <NinoLogo {...ninoLogoMock} />
      </MemoryRouter>
    )
    expect(screen.getByRole('link', { name: /visão geral/i })).toHaveAttribute(
      'href',
      ninoLogoMock.to
    )
  })
})
