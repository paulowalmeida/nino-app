import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CustomerRankingCard } from './CustomerRankingCard'
import { customerRankingCardMock } from './CustomerRankingCard.mock'

describe('CustomerRankingCard', () => {
  it('renders the ranking loading state', () => {
    render(
      <CustomerRankingCard
        {...customerRankingCardMock}
        isPending
      />
    )

    expect(screen.getByRole('region', { name: customerRankingCardMock.label })).toBeInTheDocument()
  })

  it('renders empty and populated rankings', () => {
    const { rerender } = render(
      <CustomerRankingCard {...customerRankingCardMock} isPending={false} />
    )

    expect(screen.getByText('Nenhum cliente identificado ainda.')).toBeInTheDocument()
    rerender(
      <CustomerRankingCard
        {...customerRankingCardMock}
        isPending={false}
        items={[{ id: 'customer-1', label: 'Ana', value: 2, display: 'R$ 20,00' }]}
      />
    )
    expect(screen.getByText('Ana')).toBeInTheDocument()
  })
})
