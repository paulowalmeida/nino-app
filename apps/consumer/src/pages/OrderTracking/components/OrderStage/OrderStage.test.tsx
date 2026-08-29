import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { OrderStage } from './OrderStage'
import { orderStageMock } from './OrderStage.mock'

vi.mock('@hooks/useMinutesUntil/useMinutesUntil', () => ({
  useMinutesUntil: () => 20,
}))
vi.mock('@shared/components/AnimatedNumber/AnimatedNumber', () => ({
  AnimatedNumber: ({ value }: { value: number }) => <span>{value}</span>,
}))
vi.mock('@shared/components/OrderRail/OrderRail', () => ({
  OrderRail: () => <div data-testid="order-rail" />,
}))

describe('OrderStage', () => {
  it('shows the live preparation stage with its estimated countdown', () => {
    render(<OrderStage {...orderStageMock} />)

    expect(
      screen.getByText('Sua comida está sendo preparada')
    ).toBeInTheDocument()
    expect(screen.getByText('20')).toBeInTheDocument()
    expect(screen.getByTestId('order-rail')).toBeInTheDocument()
  })
})
