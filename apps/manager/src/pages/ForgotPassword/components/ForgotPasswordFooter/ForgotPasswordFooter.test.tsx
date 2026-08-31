import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ForgotPasswordFooter } from './ForgotPasswordFooter'

describe(ForgotPasswordFooter.name, () => {
  it('offers navigation back to login', () => {
    render(
      <MemoryRouter>
        <ForgotPasswordFooter />
      </MemoryRouter>
    )
    expect(screen.getByRole('link', { name: 'Entrar' })).toHaveAttribute(
      'href',
      '/entrar'
    )
  })
})
