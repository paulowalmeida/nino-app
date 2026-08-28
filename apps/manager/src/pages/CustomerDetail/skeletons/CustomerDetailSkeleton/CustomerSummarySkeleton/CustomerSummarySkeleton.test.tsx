import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CustomerSummarySkeleton } from './CustomerSummarySkeleton'
import { customerSummarySkeletonMock } from './CustomerSummarySkeleton.mock'

const { placeholderFactCount, placeholderBoneCount } =
  customerSummarySkeletonMock

describe('CustomerSummarySkeleton', () => {
  it('mirrors a label and a value for every fact of the strip', () => {
    // Arrange
    const { container } = render(<CustomerSummarySkeleton />)

    // Act
    const bones = container.querySelectorAll('[class*="skeleton"]')

    // Assert
    expect(bones).toHaveLength(placeholderFactCount * 2)
    expect(bones).toHaveLength(placeholderBoneCount)
  })
})
