import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { LoginHeader } from './LoginHeader'

describe(LoginHeader.name, () => {
  it('presents the welcome heading', () => {
    render(<LoginHeader />)
    expect(
      screen.getByRole('heading', { name: 'Bem-vindo' })
    ).toBeInTheDocument()
  })
})
