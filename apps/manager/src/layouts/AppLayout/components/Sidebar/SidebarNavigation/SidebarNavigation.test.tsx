import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

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
      />
    )

    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
