import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CheckoutSkeleton } from './CheckoutSkeleton'
import { checkoutSkeletonMock } from './CheckoutSkeleton.mock'

describe('CheckoutSkeleton', () => {
  it('announces that checkout content is loading', () => {
    render(<CheckoutSkeleton />)

    expect(screen.getByLabelText(checkoutSkeletonMock.accessibleName)).toHaveAttribute(
      'aria-busy',
      'true'
    )
  })
})
