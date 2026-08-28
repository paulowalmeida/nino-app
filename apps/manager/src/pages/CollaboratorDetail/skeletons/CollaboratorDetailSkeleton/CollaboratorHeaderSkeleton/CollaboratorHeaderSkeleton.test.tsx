import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CollaboratorHeaderSkeleton } from './CollaboratorHeaderSkeleton'
import { collaboratorHeaderSkeletonMock } from './CollaboratorHeaderSkeleton.mock'

const { placeholderBoneCount } = collaboratorHeaderSkeletonMock

describe('CollaboratorHeaderSkeleton', () => {
  it('mirrors the mark and the three lines of the hero', () => {
    // Arrange
    const { container } = render(<CollaboratorHeaderSkeleton />)

    // Act
    const bones = container.querySelectorAll('[class*="skeleton"]')

    // Assert
    expect(bones).toHaveLength(placeholderBoneCount)
  })
})
