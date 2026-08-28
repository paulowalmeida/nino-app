import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CustomerDetailSkeleton } from './CustomerDetailSkeleton'
import { customerDetailSkeletonMock } from './CustomerDetailSkeleton.mock'

const { placeholderBoneCount } = customerDetailSkeletonMock

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

  it('composes every region of the customer sheet', () => {
    // Arrange
    const { container } = renderSkeleton()

    // Act
    const bones = container.querySelectorAll('[class*="skeleton"]')

    // Assert
    expect(screen.getByLabelText('Resumo')).toBeVisible()
    expect(screen.getByLabelText('Contato')).toBeVisible()
    expect(screen.getByRole('columnheader', { name: 'Pedido' })).toBeVisible()
    expect(bones).toHaveLength(placeholderBoneCount)
  })
})
