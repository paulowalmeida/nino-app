import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CollaboratorSummarySkeleton } from './CollaboratorSummarySkeleton'
import { collaboratorSummarySkeletonMock } from './CollaboratorSummarySkeleton.mock'

const { placeholderFactCount, placeholderBoneCount } =
  collaboratorSummarySkeletonMock

describe('CollaboratorSummarySkeleton', () => {
  it('mirrors a label and a value for every fact, plus the footnote', () => {
    // Arrange
    const { container } = render(<CollaboratorSummarySkeleton />)

    // Act
    const bones = container.querySelectorAll('[class*="skeleton"]')

    // Assert
    expect(bones.length).toBeGreaterThanOrEqual(placeholderFactCount * 2)
    expect(bones).toHaveLength(placeholderBoneCount)
  })
})
