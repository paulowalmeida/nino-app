import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CustomerContactSkeleton } from './CustomerContactSkeleton'
import { customerContactSkeletonMock } from './CustomerContactSkeleton.mock'

const { placeholderBoneCount } = customerContactSkeletonMock

describe('CustomerContactSkeleton', () => {
  it('mirrors both contact actions and the document line', () => {
    // Arrange
    const { container } = render(<CustomerContactSkeleton />)

    // Act
    const bones = container.querySelectorAll('[class*="skeleton"]')

    // Assert
    expect(screen.getByLabelText('Contato')).toBeVisible()
    expect(bones).toHaveLength(placeholderBoneCount)
  })
})
