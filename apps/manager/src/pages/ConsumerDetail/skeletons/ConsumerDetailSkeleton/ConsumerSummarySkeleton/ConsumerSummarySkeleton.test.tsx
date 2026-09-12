import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ConsumerSummarySkeleton } from './ConsumerSummarySkeleton'
import { consumerSummarySkeletonMock } from './ConsumerSummarySkeleton.mock'

const { placeholderFactCount, placeholderBoneCount } =
  consumerSummarySkeletonMock

describe('ConsumerSummarySkeleton', () => {
  it('mirrors a label and a value for every fact of the strip', () => {
    // Arrange
    const { container } = render(<ConsumerSummarySkeleton />)

    // Act
    const bones = container.querySelectorAll('[class*="skeleton"]')

    // Assert
    expect(bones).toHaveLength(placeholderFactCount * 2)
    expect(bones).toHaveLength(placeholderBoneCount)
  })
})
