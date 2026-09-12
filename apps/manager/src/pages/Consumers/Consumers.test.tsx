import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useConsumersFacade } from '@pages/Consumers/facades/useConsumersFacade/useConsumersFacade'

import { Consumers } from './Consumers'
import { consumersPageMock } from './Consumers.mock'

vi.mock('@pages/Consumers/facades/useConsumersFacade/useConsumersFacade')
vi.mock('@pages/Consumers/components/ConsumersHeader/ConsumersHeader', () => ({
  ConsumersHeader: () => <div>header</div>,
}))
vi.mock('@pages/Consumers/components/ConsumersList/ConsumersList', () => ({
  ConsumersList: () => <div>list</div>,
}))
vi.mock(
  '@pages/Consumers/skeletons/ConsumersListSkeleton/ConsumersListSkeleton',
  () => ({ ConsumersListSkeleton: () => <div>loading</div> })
)

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useConsumersFacade).mockReturnValue({
    rows: [{ id: 'consumer-1' }],
    search: '',
    isPending: false,
    isError: false,
    ...overrides,
  } as unknown as ReturnType<typeof useConsumersFacade>)

describe('Consumers', () => {
  beforeEach(() => vi.clearAllMocks())

  it('composes the header and the list of consumers', () => {
    facadeWith({})

    render(<Consumers />)

    expect(screen.getByText('header')).toBeInTheDocument()
    expect(screen.getByText('list')).toBeInTheDocument()
    expect(screen.queryByText('loading')).not.toBeInTheDocument()
  })

  it('shows the skeleton while the first page is pending', () => {
    facadeWith({ rows: [], isPending: true })

    render(<Consumers />)

    expect(screen.getByText('loading')).toBeInTheDocument()
    expect(screen.queryByText('list')).not.toBeInTheDocument()
  })

  it('reports a failed load without an empty state', () => {
    facadeWith({ rows: [], isError: true })

    render(<Consumers />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      consumersPageMock.errorMessage
    )
    expect(
      screen.queryByText(consumersPageMock.emptyBaseMessage, { exact: false })
    ).not.toBeInTheDocument()
  })

  it('states an empty base and an empty search separately', () => {
    facadeWith({ rows: [] })

    const base = render(<Consumers />)
    expect(
      screen.getByText(consumersPageMock.emptyBaseMessage, { exact: false })
    ).toBeInTheDocument()
    base.unmount()

    facadeWith({ rows: [], search: consumersPageMock.search })

    render(<Consumers />)
    expect(screen.getByText(/Nenhum cliente com "ana"/)).toBeInTheDocument()
  })
})
