import { MemoryRouter, Route, Routes } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { useCurrentTenant } from '@hooks/session/useCurrentTenant'

import { AppLayout } from '@layouts/AppLayout/AppLayout'

import { activeTenant } from './AppLayout.mock'

vi.mock('@compositions/Sidebar/Sidebar', () => ({
  Sidebar: ({ isOpen }: { isOpen: boolean }) => (
    <div data-testid="sidebar" data-open={isOpen} />
  ),
}))
vi.mock('@hooks/session/useCurrentTenant')

const mockTenant = (
  tenant: ReturnType<typeof useCurrentTenant> = null
) => vi.mocked(useCurrentTenant).mockReturnValue(tenant)

const renderLayout = () =>
  render(
    <MemoryRouter initialEntries={['/tenant-1/visao-geral']}>
      <Routes>
        <Route path="/:tenantId/*" element={<AppLayout />}>
          <Route path="visao-geral" element={<div>Conteúdo</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  )

describe(AppLayout.name, () => {
  it('shows the active tenant name in the mobile topbar', () => {
    // Arrange
    mockTenant(activeTenant as ReturnType<typeof useCurrentTenant>)

    // Act
    renderLayout()

    // Assert
    expect(screen.getByText('Padaria Boa')).toBeInTheDocument()
  })

  it('renders no tenant name when none is resolved yet', () => {
    // Arrange
    mockTenant(null)

    // Act
    renderLayout()

    // Assert
    expect(screen.getByTestId('sidebar')).toHaveAttribute('data-open', 'false')
  })

  it('opens the sidebar when the hamburger button is clicked', async () => {
    // Arrange
    mockTenant(activeTenant as ReturnType<typeof useCurrentTenant>)
    renderLayout()

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Abrir menu' }))

    // Assert
    expect(screen.getByTestId('sidebar')).toHaveAttribute('data-open', 'true')
  })

  it('renders the routed page content through the outlet', () => {
    // Arrange
    mockTenant(activeTenant as ReturnType<typeof useCurrentTenant>)

    // Act
    renderLayout()

    // Assert
    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
  })

  it('closes the sidebar when Escape is pressed', async () => {
    // Arrange
    mockTenant(activeTenant as ReturnType<typeof useCurrentTenant>)
    renderLayout()
    await userEvent.click(screen.getByRole('button', { name: 'Abrir menu' }))

    // Act
    await userEvent.keyboard('{Escape}')

    // Assert
    expect(screen.getByTestId('sidebar')).toHaveAttribute('data-open', 'false')
  })
})
