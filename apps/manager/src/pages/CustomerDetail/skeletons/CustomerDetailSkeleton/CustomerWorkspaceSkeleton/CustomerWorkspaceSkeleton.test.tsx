import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CustomerWorkspaceSkeleton } from './CustomerWorkspaceSkeleton'
import { customerWorkspaceSkeletonMock } from './CustomerWorkspaceSkeleton.mock'

const { placeholderTabCount } = customerWorkspaceSkeletonMock

describe('CustomerWorkspaceSkeleton', () => {
  it('draws the tab rail and opens on the order history panel', () => {
    // Arrange
    const { container } = render(<CustomerWorkspaceSkeleton />)

    // Act
    const rail = container.querySelectorAll('[class*="tabBar"] > *')

    // Assert
    expect(rail).toHaveLength(placeholderTabCount)
    expect(screen.getByRole('columnheader', { name: 'Pedido' })).toBeVisible()
  })
})
