import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AppLayout } from './AppLayout'

vi.mock('@shared/hooks/session/useCurrentTenant/useCurrentTenant', () => ({
  useCurrentTenant: () => ({ tenantName: 'Loja Centro', tenantId: 'tenant-1' }),
}))
vi.mock('./components/Sidebar/Sidebar', () => ({ Sidebar: () => <aside /> }))

describe('AppLayout', () => {
  it('renders the application shell and active route outlet', () => {
    render(
      <MemoryRouter>
        <AppLayout />
      </MemoryRouter>
    )

    expect(screen.getByText('Loja Centro')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
