import { MemoryRouter } from 'react-router'

import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { todayKey } from '@pages/Cash/utils/cash-date/cash-date'

import { useCashDate } from './useCashDate'
import {
  futureDateMock,
  pastDateKeyMock,
  pastDateMock,
} from './useCashDate.mock'

describe('useCashDate', () => {
  it('defaults to today when the URL has no date', () => {
    const { result } = renderHook(() => useCashDate(), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    })

    expect(result.current.dateKey).toBe(todayKey())
    expect(result.current.isToday).toBe(true)
  })

  it('reads a past date from the URL', () => {
    const { result } = renderHook(() => useCashDate(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={[`/caixa?data=${pastDateKeyMock}`]}>
          {children}
        </MemoryRouter>
      ),
    })

    expect(result.current.dateKey).toBe(pastDateKeyMock)
    expect(result.current.isToday).toBe(false)
  })

  it('ignores a future date requested straight from the URL', () => {
    const { result } = renderHook(() => useCashDate(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/caixa?data=2099-01-01']}>
          {children}
        </MemoryRouter>
      ),
    })

    expect(result.current.dateKey).toBe(todayKey())
    expect(result.current.isToday).toBe(true)
  })

  it('setDate moves the selection and clears the param back on today', () => {
    const { result } = renderHook(() => useCashDate(), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    })

    act(() => result.current.setDate(pastDateMock))
    expect(result.current.dateKey).toBe(pastDateKeyMock)
    expect(result.current.isToday).toBe(false)

    act(() => result.current.setDate(undefined))
    expect(result.current.isToday).toBe(true)

    act(() => result.current.setDate(futureDateMock))
    expect(result.current.isToday).toBe(true)
  })
})
