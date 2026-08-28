import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CustomerHeaderSkeleton } from './CustomerHeaderSkeleton'
import { customerHeaderSkeletonMock } from './CustomerHeaderSkeleton.mock'

const { placeholderBoneCount } = customerHeaderSkeletonMock

describe('CustomerHeaderSkeleton', () => {
  it('mirrors the mark and the three lines of the hero', () => {
    // Arrange
    const { container } = render(<CustomerHeaderSkeleton />)

    // Act
    const bones = container.querySelectorAll('[class*="skeleton"]')

    // Assert
    expect(bones).toHaveLength(placeholderBoneCount)
  })
})
