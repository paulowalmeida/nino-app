import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CategoriesHeaderSkeleton } from './CategoriesHeaderSkeleton'
import { categoriesHeaderSkeletonMock } from './CategoriesHeaderSkeleton.mock'

describe('CategoriesHeaderSkeleton', () => {
  it('announces loading and mirrors the title, the create form and the icon picker', () => {
    const { container } = render(<CategoriesHeaderSkeleton />)

    expect(screen.getByRole('status')).toHaveTextContent(
      categoriesHeaderSkeletonMock.status
    )
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(
      categoriesHeaderSkeletonMock.placeholderCount + 2
    )
  })
})
