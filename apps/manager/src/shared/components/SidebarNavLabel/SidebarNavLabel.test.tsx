import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SidebarNavLabel } from './SidebarNavLabel'
import { sidebarNavLabelMock } from './SidebarNavLabel.mock'

describe(SidebarNavLabel.name, () => {
  it('renders the label and tally', () => {
    render(
      <SidebarNavLabel
        {...sidebarNavLabelMock}
        size="md"
        isActive
        isCollapsed={false}
        tally={3}
      />
    )
    expect(screen.getByText(sidebarNavLabelMock.label)).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})
