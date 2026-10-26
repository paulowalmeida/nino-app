import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { UnitsHeader } from './UnitsHeader'

vi.mock('@pages/Units/facades/useUnitsFacade/useUnitsFacade', () => ({
  useUnitsFacade: () => ({ user: { name: 'Marina Silva' } }),
}))

describe(UnitsHeader.name, () => {
  it('renders the personalized onboarding heading and guide link', () => {
    render(
      <MemoryRouter>
        <UnitsHeader />
      </MemoryRouter>
    )
    expect(
      screen.getByRole('heading', { name: 'Sua primeira loja, Marina' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Ver como funciona' })
    ).toHaveAttribute('href', '/boas-vindas')
  })
})
