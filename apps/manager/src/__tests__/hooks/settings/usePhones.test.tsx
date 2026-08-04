import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePhones } from '@hooks/settings/usePhones'
import { PhoneService } from '@services/phone.service'

import { phonesPage } from './usePhones.mock'

vi.mock('@services/phone.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(usePhones.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('lists phones for the given tenant', async () => {
    // Arrange
    vi.mocked(PhoneService.listPhones).mockResolvedValue(phonesPage)
    const client = new QueryClient()

    // Act
    const { result } = renderHook(() => usePhones('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Assert
    await waitFor(() =>
      expect(result.current.phones).toEqual(phonesPage.data)
    )
  })

  it('returns an empty list with no tenant', () => {
    // Arrange / Act
    const client = new QueryClient()
    const { result } = renderHook(() => usePhones(null), {
      wrapper: wrapWithClient(client),
    })

    // Assert
    expect(result.current.phones).toEqual([])
    expect(PhoneService.listPhones).not.toHaveBeenCalled()
  })
})
