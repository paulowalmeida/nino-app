import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CollaboratorWorkspaceSkeleton } from './CollaboratorWorkspaceSkeleton'
import { collaboratorWorkspaceSkeletonMock } from './CollaboratorWorkspaceSkeleton.mock'

const { placeholderTabCount } = collaboratorWorkspaceSkeletonMock

describe('CollaboratorWorkspaceSkeleton', () => {
  it('draws the tab rail and opens on the overview panel', () => {
    // Arrange
    const { container } = render(<CollaboratorWorkspaceSkeleton />)

    // Act
    const rail = container.querySelectorAll('[class*="tabBar"] > *')

    // Assert
    expect(rail).toHaveLength(placeholderTabCount)
    expect(screen.getByLabelText('Resumo do trabalho')).toBeVisible()
  })
})
