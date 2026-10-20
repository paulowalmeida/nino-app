import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'

import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCollaboratorDetailAdmin } from '@pages/CollaboratorDetail/hooks/useCollaboratorDetailAdmin/useCollaboratorDetailAdmin'
import { useCollaboratorDetailQuery } from '@pages/CollaboratorDetail/hooks/useCollaboratorDetailQuery/useCollaboratorDetailQuery'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'
import { useUnitPositions } from '@shared/hooks/team/useUnitPositions/useUnitPositions'

import { useCollaboratorDetailFacade } from './useCollaboratorDetailFacade'
import { collaboratorDetailFacadeMock } from './useCollaboratorDetailFacade.mock'

vi.mock(
  '@pages/CollaboratorDetail/hooks/useCollaboratorDetailQuery/useCollaboratorDetailQuery'
)
vi.mock(
  '@pages/CollaboratorDetail/hooks/useCollaboratorDetailAdmin/useCollaboratorDetailAdmin'
)
vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit')
vi.mock('@shared/hooks/team/useUnitPositions/useUnitPositions')

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
    vi.mocked(useCurrentUnit).mockReturnValue(
      collaboratorDetailFacadeMock.ownerUnit as never
    )
    vi.mocked(useUnitPositions).mockReturnValue({
      data: collaboratorDetailFacadeMock.positions,
    } as never)
    vi.mocked(useCollaboratorDetailQuery).mockReturnValue({
      data: member,
      isPending: false,
    } as never)
    vi.mocked(useCollaboratorDetailAdmin).mockReturnValue({
      isRemoving: false,
      canChangePosition: true,
    } as never)
    const { result } = renderHook(() => useCollaboratorDetailFacade(), {
      wrapper: routeWrapper,
    })
    expect(result.current.member).toBe(member)
    expect(result.current.canChangePosition).toBe(true)
    expect(useCollaboratorDetailQuery).toHaveBeenCalledWith('unit-1', 'user-1')
    expect(useCollaboratorDetailAdmin).toHaveBeenCalledWith(
      'unit-1',
      'UNIT_OWNER',
      member,
      collaboratorDetailFacadeMock.positions,
      100
    )
  })

  it('passes a null member to administration while query data is pending', () => {
    vi.mocked(useCurrentUnit).mockReturnValue(
      collaboratorDetailFacadeMock.managerUnit as never
    )
    vi.mocked(useUnitPositions).mockReturnValue({ data: undefined } as never)
    vi.mocked(useCollaboratorDetailQuery).mockReturnValue({
      data: undefined,
    } as never)
    vi.mocked(useCollaboratorDetailAdmin).mockReturnValue({
      isRemoving: false,
    } as never)
    renderHook(() => useCollaboratorDetailFacade(), { wrapper: routeWrapper })
    expect(useCollaboratorDetailAdmin).toHaveBeenCalledWith(
      'unit-1',
      'MANAGER',
      null,
      [],
      50
    )
  })

  it('uses an empty scope when the route and current unit are unavailable', () => {
    vi.mocked(useCurrentUnit).mockReturnValue(null)
    vi.mocked(useUnitPositions).mockReturnValue({ data: undefined } as never)
    vi.mocked(useCollaboratorDetailQuery).mockReturnValue({
      data: undefined,
    } as never)
    vi.mocked(useCollaboratorDetailAdmin).mockReturnValue({} as never)

    renderHook(() => useCollaboratorDetailFacade(), {
      wrapper: emptyRouteWrapper,
    })

    expect(useCollaboratorDetailQuery).toHaveBeenCalledWith(null, '')
    expect(useCollaboratorDetailAdmin).toHaveBeenCalledWith(null, null, null, [], 0)
  })
})
