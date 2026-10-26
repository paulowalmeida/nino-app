import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { KitchenCard } from './KitchenCard'
import {
  kitchenCardFreshOrderMock,
  kitchenCardLateOrderMock,
  kitchenCardNowMock,
  tableDestinationMock,
} from './KitchenCard.mock'

describe(KitchenCard.name, () => {
  beforeEach(() => vi.setSystemTime(new Date(kitchenCardNowMock)))
  afterEach(() => vi.useRealTimers())

  it('counts down the time left on the store deadline', () => {
    // Arrange: entrou 8 min atrás, prazo de 20
    render(
      <KitchenCard
        order={kitchenCardFreshOrderMock}
        destination={tableDestinationMock}
        onStep={vi.fn()}
        isBusy={false}
        dueMinutes={20}
      />
    )

    // Assert
    expect(screen.getByText('12 min')).toBeInTheDocument()
  })

  it('counts past zero and announces the delay when time runs out', () => {
    // Arrange: entrou 40 min atrás, prazo de 20
    render(
      <KitchenCard
        order={kitchenCardLateOrderMock}
        destination={tableDestinationMock}
        onStep={vi.fn()}
        isBusy={false}
        dueMinutes={20}
      />
    )

    // Assert
    expect(screen.getByText('-20 min')).toBeInTheDocument()
    expect(screen.getByText('Pedido atrasado')).toBeInTheDocument()
  })

  it('reads the deadline the store configured, not a fixed one', () => {
    // Arrange: os mesmos 40 min ficam dentro de um prazo de 45
    render(
      <KitchenCard
        order={kitchenCardLateOrderMock}
        destination={tableDestinationMock}
        onStep={vi.fn()}
        isBusy={false}
        dueMinutes={45}
      />
    )

    // Assert
    expect(screen.getByText('5 min')).toBeInTheDocument()
    expect(screen.queryByText('Pedido atrasado')).not.toBeInTheDocument()
  })
})
