import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AuthLayout } from './AuthLayout'

describe('AuthLayout', () => {
  it('renders the authentication route outlet', () => {
    render(
      <MemoryRouter>
        <AuthLayout />
      </MemoryRouter>
    )

    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
