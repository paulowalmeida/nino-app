import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { NewOrderMenuSkeleton } from './NewOrderMenuSkeleton'
import { newOrderMenuSkeletonMock } from './NewOrderMenuSkeleton.mock'

describe('NewOrderMenuSkeleton', () => {
  it('announces the loading menu and mirrors its sections', () => {
    const { container } = render(<NewOrderMenuSkeleton />)

    expect(
      screen.getByRole('region', { name: 'Carregando cardápio' })
    ).toBeInTheDocument()
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBe(
      newOrderMenuSkeletonMock.placeholderSectionCount *
        (1 + newOrderMenuSkeletonMock.placeholderItemCount * 4)
    )
  })
})
