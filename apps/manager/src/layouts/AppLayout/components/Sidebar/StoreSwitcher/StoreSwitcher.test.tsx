import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { StoreSwitcher } from './StoreSwitcher'

vi.mock('@shared/hooks/session/useCompanyGroups/useCompanyGroups', () => ({
  useCompanyGroups: () => [
    {
      companyId: 'company-1',
      companyName: 'Nino',
      units: [{ tenantId: 'tenant-1', tenantName: 'Loja Centro' }],
    },
  ],
}))

describe('StoreSwitcher', () => {
  it('shows the current store when no switch is needed', () => {
    render(
      <MemoryRouter initialEntries={['/tenant-1/pedidos']}>
        <StoreSwitcher currentTenantId="tenant-1" />
      </MemoryRouter>
    )

    expect(screen.getByText('Loja Centro')).toBeInTheDocument()
  })

  it('keeps the current store represented when collapsed', () => {
    render(
      <MemoryRouter initialEntries={['/tenant-1/pedidos']}>
        <StoreSwitcher currentTenantId="tenant-1" collapsed />
      </MemoryRouter>
    )

    expect(screen.getByLabelText('Unidade: Loja Centro')).toBeInTheDocument()
  })
})
