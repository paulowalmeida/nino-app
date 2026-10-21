import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CollaboratorSummary } from './CollaboratorSummary'

const member = {
  revenueHandled: 1250,
  ordersHandled: 12,
  statusChanges: 4,
  cancellations: 1,
  firstActivityAt: '2024-01-02T00:00:00.000Z',
}

describe(CollaboratorSummary.name, () => {
  it('presents work metrics and activity context', () => {
    render(<CollaboratorSummary member={member as never} />)
    expect(screen.getByText('Vendido no balcão')).toBeInTheDocument()
    expect(screen.getByText('R$ 1.250,00')).toBeInTheDocument()
    expect(screen.getByText(/Tocando em pedido desde/)).toBeInTheDocument()
  })

  it('presents empty activity context when no order exists', () => {
    render(
      <CollaboratorSummary
        member={{ ...member, statusChanges: 0, firstActivityAt: null } as never}
      />
    )
    expect(
      screen.getByText(/Ainda não tocou em nenhum pedido/)
    ).toBeInTheDocument()
    expect(screen.getByText(/Nenhum cancelamento/)).toBeInTheDocument()
  })
})
