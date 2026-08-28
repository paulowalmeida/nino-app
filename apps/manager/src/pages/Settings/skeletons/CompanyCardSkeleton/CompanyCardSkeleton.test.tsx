import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CompanyCardSkeleton } from './CompanyCardSkeleton'
import { companyCardSkeletonMock } from './CompanyCardSkeleton.mock'

const { placeholderFieldCount, placeholderBoneCount } = companyCardSkeletonMock

describe('CompanyCardSkeleton', () => {
  it('announces that the company is loading', () => {
    render(<CompanyCardSkeleton />)

    expect(screen.getByRole('status')).toHaveTextContent('Carregando a empresa')
  })

  it('draws a label and a control for every field of the form', () => {
    // Arrange
    const { container } = render(<CompanyCardSkeleton />)

    // Act
    const bones = container.querySelectorAll('[aria-hidden="true"]')

    // Assert
    expect(bones.length).toBeGreaterThanOrEqual(placeholderFieldCount * 2)
    expect(bones).toHaveLength(placeholderBoneCount)
  })
})
