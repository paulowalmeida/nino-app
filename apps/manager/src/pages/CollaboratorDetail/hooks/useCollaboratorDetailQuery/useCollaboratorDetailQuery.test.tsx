import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { StaffService } from '@shared/services/staff/staff.service'

import { useCollaboratorDetailQuery } from './useCollaboratorDetailQuery'

vi.mock('@shared/services/staff/staff.service', () => ({
  StaffService: { getById: vi.fn() },
}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider
    client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
  >
    {children}
  </QueryClientProvider>
)

describe(useCollaboratorDetailQuery.name, () => {
  afterEach(() => vi.clearAllMocks())

  it('loads the collaborator detail for an enabled unit and user', async () => {
    vi.mocked(StaffService.getById).mockResolvedValue({
      user: { id: 'user-1' },
    } as never)
    const { result } = renderHook(
      () => useCollaboratorDetailQuery('unit-1', 'user-1'),
      { wrapper }
    )
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(StaffService.getById).toHaveBeenCalledWith('unit-1', 'user-1')
  })

  it('does not request without unit or user scope', () => {
    const { result } = renderHook(() => useCollaboratorDetailQuery(null, ''), {
      wrapper,
    })
    expect(result.current.fetchStatus).toBe('idle')
    expect(StaffService.getById).not.toHaveBeenCalled()
  })
})
