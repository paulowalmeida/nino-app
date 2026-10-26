import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ConsumerHeaderSkeleton } from './ConsumerHeaderSkeleton'
import { consumerHeaderSkeletonMock } from './ConsumerHeaderSkeleton.mock'

const { placeholderBoneCount } = consumerHeaderSkeletonMock

describe('ConsumerHeaderSkeleton', () => {
  it('mirrors the mark and the three lines of the hero', () => {
    // Arrange
    const { container } = render(<ConsumerHeaderSkeleton />)

    // Act
    const bones = container.querySelectorAll('[class*="skeleton"]')

    // Assert
    expect(bones).toHaveLength(placeholderBoneCount)
  })
})
