import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { AppLayout } from './AppLayout'

vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit', () => ({
  useCurrentUnit: () => ({
    unitName: 'Loja Centro',
    unitId: 'unit-1',
    role: 'STAFF',
    permissions: [],
  }),
}))
vi.mock('@shared/hooks/session/useCompanyGroups/useCompanyGroups', () => ({
  useCompanyGroups: () => [
    {
      companyId: 'company-1',
      companyName: 'Nino',
      units: [{ unitId: 'unit-1', unitName: 'Loja Centro' }],
    },
  ],
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

  it('collapses the sidebar from its edge and from the keyboard', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <AppLayout />
      </MemoryRouter>
    )

    const tab = screen.getByRole('button', { name: /(Recolher|Expandir) menu/ })
    const before = tab.getAttribute('aria-expanded')

    await user.click(tab)
    expect(tab.getAttribute('aria-expanded')).not.toBe(before)

    await user.keyboard('{Control>}b{/Control}')
    expect(tab.getAttribute('aria-expanded')).toBe(before)
  })
})
