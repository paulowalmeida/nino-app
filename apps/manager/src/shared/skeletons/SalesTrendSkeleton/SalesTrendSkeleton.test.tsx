import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SalesTrendSkeleton } from './SalesTrendSkeleton'
import { salesTrendSkeletonMock } from './SalesTrendSkeleton.mock'

describe(SalesTrendSkeleton.name, () => {
  it('renders the chart axes and plot placeholders', () => {
    const { container } = render(<SalesTrendSkeleton />)

    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(
      salesTrendSkeletonMock.axisTickCount + 1 + salesTrendSkeletonMock.dayCount
    )
  })
})
