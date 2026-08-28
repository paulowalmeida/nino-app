import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CustomerOrderHistorySkeleton } from './CustomerOrderHistorySkeleton'
import { customerOrderHistorySkeletonMock } from './CustomerOrderHistorySkeleton.mock'

const { placeholderOrderRowCount, placeholderBoneCount } =
  customerOrderHistorySkeletonMock

describe('CustomerOrderHistorySkeleton', () => {
  it('keeps the order columns readable while the rows are bones', () => {
    // Arrange
    const { container } = render(<CustomerOrderHistorySkeleton />)

    // Act
    const rows = container.querySelectorAll('tbody tr')

    // Assert
    expect(screen.getByRole('columnheader', { name: 'Pedido' })).toBeVisible()
    expect(screen.getByRole('columnheader', { name: 'Total' })).toBeVisible()
    expect(rows).toHaveLength(placeholderOrderRowCount)
  })

  it('draws one bone per cell of every order', () => {
    // Arrange
    const { container } = render(<CustomerOrderHistorySkeleton />)

    // Act
    const bones = container.querySelectorAll('[class*="skeleton"]')

    // Assert
    expect(bones).toHaveLength(placeholderBoneCount)
  })
})
