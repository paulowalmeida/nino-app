import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCompany } from '@hooks/company/useCompany'
import { CompanyService } from '@services/company.service'

import { company } from './useCompany.mock'

vi.mock('@services/company.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useCompany.name, () => {
  it('fetches the current company', async () => {
    // Arrange
    const client = new QueryClient()
    vi.mocked(CompanyService.getMyCompany).mockResolvedValue(company)

    // Act
    const { result } = renderHook(() => useCompany(), {
      wrapper: wrapWithClient(client),
    })

    // Assert
    await waitFor(() => expect(result.current.data).toEqual(company))
  })
})
