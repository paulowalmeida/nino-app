import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CustomerDetailSkeleton } from './CustomerDetailSkeleton'
import { customerDetailSkeletonMock } from './CustomerDetailSkeleton.mock'

const { placeholderOrderRowCount, placeholderBoneCount } =
  customerDetailSkeletonMock

const renderSkeleton = () =>
  render(
    <MemoryRouter>
      <CustomerDetailSkeleton />
    </MemoryRouter>
  )

describe('CustomerDetailSkeleton', () => {
  it('announces that the customer is loading', () => {
    renderSkeleton()

    expect(screen.getByRole('status')).toHaveTextContent('Carregando o cliente')
  })

  it('keeps the order columns readable while the rows are bones', () => {
    // Arrange
    const { container } = renderSkeleton()

    // Act
    const rows = container.querySelectorAll('tbody tr')

    // Assert
    expect(screen.getByRole('columnheader', { name: 'Pedido' })).toBeVisible()
    expect(screen.getByRole('columnheader', { name: 'Total' })).toBeVisible()
    expect(rows).toHaveLength(placeholderOrderRowCount)
  })

  it('mirrors every region of the loaded customer sheet', () => {
    // Arrange
    const { container } = renderSkeleton()

    // Act
    const bones = container.querySelectorAll('[class*="skeleton"]')

    // Assert
    expect(bones).toHaveLength(placeholderBoneCount)
  })
})
