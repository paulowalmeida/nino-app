import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { MenuRowsSkeleton } from './MenuRowsSkeleton'
import { menuRowsSkeletonMock } from './MenuRowsSkeleton.mock'

describe('MenuRowsSkeleton', () => {
  it('marks the menu as busy while rows are loading', () => {
    const { container } = render(<MenuRowsSkeleton {...menuRowsSkeletonMock} />)
    expect(container.firstElementChild).toHaveAttribute('aria-busy', 'true')
  })
})
