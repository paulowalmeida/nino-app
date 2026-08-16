import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SidebarNavLabel } from '@atoms/SidebarNavLabel/SidebarNavLabel'

describe(SidebarNavLabel.name, () => {
  it('shows the label text', () => {
    // Arrange / Act
    render(
      <SidebarNavLabel
        icon="store"
        label="Visão geral"
        size="md"
        isActive={false}
        isCollapsed={false}
        inactiveColor="text-fg-on-brand/45"
      />
    )

    // Assert
    expect(screen.getByText('Visão geral')).toBeInTheDocument()
  })

  it('shows the tally when it is greater than zero', () => {
    // Arrange / Act
    render(
      <SidebarNavLabel
        icon="bag"
        label="Pedidos"
        size="md"
        isActive={false}
        isCollapsed={false}
        inactiveColor="text-fg-on-brand/45"
        tally={3}
      />
    )

    // Assert
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('hides the tally when it is zero', () => {
    // Arrange / Act
    render(
      <SidebarNavLabel
        icon="bag"
        label="Pedidos"
        size="md"
        isActive={false}
        isCollapsed={false}
        inactiveColor="text-fg-on-brand/45"
        tally={0}
      />
    )

    // Assert
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })
})
