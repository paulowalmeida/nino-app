import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { LoginFooter } from './LoginFooter'

describe(LoginFooter.name, () => {
  it('offers navigation to account creation', () => {
    render(
      <MemoryRouter>
        <LoginFooter />
      </MemoryRouter>
    )
    expect(screen.getByRole('link', { name: 'Criar conta' })).toHaveAttribute(
      'href',
      '/cadastrar'
    )
  })
})
