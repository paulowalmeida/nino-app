import { MemoryRouter } from 'react-router'

import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useOrdersFilters } from './useOrdersFilters'
import { useOrdersFiltersMock } from './useOrdersFilters.mock'

describe('useOrdersFilters', () => {
  it('reads the stage and search from the URL', () => {
    const { result } = renderHook(() => useOrdersFilters(), {
      wrapper: ({ children }) => (
        <MemoryRouter
          initialEntries={[
            `/pedidos?etapa=${useOrdersFiltersMock.stage}&busca=${useOrdersFiltersMock.search}`,
          ]}
        >
          {children}
        </MemoryRouter>
      ),
    })

    expect(result.current.stage).toBe(useOrdersFiltersMock.stage)
    expect(result.current.term).toBe(useOrdersFiltersMock.search)
    expect(result.current.isSearching).toBe(true)

    act(() => result.current.setStage('closed'))
    act(() => result.current.setTerm('bolo'))
    act(() => result.current.setTerm(''))
    expect(result.current.stage).toBe('closed')

    act(() => result.current.setStage('incoming'))
    expect(result.current.stage).toBe(useOrdersFiltersMock.stage)
  })

  it('falls back to incoming for an invalid stage and trims search', () => {
    const { result } = renderHook(() => useOrdersFilters(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/pedidos?etapa=invalid&busca=%20bolo%20']}>
          {children}
        </MemoryRouter>
      ),
    })

    expect(result.current.stage).toBe('incoming')
    expect(result.current.term).toBe(' bolo ')
    expect(result.current.search).toBe('bolo')
    expect(result.current.statuses).toBeUndefined()
  })

  it('returns stage statuses when there is no search', () => {
    const { result } = renderHook(() => useOrdersFilters(), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    })

    expect(result.current.statuses).toBeDefined()
  })
})
