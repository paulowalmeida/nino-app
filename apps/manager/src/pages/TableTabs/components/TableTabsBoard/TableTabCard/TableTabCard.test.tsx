import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { Tab } from '@shared/types/tab/tab.type'

import { TableTabCard } from './TableTabCard'
import { tableTabCardMock } from './TableTabCard.mock'

const renderCard = (tab: Tab) =>
  render(
    <MemoryRouter>
      <TableTabCard tab={tab} />
    </MemoryRouter>
  )

describe('TableTabCard', () => {
  it('links to the tab and shows its label, status and total', () => {
    renderCard(tableTabCardMock.openTab)

    expect(screen.getByRole('link')).toHaveAttribute('href', '/comandas/tab-1')
    expect(screen.getByText('Mesa 4')).toBeInTheDocument()
    expect(screen.getByText('Aberta')).toBeInTheDocument()
    expect(screen.getByText('R$ 36,00')).toBeInTheDocument()
  })

  it('counts only the items that were not cancelled', () => {
    renderCard(tableTabCardMock.openTab)

    expect(screen.getByText('1 item')).toBeInTheDocument()
  })

  it('pluralizes the item count', () => {
    renderCard({
      ...tableTabCardMock.singleItemTab,
      items: [
        ...tableTabCardMock.singleItemTab.items,
        ...tableTabCardMock.singleItemTab.items,
      ],
    })

    expect(screen.getByText('2 itens')).toBeInTheDocument()
  })

  it('shows an empty tab with zero items', () => {
    renderCard(tableTabCardMock.emptyTab)

    expect(screen.getByText('0 itens')).toBeInTheDocument()
  })

  it('flags a tab that waits for payment', () => {
    renderCard(tableTabCardMock.awaitingPaymentTab)

    expect(screen.getByText('Aguardando pagamento')).toBeInTheDocument()
  })
})
