import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AuthFormPanel } from './AuthFormPanel'

describe('AuthFormPanel', () => {
  it('renders its authentication content', () => {
    render(
      <MemoryRouter>
        <AuthFormPanel>
          <p>Entrar</p>
        </AuthFormPanel>
      </MemoryRouter>
    )

    expect(screen.getByText('Entrar')).toBeInTheDocument()
  })
})
