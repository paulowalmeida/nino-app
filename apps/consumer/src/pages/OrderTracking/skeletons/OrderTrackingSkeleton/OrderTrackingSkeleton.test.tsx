import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { OrderTrackingSkeleton } from './OrderTrackingSkeleton'
import { orderTrackingSkeletonMock } from './OrderTrackingSkeleton.mock'

describe('OrderTrackingSkeleton', () => {
  it('announces loading and mirrors the five-step order journey', () => {
    const { container } = render(<OrderTrackingSkeleton />)

    expect(
      screen.getByLabelText(orderTrackingSkeletonMock.loadingLabel)
    ).toHaveAttribute('aria-busy', 'true')
    expect(container.querySelectorAll('[class*="skRow"]')).toHaveLength(
      orderTrackingSkeletonMock.journeyRows
    )
  })
})
