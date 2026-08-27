import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { OrderDetailSkeleton } from './OrderDetailSkeleton'
import { orderDetailSkeletonMock } from './OrderDetailSkeleton.mock'

describe('OrderDetailSkeleton', () => {
  it('communicates that order details are loading', () => {
    render(<OrderDetailSkeleton />, { wrapper: MemoryRouter })

    expect(screen.getByRole('status')).toHaveTextContent(
      orderDetailSkeletonMock.loadingLabel
    )
  })
})
