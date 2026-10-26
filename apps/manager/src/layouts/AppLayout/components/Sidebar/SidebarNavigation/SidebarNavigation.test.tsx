import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SidebarNavigation } from './SidebarNavigation'
import {
  settingsGroupMock,
  sidebarNavigationMock,
} from './SidebarNavigation.mock'

describe('SidebarNavigation', () => {
  it('renders the navigation landmark', () => {
    render(
      <SidebarNavigation
        {...sidebarNavigationMock}
        onNavigate={() => undefined}
      />
    )

    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('links every settings section straight from the menu', () => {
    render(
      <MemoryRouter>
        <SidebarNavigation
          {...sidebarNavigationMock}
          groups={settingsGroupMock}
          unitId="unit-1"
          onNavigate={() => undefined}
        />
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: /Empresa/ })).toHaveAttribute(
      'href',
      '/unit-1/configuracoes/empresa'
    )
    expect(screen.getByRole('link', { name: /Entrega/ })).toHaveAttribute(
      'href',
      '/unit-1/configuracoes/entrega'
    )
    expect(screen.getByText('Configurações')).toBeInTheDocument()
  })
})
