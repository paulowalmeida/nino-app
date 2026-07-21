import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { MenuPage } from '@custom_types/product'
import { setItemPosition } from '@services/product/product.service'

import { menuQueryKey } from './useMenu'
import { useReorderMenuItems } from './useReorderMenuItems'

vi.mock('@services/product/product.service')

const buildPage = (): MenuPage => ({
  data: [
    { id: 'a', position: 1 } as MenuPage['data'][number],
    { id: 'b', position: 2 } as MenuPage['data'][number],
  ],
  pagination: { total: 2 },
})

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useReorderMenuItems.name, () => {
  it('reorders the cache optimistically before the request resolves', async () => {
    const client = new QueryClient()
    client.setQueryData(menuQueryKey('tenant-1'), buildPage())
    vi.mocked(setItemPosition).mockResolvedValue({} as never)

    const { result } = renderHook(() => useReorderMenuItems('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    result.current.mutate({
      positions: [
        { id: 'a', position: 2 },
        { id: 'b', position: 1 },
      ],
    })

    await waitFor(() => {
      const page = client.getQueryData<MenuPage>(menuQueryKey('tenant-1'))
      expect(page?.data.map((item) => item.id)).toEqual(['b', 'a'])
    })
  })

  it('rolls back the cache when the request fails', async () => {
    const client = new QueryClient()
    const original = buildPage()
    client.setQueryData(menuQueryKey('tenant-1'), original)
    vi.mocked(setItemPosition).mockRejectedValue(new Error('network error'))

    const { result } = renderHook(() => useReorderMenuItems('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    result.current.mutate({ positions: [{ id: 'a', position: 2 }] })

    await waitFor(() => expect(result.current.isError).toBe(true))

    const page = client.getQueryData<MenuPage>(menuQueryKey('tenant-1'))
    expect(page?.data.map((item) => item.id)).toEqual(['a', 'b'])
  })
})
