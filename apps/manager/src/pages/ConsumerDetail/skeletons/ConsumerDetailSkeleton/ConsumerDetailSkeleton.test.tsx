import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ConsumerDetailSkeleton } from './ConsumerDetailSkeleton'
import { consumerDetailSkeletonMock } from './ConsumerDetailSkeleton.mock'

const { placeholderBoneCount } = consumerDetailSkeletonMock

const renderSkeleton = () =>
  render(
    <MemoryRouter>
      <ConsumerDetailSkeleton />
    </MemoryRouter>
  )

describe('ConsumerDetailSkeleton', () => {
  it('announces that the consumer is loading', () => {
    renderSkeleton()

    expect(screen.getByRole('status')).toHaveTextContent('Carregando o cliente')
  })

  it('composes every region of the consumer sheet', () => {
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
