import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ConsumerContactSkeleton } from './ConsumerContactSkeleton'
import { consumerContactSkeletonMock } from './ConsumerContactSkeleton.mock'

const { placeholderBoneCount } = consumerContactSkeletonMock

describe('ConsumerContactSkeleton', () => {
  it('mirrors both contact actions and the document line', () => {
    // Arrange
    const { container } = render(<ConsumerContactSkeleton />)

    // Act
    const bones = container.querySelectorAll('[class*="skeleton"]')

    // Assert
    expect(screen.getByLabelText('Contato')).toBeVisible()
    expect(bones).toHaveLength(placeholderBoneCount)
  })
})
