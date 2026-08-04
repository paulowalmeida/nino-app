import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCreateStore } from '@hooks/store/useCreateStore'
import { TenantService } from '@services/tenant.service'
import { useSessionStore } from '@states/useSessionStore'

import { createStoreRequest } from './useCreateStore.mock'

vi.mock('@services/tenant.service')

const navigateMock = vi.fn()

vi.mock('react-router', () => ({
  useNavigate: () => navigateMock,
}))

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useCreateStore.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('clears the session and navigates home on success', async () => {
    // Arrange
    vi.mocked(TenantService.createStore).mockResolvedValue({
      id: 'store-1',
      slug: 'padaria-boa',
    })
    const clearSpy = vi.spyOn(useSessionStore.getState(), 'clear')
    const client = new QueryClient()
    const { result } = renderHook(() => useCreateStore(), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate(createStoreRequest)

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(clearSpy).toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalledWith('/')
  })

  it('navigates to the route returned by onCreated', async () => {
    // Arrange
    const created = { id: 'store-1', slug: 'padaria-boa' }
    vi.mocked(TenantService.createStore).mockResolvedValue(created)
    const onCreated = vi.fn((store) => `/${store.slug}`)
    const client = new QueryClient()
    const { result } = renderHook(() => useCreateStore(onCreated), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate(createStoreRequest)

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(onCreated).toHaveBeenCalledWith(created)
    expect(navigateMock).toHaveBeenCalledWith('/padaria-boa')
  })

  it('reports failure when creation rejects', async () => {
    // Arrange
    vi.mocked(TenantService.createStore).mockRejectedValue(
      new Error('conflict')
    )
    const client = new QueryClient()
    const { result } = renderHook(() => useCreateStore(), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate(createStoreRequest)

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(navigateMock).not.toHaveBeenCalled()
  })
})
