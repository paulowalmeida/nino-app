import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CollaboratorActivity } from './CollaboratorActivity'

const activity = [
  {
    id: 'activity-1',
    orderId: 'order-123',
    orderNumber: 1042,
    status: 'COMPLETED',
    createdAt: '2024-01-02T10:30:00.000Z',
    channel: 'COUNTER',
    totalAmount: 42,
    consumerName: 'Cliente',
  },
  {
    id: 'activity-2',
    orderId: 'order-456',
    orderNumber: 1043,
    status: 'PENDING',
    createdAt: '2024-01-03T10:30:00.000Z',
    channel: 'DELIVERY',
    totalAmount: 15,
    consumerName: null,
  },
]

describe(CollaboratorActivity.name, () => {
  it('presents recent order activity with accessible context', () => {
    render(
      <CollaboratorActivity activity={activity as never} headingLevel={2} />
    )
    expect(
      screen.getByRole('heading', { name: 'Atividade recente' })
    ).toBeInTheDocument()
    expect(screen.getAllByLabelText(/Pedido/)).not.toHaveLength(0)
    expect(screen.getAllByText('Cliente')).not.toHaveLength(0)
  })

  it('presents the empty activity state', () => {
    render(<CollaboratorActivity activity={[]} headingLevel={3} />)
    expect(
      screen.getByText('Nenhum pedido passou pela mão desta pessoa ainda.')
    ).toBeInTheDocument()
  })
})
