import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SidebarNavigation } from './SidebarNavigation'

describe('SidebarNavigation', () => {
  it('renders the navigation landmark', () => {
    render(
      <SidebarNavigation
        groups={[]}
        tenantId={null}
        isCollapsed={false}
        waiting={0}
        openSection={null}
        onOpenSectionChange={() => undefined}
        isInside={() => false}
        onNavigate={() => undefined}
        onExpand={() => undefined}
      />
    )

    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('expands the sidebar before opening a collapsed group', async () => {
    const onExpand = vi.fn()
    const onOpenSectionChange = vi.fn()

    render(
      <MemoryRouter>
        <SidebarNavigation
          groups={[
            {
              title: 'Gestão',
              items: [
                {
                  section: 'configuracoes',
                  label: 'Configurações',
                  icon: 'settings',
                  children: [
                    {
                      to: 'empresa',
                      label: 'Empresa',
                      icon: 'building',
                    },
                  ],
                },
              ],
            },
          ]}
          tenantId="tenant-1"
          isCollapsed
          waiting={0}
          openSection={null}
          onOpenSectionChange={onOpenSectionChange}
          isInside={() => false}
          onNavigate={() => undefined}
          onExpand={onExpand}
        />
      </MemoryRouter>
    )

    await userEvent.click(screen.getByRole('button', { name: /Configurações/ }))

    expect(onExpand).toHaveBeenCalledOnce()
    expect(onOpenSectionChange).toHaveBeenCalledWith('configuracoes')
  })
})
