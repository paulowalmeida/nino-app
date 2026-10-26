import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useConsumersFacade } from '@pages/Consumers/facades/useConsumersFacade/useConsumersFacade'

import { ConsumersList } from './ConsumersList'
import { consumerRowsMock } from './ConsumersList.mock'

vi.mock('@pages/Consumers/facades/useConsumersFacade/useConsumersFacade')

const loadMoreConsumers = vi.fn()

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useConsumersFacade).mockReturnValue({
    rows: consumerRowsMock,
    hasNextPage: false,
    loadMoreConsumers,
    ...overrides,
  } as unknown as ReturnType<typeof useConsumersFacade>)

const renderList = () =>
  render(
    <MemoryRouter>
      <ConsumersList />
    </MemoryRouter>
  )

describe('ConsumersList', () => {
  beforeEach(() => vi.clearAllMocks())

  it('lists every consumer under the column ruler', () => {
    facadeWith({})

    renderList()

    expect(screen.getAllByRole('row')).toHaveLength(3)
    expect(screen.getByText('Cliente desde')).toBeInTheDocument()
  })

  it('hides the load-more control on the last page', () => {
    facadeWith({})

    renderList()

    expect(
      screen.queryByRole('button', { name: 'Carregar mais' })
    ).not.toBeInTheDocument()
  })

  it('asks for the next page from the load-more control', async () => {
    facadeWith({ hasNextPage: true })

    renderList()
    await userEvent.click(screen.getByRole('button', { name: 'Carregar mais' }))

    expect(loadMoreConsumers).toHaveBeenCalledOnce()
  })
})
