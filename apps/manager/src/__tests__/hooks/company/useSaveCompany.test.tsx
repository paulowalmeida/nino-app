import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCompany } from '@hooks/company/useCompany'
import { useSaveCompany } from '@hooks/company/useSaveCompany'
import { CompanyService } from '@services/company.service'

import { company } from './useCompany.mock'

vi.mock('@services/company.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useSaveCompany.name, () => {
  it('makes the saved company available to useCompany right away', async () => {
    // Arrange
    const client = new QueryClient()
    const updated = { ...company, name: 'Padaria Nova' }
    vi.mocked(CompanyService.updateMyCompany).mockResolvedValue(updated)
    const { result: save } = renderHook(() => useSaveCompany(), {
      wrapper: wrapWithClient(client),
    })

    // Act
    save.current.mutate({ name: 'Padaria Nova' })
    await waitFor(() => expect(save.current.isSuccess).toBe(true))

    // Assert
    const { result: read } = renderHook(() => useCompany(), {
      wrapper: wrapWithClient(client),
    })
    expect(read.current.data).toEqual(updated)
  })

  it('reports failure when the update rejects', async () => {
    // Arrange
    const client = new QueryClient()
    vi.mocked(CompanyService.updateMyCompany).mockRejectedValue(
      new Error('network error')
    )
    const { result } = renderHook(() => useSaveCompany(), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate({ name: 'Padaria Nova' })

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
