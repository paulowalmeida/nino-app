import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PositionDetailSkeleton } from './PositionDetailSkeleton'
import { positionDetailSkeletonMock } from './PositionDetailSkeleton.mock'

describe(PositionDetailSkeleton.name, () => {
  it('announces the loading state', () => {
    render(<PositionDetailSkeleton />)

    expect(
      screen.getByText(positionDetailSkeletonMock.label)
    ).toBeInTheDocument()
  })
})
