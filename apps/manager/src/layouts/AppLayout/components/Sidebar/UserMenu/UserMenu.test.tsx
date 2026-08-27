import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { UserMenu } from './UserMenu'

vi.mock('@shared/hooks/session/useLogout/useLogout', () => ({
  useLogout: () => ({ logout: vi.fn() }),
}))

describe('UserMenu', () => {
  it('shows the signed-in user name', () => {
    render(
      <MemoryRouter>
        <UserMenu name="Marina Silva" tenantId="tenant-1" />
      </MemoryRouter>
    )

    expect(screen.getByText('Marina')).toBeInTheDocument()
  })
})
