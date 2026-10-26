import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ConsumerWorkspaceSkeleton } from './ConsumerWorkspaceSkeleton'
import { consumerWorkspaceSkeletonMock } from './ConsumerWorkspaceSkeleton.mock'

const { placeholderTabCount } = consumerWorkspaceSkeletonMock

describe('ConsumerWorkspaceSkeleton', () => {
  it('draws the tab rail and opens on the order history panel', () => {
    // Arrange
    const { container } = render(<ConsumerWorkspaceSkeleton />)

    // Act
    const rail = container.querySelectorAll('[class*="tabBar"] > *')

    // Assert
    expect(rail).toHaveLength(placeholderTabCount)
    expect(screen.getByRole('columnheader', { name: 'Pedido' })).toBeVisible()
  })
})
