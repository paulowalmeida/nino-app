import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CollaboratorContactSkeleton } from './CollaboratorContactSkeleton'
import { collaboratorContactSkeletonMock } from './CollaboratorContactSkeleton.mock'

const { placeholderBoneCount } = collaboratorContactSkeletonMock

describe('CollaboratorContactSkeleton', () => {
  it('mirrors both contact actions and the login provider line', () => {
    // Arrange
    const { container } = render(<CollaboratorContactSkeleton />)

    // Act
    const bones = container.querySelectorAll('[class*="skeleton"]')

    // Assert
    expect(screen.getByLabelText('Contato')).toBeVisible()
    expect(bones).toHaveLength(placeholderBoneCount)
  })
})
