import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ProductDetailSkeleton } from './ProductDetailSkeleton'
import { productDetailSkeletonMock } from './ProductDetailSkeleton.mock'

describe('ProductDetailSkeleton', () => {
  it('announces loading and mirrors every block of the item card', () => {
    const { container } = render(<ProductDetailSkeleton />)

    expect(screen.getByRole('status')).toHaveTextContent(
      productDetailSkeletonMock.status
    )
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(
      productDetailSkeletonMock.placeholderCount
    )
  })
})
