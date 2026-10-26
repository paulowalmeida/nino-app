import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router'

import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { usePromotionListQuery } from './usePromotionListQuery'

const at =
  (path: string) =>
  ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[path]}>{children}</MemoryRouter>
  )

describe(usePromotionListQuery.name, () => {
  it('starts on the active tab, newest first', () => {
    const { result } = renderHook(() => usePromotionListQuery(), {
      wrapper: at('/promocoes'),
    })

    expect(result.current.query).toMatchObject({
      tab: 'active',
      target: 'createdAt',
      direction: 'desc',
      page: 1,
    })
  })

  it('reads the list from the URL and ignores unknown values', () => {
    const { result } = renderHook(() => usePromotionListQuery(), {
      wrapper: at('/promocoes?aba=inactive&ordem=usageCount&sentido=asc&pagina=3'),
    })
    expect(result.current.query).toMatchObject({
      tab: 'inactive',
      target: 'usageCount',
      direction: 'asc',
      page: 3,
    })

    const { result: invalid } = renderHook(() => usePromotionListQuery(), {
      wrapper: at('/promocoes?aba=x&ordem=name&pagina=-2'),
    })
    expect(invalid.current.query).toMatchObject({
      tab: 'active',
      target: 'createdAt',
      page: 1,
    })
  })

  it('flips the direction of the same column and resets the page', () => {
    const { result } = renderHook(() => usePromotionListQuery(), {
      wrapper: at('/promocoes?pagina=2'),
    })

    act(() => result.current.changeSort('createdAt'))
    expect(result.current.query).toMatchObject({ direction: 'asc', page: 1 })

    act(() => result.current.changeSort('createdAt'))
    expect(result.current.query.direction).toBe('desc')
  })
})
