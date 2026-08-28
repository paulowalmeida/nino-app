import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CompanyCardSkeleton } from './CompanyCardSkeleton'
import { companyCardSkeletonMock } from './CompanyCardSkeleton.mock'

describe('CompanyCardSkeleton', () => {
  it('announces loading and mirrors the company fields', () => {
    const { container } = render(<CompanyCardSkeleton />)

    expect(screen.getByRole('status')).toHaveTextContent(
      'Carregando empresa'
    )

    const ghostCount = companyCardSkeletonMock.placeholderFieldCount
    expect(
      container.querySelectorAll('[aria-hidden="true"]').length
    ).toBeGreaterThanOrEqual(ghostCount)
  })
})
