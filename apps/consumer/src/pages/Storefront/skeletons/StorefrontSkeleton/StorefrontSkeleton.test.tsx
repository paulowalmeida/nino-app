import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StorefrontSkeleton } from './StorefrontSkeleton'
import { storefrontSkeletonMock } from './StorefrontSkeleton.mock'

describe('StorefrontSkeleton', () => {
  it('announces that the store is loading', () => {
    render(<StorefrontSkeleton />)
    expect(
      screen.getByLabelText(storefrontSkeletonMock.label)
    ).toBeInTheDocument()
  })
})
