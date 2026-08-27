import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SubscriptionSkeleton } from './SubscriptionSkeleton'
import { subscriptionSkeletonMock } from './SubscriptionSkeleton.mock'

describe('SubscriptionSkeleton', () => {
  it('announces loading and mirrors the plan card', () => {
    const { container } = render(<SubscriptionSkeleton />)

    expect(screen.getByRole('status')).toHaveTextContent(
      subscriptionSkeletonMock.status
    )
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(
      3 + subscriptionSkeletonMock.placeholderFactCount * 2
    )
  })
})
