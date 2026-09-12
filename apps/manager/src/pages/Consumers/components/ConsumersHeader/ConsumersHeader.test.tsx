import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useConsumersFacade } from '@pages/Consumers/facades/useConsumersFacade/useConsumersFacade'

import { ConsumersHeader } from './ConsumersHeader'
import { consumersHeaderMock } from './ConsumersHeader.mock'

vi.mock('@pages/Consumers/facades/useConsumersFacade/useConsumersFacade')

const setSearch = vi.fn()

describe('ConsumersHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useConsumersFacade).mockReturnValue({
      total: consumersHeaderMock.total,
      setSearch,
    } as unknown as ReturnType<typeof useConsumersFacade>)
  })

  it('titles the screen and counts the base', () => {
    render(<ConsumersHeader />)

    expect(
      screen.getByRole('heading', { name: 'Quem já comprou e volta' })
    ).toBeInTheDocument()
    expect(screen.getByText(/42 pessoas com pedido/)).toBeInTheDocument()
  })

  it('commits the typed term once it settles', async () => {
    render(<ConsumersHeader />)

    await userEvent.type(
      screen.getByRole('searchbox', { name: consumersHeaderMock.searchLabel }),
      consumersHeaderMock.term
    )

    await waitFor(() =>
      expect(setSearch).toHaveBeenLastCalledWith(consumersHeaderMock.term)
    )
  })
})
