import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { StoreSwitcher } from './StoreSwitcher'

vi.mock('@shared/hooks/session/useCompanyGroups/useCompanyGroups', () => ({
  useCompanyGroups: () => [
    {
      companyId: 'company-1',
      companyName: 'Nino',
      units: [{ unitId: 'unit-1', unitName: 'Loja Centro' }],
    },
  ],
}))

describe('StoreSwitcher', () => {
  it('shows the current store when no switch is needed', () => {
    render(
      <MemoryRouter initialEntries={['/unit-1/pedidos']}>
        <StoreSwitcher currentUnitId="unit-1" />
      </MemoryRouter>
    )

    expect(screen.getByText('Loja Centro')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
