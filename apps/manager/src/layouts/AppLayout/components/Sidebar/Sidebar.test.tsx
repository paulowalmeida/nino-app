import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Sidebar } from './Sidebar'

vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit', () => ({
  useCurrentUnit: () => ({ unitId: 'unit-1' }),
}))
vi.mock('@shared/hooks/order/useQueueSummary/useQueueSummary', () => ({
  useQueueSummary: () => ({ data: { PENDING: 2 } }),
}))
vi.mock('@layouts/AppLayout/hooks/useSidemenu/useSidemenu', () => ({
  useSidemenu: () => ({ groups: [] }),
}))
vi.mock('./SidebarNavigation/SidebarNavigation', () => ({
  SidebarNavigation: () => <nav />,
}))

describe('Sidebar', () => {
  it('renders the sidebar landmark', () => {
    render(
      <MemoryRouter>
        <Sidebar
          isOpen={false}
          onClose={() => undefined}
          collapsed={false}
        />
      </MemoryRouter>
    )
    expect(screen.getByRole('complementary')).toBeInTheDocument()
  })
})
