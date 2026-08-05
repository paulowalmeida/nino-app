import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { TenantPhone } from '@custom_types/settings/tenant-phone'
import { usePhoneMutations } from '@hooks/settings/usePhoneMutations'
import { PhoneService } from '@services/phone.service'

vi.mock('@services/phone.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(usePhoneMutations.name, () => {
  it('adds a phone', async () => {
    // Arrange
    vi.mocked(PhoneService.createPhone).mockResolvedValue(
      {} as unknown as TenantPhone
    )
    const client = new QueryClient()
    const { result } = renderHook(() => usePhoneMutations('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.add.mutate('85999990000')

    // Assert
    await waitFor(() => expect(result.current.add.isSuccess).toBe(true))
    expect(PhoneService.createPhone).toHaveBeenCalledWith(
      'tenant-1',
      '85999990000'
    )
  })

  it('removes a phone', async () => {
    // Arrange
    vi.mocked(PhoneService.removePhone).mockResolvedValue({ message: 'ok' })
    const client = new QueryClient()
    const { result } = renderHook(() => usePhoneMutations('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.drop.mutate('phone-1')

    // Assert
    await waitFor(() => expect(result.current.drop.isSuccess).toBe(true))
  })

  it('reports failure when editing rejects', async () => {
    // Arrange
    vi.mocked(PhoneService.updatePhone).mockRejectedValue(
      new Error('network error')
    )
    const client = new QueryClient()
    const { result } = renderHook(() => usePhoneMutations('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.edit.mutate({ id: 'phone-1', phone: '85988887777' })

    // Assert
    await waitFor(() => expect(result.current.edit.isError).toBe(true))
  })
})
