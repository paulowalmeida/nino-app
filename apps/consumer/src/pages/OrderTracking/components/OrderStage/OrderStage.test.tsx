import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { OrderStage } from './OrderStage'
import { orderStageMock } from './OrderStage.mock'

vi.mock('@hooks/useStoreTracking/useStoreTracking', () => ({
  useStoreTracking: () => ({
    stageLabel: (status: string) =>
      ({
        PENDING: 'Recebemos seu pedido',
        ACCEPTED: 'A loja aceitou seu pedido',
        PREPARING: 'Sua comida está sendo preparada',
        OUT_FOR_DELIVERY: 'Seu pedido saiu para entrega',
        READY_FOR_PICKUP: 'Seu pedido está pronto para retirada',
        DELIVERED: 'Pedido entregue',
        COMPLETED: 'Pedido retirado',
        CANCELLED: 'Pedido cancelado',
      })[status],
    waitingMessage: null,
  }),
}))


const minutesState = vi.hoisted(() => ({ value: 20 as number | null }))
const motionState = vi.hoisted(() => ({ reduce: false }))

vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal<typeof import('framer-motion')>()

  return { ...actual, useReducedMotion: () => motionState.reduce }
})

vi.mock('@hooks/useMinutesUntil/useMinutesUntil', () => ({
  useMinutesUntil: () => minutesState.value,
}))
vi.mock('@shared/components/AnimatedNumber/AnimatedNumber', () => ({
  AnimatedNumber: ({ value }: { value: number }) => <span>{value}</span>,
}))
vi.mock('@shared/components/OrderRail/OrderRail', () => ({
  OrderRail: () => <div data-testid="order-rail" />,
}))

describe('OrderStage', () => {
  beforeEach(() => {
    minutesState.value = 20
    motionState.reduce = false
  })

  it('shows the live preparation stage with its estimated countdown', () => {
    render(<OrderStage {...orderStageMock} />)

    expect(
      screen.getByText('Sua comida está sendo preparada')
    ).toBeInTheDocument()
    expect(screen.getByText('20')).toBeInTheDocument()
    expect(screen.getByTestId('order-rail')).toBeInTheDocument()
  })

  it('shows the arriving message when the estimate reaches zero', () => {
    minutesState.value = 0

    render(<OrderStage {...orderStageMock} />)

    expect(screen.getByText('a qualquer momento')).toBeInTheDocument()
  })

  it('shows the estimated clock when the countdown is too distant', () => {
    minutesState.value = 120

    render(<OrderStage {...orderStageMock} />)

    expect(screen.getByText('17h00')).toBeInTheDocument()
  })

  it('shows the completion time for a delivered order', () => {
    minutesState.value = null

    render(
      <OrderStage
        order={{
          ...orderStageMock.order,
          status: 'DELIVERED',
          timeline: [{ status: 'DELIVERED', at: '2026-08-29T20:10:00.000Z' }],
        }}
      />
    )

    expect(screen.getByText('Concluído')).toBeInTheDocument()
    expect(screen.getByText('às 17h10')).toBeInTheDocument()
  })

  it('hides the rail for a cancelled order', () => {
    render(
      <OrderStage order={{ ...orderStageMock.order, status: 'CANCELLED' }} />
    )

    expect(screen.queryByTestId('order-rail')).not.toBeInTheDocument()
  })

  it('disables status transition motion when reduced motion is preferred', () => {
    motionState.reduce = true

    render(<OrderStage {...orderStageMock} />)

    expect(
      screen.getByText('Sua comida está sendo preparada')
    ).toBeInTheDocument()
  })
})
