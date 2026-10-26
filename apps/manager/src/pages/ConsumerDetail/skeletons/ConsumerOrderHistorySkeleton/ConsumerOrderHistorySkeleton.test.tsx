import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ConsumerOrderHistorySkeleton } from './ConsumerOrderHistorySkeleton'
import { consumerOrderHistorySkeletonMock } from './ConsumerOrderHistorySkeleton.mock'

const { placeholderOrderRowCount, placeholderBoneCount } =
  consumerOrderHistorySkeletonMock

describe('ConsumerOrderHistorySkeleton', () => {
  it('keeps the order columns readable while the rows are bones', () => {
    // Arrange
    const { container } = render(<ConsumerOrderHistorySkeleton />)

    // Act
    const rows = container.querySelectorAll('tbody tr')

    // Assert
    expect(screen.getByRole('columnheader', { name: 'Pedido' })).toBeVisible()
    expect(screen.getByRole('columnheader', { name: 'Total' })).toBeVisible()
    expect(rows).toHaveLength(placeholderOrderRowCount)
  })

  it('draws one bone per cell of every order', () => {
    // Arrange
    const { container } = render(<ConsumerOrderHistorySkeleton />)

    // Act
    const bones = container.querySelectorAll('[class*="skeleton"]')

    // Assert
    expect(bones).toHaveLength(placeholderBoneCount)
  })
})
