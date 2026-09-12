import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ConsumerRankingCard } from './ConsumerRankingCard'
import { consumerRankingCardMock } from './ConsumerRankingCard.mock'

describe('ConsumerRankingCard', () => {
  it('renders the ranking loading state', () => {
    render(
      <ConsumerRankingCard
        {...consumerRankingCardMock}
        isPending
      />
    )

    expect(screen.getByRole('region', { name: consumerRankingCardMock.label })).toBeInTheDocument()
  })

  it('renders empty and populated rankings', () => {
    const { rerender } = render(
      <ConsumerRankingCard {...consumerRankingCardMock} isPending={false} />
    )

    expect(screen.getByText('Nenhum cliente identificado ainda.')).toBeInTheDocument()
    rerender(
      <ConsumerRankingCard
        {...consumerRankingCardMock}
        isPending={false}
        items={[{ id: 'consumer-1', label: 'Ana', value: 2, display: 'R$ 20,00' }]}
      />
    )
    expect(screen.getByText('Ana')).toBeInTheDocument()
  })
})
