import { MemoryRouter } from 'react-router'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useQueueSummary } from '@hooks/order/useQueueSummary'

import { QueueBoard } from '@compositions/QueueBoard/QueueBoard'

import { busySummary, idleSummary } from './QueueBoard.mock'

vi.mock('@hooks/order/useQueueSummary')

const mockSummary = (
  data: ReturnType<typeof useQueueSummary>['data'],
  isPending = false
) =>
  vi.mocked(useQueueSummary).mockReturnValue({
    data,
    isPending,
  } as unknown as ReturnType<typeof useQueueSummary>)

const renderBoard = () =>
  render(
    <MemoryRouter>
      <QueueBoard tenantId="tenant-1" />
    </MemoryRouter>
  )

describe(QueueBoard.name, () => {
  it('shows skeleton values while the summary is loading', () => {
    // Arrange
    mockSummary(undefined, true)

    // Act
    const { container } = renderBoard()

    // Assert
    expect(container.querySelectorAll('[aria-hidden="true"]').length)
      .toBeGreaterThan(0)
  })

  it('sums the queue counts into each stage tile', () => {
    // Arrange
    mockSummary(busySummary)

    // Act
    renderBoard()

    // Assert
    expect(
      screen.getByRole('link', { name: 'Ver pedidos esperando aceite' })
    ).toHaveTextContent('2')
    expect(
      screen.getByRole('link', { name: 'Ver pedidos na cozinha' })
    ).toHaveTextContent('3')
  })

  it('links each tile to the queue filtered by its stage', () => {
    // Arrange
    mockSummary(busySummary)

    // Act
    renderBoard()

    // Assert
    expect(
      screen.getByRole('link', { name: 'Ver pedidos confirmados' })
    ).toHaveAttribute('href', '/pedidos?etapa=confirmed')
  })

  it('shows the idle message once every tile is at zero', () => {
    // Arrange
    mockSummary(idleSummary)

    // Act
    renderBoard()

    // Assert
    expect(screen.getByText(/Nenhum pedido na fila/)).toBeInTheDocument()
  })

  it('hides the idle message once any tile has orders', () => {
    // Arrange
    mockSummary(busySummary)

    // Act
    renderBoard()

    // Assert
    expect(
      screen.queryByText(/Nenhum pedido na fila/)
    ).not.toBeInTheDocument()
  })
})
