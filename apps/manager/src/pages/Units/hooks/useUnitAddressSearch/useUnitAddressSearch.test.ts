import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { UnitAddressSearchService } from '@pages/Units/services/unit-address-search.service/unit-address-search.service'

import { useUnitAddressSearch } from './useUnitAddressSearch'
import { unitAddressSearchInputMock } from './useUnitAddressSearch.mock'

vi.mock(
  '@pages/Units/services/unit-address-search.service/unit-address-search.service',
  () => ({
    UnitAddressSearchService: { search: vi.fn(), details: vi.fn() },
  })
)

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: new QueryClient() }, children)

describe(useUnitAddressSearch.name, () => {
  beforeEach(() => {
    let sessionTokenCount = 0
    vi.stubGlobal('crypto', {
      randomUUID: () => `session-${++sessionTokenCount}`,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })

  it('waits for the number before searching with the city context', async () => {
    vi.useFakeTimers()
    vi.mocked(UnitAddressSearchService.search).mockResolvedValue([])

    renderHook(
      () =>
        useUnitAddressSearch(
          'unit-1',
          unitAddressSearchInputMock.street,
          unitAddressSearchInputMock.number,
          unitAddressSearchInputMock.state,
          unitAddressSearchInputMock.city,
          true
        ),
      { wrapper }
    )

    await act(async () => {
      vi.advanceTimersByTime(500)
      await Promise.resolve()
    })

    expect(UnitAddressSearchService.search).toHaveBeenCalledWith(
      'unit-1',
      'Rua das Flores, 26',
      'PA',
      'session-1',
      'Belém'
    )
  })

  it('rotates the session token after resolving an address', async () => {
    vi.mocked(UnitAddressSearchService.search).mockResolvedValue([])
    vi.mocked(UnitAddressSearchService.details).mockResolvedValue({
      street: 'Rua das Flores',
    } as never)

    const { result } = renderHook(
      () =>
        useUnitAddressSearch(
          'unit-1',
          'Rua das Flores',
          '26',
          'PA',
          'Belém',
          true
        ),
      { wrapper }
    )

    await waitFor(() => expect(UnitAddressSearchService.search).toHaveBeenCalled())
    await act(async () => {
      await result.current.resolveSelectedAddress('place-1')
    })

    expect(UnitAddressSearchService.details).toHaveBeenCalledWith(
      'unit-1',
      'place-1',
      'session-1'
    )
  })

  it('does not search when the number is incomplete', async () => {
    vi.useFakeTimers()

    renderHook(
      () =>
        useUnitAddressSearch(
          'unit-1',
          'Rua das Flores',
          '',
          'PA',
          'Belém',
          true
        ),
      { wrapper }
    )

    await act(async () => {
      vi.advanceTimersByTime(500)
      await Promise.resolve()
    })

    expect(UnitAddressSearchService.search).not.toHaveBeenCalled()
  })
})
