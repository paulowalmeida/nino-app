import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCouriers } from '@hooks/team/useCouriers'
import { CourierService } from '@services/courier.service'

import { courierPage, emptyCourierPage } from './useCouriers.mock'

vi.mock('@services/courier.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useCouriers.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('fetches the couriers list', async () => {
    // Arrange
    const client = new QueryClient()
    vi.mocked(CourierService.listCouriers).mockResolvedValue(courierPage)

    // Act
    const { result } = renderHook(() => useCouriers('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Assert
    await waitFor(() => expect(result.current.data).toEqual(courierPage))
  })

  it('resolves an empty page with no couriers', async () => {
    // Arrange
    const client = new QueryClient()
    vi.mocked(CourierService.listCouriers).mockResolvedValue(
      emptyCourierPage
    )

    // Act
    const { result } = renderHook(() => useCouriers('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Assert
    await waitFor(() =>
      expect(result.current.data).toEqual(emptyCourierPage)
    )
  })

  it('stays disabled with no tenant id', () => {
    // Arrange
    const client = new QueryClient()

    // Act
    const { result } = renderHook(() => useCouriers(null), {
      wrapper: wrapWithClient(client),
    })

    // Assert
    expect(result.current.fetchStatus).toBe('idle')
    expect(CourierService.listCouriers).not.toHaveBeenCalled()
  })
})
