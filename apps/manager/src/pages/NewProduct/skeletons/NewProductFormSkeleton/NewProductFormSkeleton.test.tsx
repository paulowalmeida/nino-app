import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { NewProductFormSkeleton } from './NewProductFormSkeleton'
import { newProductFormSkeletonMock } from './NewProductFormSkeleton.mock'

describe('NewProductFormSkeleton', () => {
  it('announces loading and mirrors every block of the form', () => {
    const { container } = render(<NewProductFormSkeleton />)

    expect(screen.getByRole('status')).toHaveTextContent(
      newProductFormSkeletonMock.status
    )
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(
      newProductFormSkeletonMock.placeholderCount
    )
  })
})
