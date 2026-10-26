import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AuthBrandPanel } from './AuthBrandPanel'

describe('AuthBrandPanel', () => {
  it('renders the brand message', () => {
    render(
      <MemoryRouter>
        <AuthBrandPanel />
      </MemoryRouter>
    )

    expect(screen.getByText('Gerencie sua loja,')).toBeInTheDocument()
  })
})
