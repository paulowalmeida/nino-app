import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useConsumersList } from '@pages/Consumers/hooks/useConsumersList/useConsumersList'
import { useConsumersStore } from '@pages/Consumers/states/consumers/consumers.store'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

import { useConsumersFacade } from './useConsumersFacade'
import { consumersFacadeMock } from './useConsumersFacade.mock'

vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit')
vi.mock('@pages/Consumers/hooks/useConsumersList/useConsumersList')

describe('useConsumersFacade', () => {
  it('feeds the committed term to the list and exposes both contracts', () => {
    const loadMoreConsumers = vi.fn()
    useConsumersStore.getState().setSearch(consumersFacadeMock.search)
    vi.mocked(useCurrentUnit).mockReturnValue({
      unitId: consumersFacadeMock.unitId,
    } as unknown as ReturnType<typeof useCurrentUnit>)
    vi.mocked(useConsumersList).mockReturnValue({
      rows: [{ id: 'consumer-1' }],
      total: 1,
      isPending: false,
      isError: false,
      hasNextPage: true,
      loadMoreConsumers,
    } as unknown as ReturnType<typeof useConsumersList>)

    const { result } = renderHook(() => useConsumersFacade())

    expect(useConsumersList).toHaveBeenCalledWith(
      consumersFacadeMock.unitId,
      consumersFacadeMock.search
    )
    expect(result.current.search).toBe(consumersFacadeMock.search)
    expect(result.current.rows).toHaveLength(1)
    expect(result.current.total).toBe(1)
    expect(result.current.hasNextPage).toBe(true)
    expect(result.current.loadMoreConsumers).toBe(loadMoreConsumers)
    expect(result.current.setSearch).toBe(
      useConsumersStore.getState().setSearch
    )
  })

  it('asks the whole base without unit or term', () => {
    useConsumersStore.getState().setSearch('')
    vi.mocked(useCurrentUnit).mockReturnValue(null)
    vi.mocked(useConsumersList).mockReturnValue({
      rows: [],
      total: undefined,
      isPending: true,
      isError: false,
      hasNextPage: false,
      loadMoreConsumers: vi.fn(),
    } as unknown as ReturnType<typeof useConsumersList>)

    const { result } = renderHook(() => useConsumersFacade())

    expect(useConsumersList).toHaveBeenLastCalledWith(null, '')
    expect(result.current.isPending).toBe(true)
  })
})
