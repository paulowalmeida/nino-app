import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'

import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCollaboratorDetailAdmin } from '@pages/CollaboratorDetail/hooks/useCollaboratorDetailAdmin/useCollaboratorDetailAdmin'
import { useCollaboratorDetailQuery } from '@pages/CollaboratorDetail/hooks/useCollaboratorDetailQuery/useCollaboratorDetailQuery'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

import { useCollaboratorDetailFacade } from './useCollaboratorDetailFacade'

vi.mock(
  '@pages/CollaboratorDetail/hooks/useCollaboratorDetailQuery/useCollaboratorDetailQuery'
)
vi.mock(
  '@pages/CollaboratorDetail/hooks/useCollaboratorDetailAdmin/useCollaboratorDetailAdmin'
)
vi.mock('@shared/hooks/session/useCurrentTenant/useCurrentTenant')

const routeWrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter initialEntries={['/colaboradores/user-1']}>
    <Routes>
      <Route path="/colaboradores/:userId" element={children} />
    </Routes>
  </MemoryRouter>
)

const emptyRouteWrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>
)

describe(useCollaboratorDetailFacade.name, () => {
  it('maps query and admin contracts without implementing behavior', () => {
    const member = { user: { id: 'user-1' } }
    vi.mocked(useCurrentTenant).mockReturnValue({
      tenantId: 'tenant-1',
      role: 'TENANT_OWNER',
    } as never)
    vi.mocked(useCollaboratorDetailQuery).mockReturnValue({
      data: member,
      isPending: false,
    } as never)
    vi.mocked(useCollaboratorDetailAdmin).mockReturnValue({
      isRemoving: false,
      roleLockHint: undefined,
    } as never)
    const { result } = renderHook(() => useCollaboratorDetailFacade(), {
      wrapper: routeWrapper,
    })
    expect(result.current.member).toBe(member)
    expect(result.current.roleLockHint).toBeUndefined()
    expect(useCollaboratorDetailQuery).toHaveBeenCalledWith(
      'tenant-1',
      'user-1'
    )
    expect(useCollaboratorDetailAdmin).toHaveBeenCalledWith(
      'tenant-1',
      'TENANT_OWNER',
      member
    )
  })

  it('passes a null member to administration while query data is pending', () => {
    vi.mocked(useCurrentTenant).mockReturnValue({
      tenantId: 'tenant-1',
      role: 'MANAGER',
    } as never)
    vi.mocked(useCollaboratorDetailQuery).mockReturnValue({
      data: undefined,
    } as never)
    vi.mocked(useCollaboratorDetailAdmin).mockReturnValue({
      isRemoving: false,
    } as never)
    renderHook(() => useCollaboratorDetailFacade(), { wrapper: routeWrapper })
    expect(useCollaboratorDetailAdmin).toHaveBeenCalledWith(
      'tenant-1',
      'MANAGER',
      null
    )
  })

  it('uses an empty scope when the route and current tenant are unavailable', () => {
    vi.mocked(useCurrentTenant).mockReturnValue(null)
    vi.mocked(useCollaboratorDetailQuery).mockReturnValue({
      data: undefined,
    } as never)
    vi.mocked(useCollaboratorDetailAdmin).mockReturnValue({} as never)

    renderHook(() => useCollaboratorDetailFacade(), {
      wrapper: emptyRouteWrapper,
    })

    expect(useCollaboratorDetailQuery).toHaveBeenCalledWith(null, '')
    expect(useCollaboratorDetailAdmin).toHaveBeenCalledWith(null, null, null)
  })
})
