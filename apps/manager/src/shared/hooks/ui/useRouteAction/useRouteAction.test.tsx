import { type ReactNode } from 'react'
import { MemoryRouter, useSearchParams } from 'react-router'

import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useRouteAction } from './useRouteAction'
import { routeActionMock } from './useRouteAction.mock'

const wrapperAt =
  (url: string) =>
  ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
  )

describe(useRouteAction.name, () => {
  it('runs the requested action once and drops it from the URL', () => {
    const onRequest = vi.fn()

    const { result } = renderHook(
      () => {
        useRouteAction(routeActionMock.action, onRequest)
        return useSearchParams()[0]
      },
      { wrapper: wrapperAt(routeActionMock.requestedUrl) }
    )

    expect(onRequest).toHaveBeenCalledTimes(1)
    expect(result.current.has('acao')).toBe(false)
    expect(result.current.get('tab')).toBe('active')
  })

  it('ignores an action meant for something else', () => {
    const onRequest = vi.fn()

    renderHook(() => useRouteAction(routeActionMock.action, onRequest), {
      wrapper: wrapperAt(routeActionMock.otherUrl),
    })

    expect(onRequest).not.toHaveBeenCalled()
  })
})
