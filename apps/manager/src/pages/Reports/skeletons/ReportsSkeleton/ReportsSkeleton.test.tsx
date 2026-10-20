import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ReportsSkeleton } from './ReportsSkeleton'
import { reportsSkeletonMock } from './ReportsSkeleton.mock'

describe('ReportsSkeleton', () => {
  it('announces loading and hides the placeholders from assistive tech', () => {
    const { container } = render(<ReportsSkeleton />)

    expect(screen.getByRole('status')).toHaveTextContent(
      reportsSkeletonMock.status
    )
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })

  it('mirrors every region of the report: trends, breakdowns and ranking', () => {
    const { container } = render(<ReportsSkeleton />)

    expect(container.querySelectorAll('section')).toHaveLength(
      reportsSkeletonMock.expectedSections
    )
  })
})
