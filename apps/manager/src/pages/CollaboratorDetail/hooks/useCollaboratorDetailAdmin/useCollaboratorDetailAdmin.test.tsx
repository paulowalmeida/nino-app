import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router'

import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useRemoveMember } from '@shared/hooks/team/useRemoveMember/useRemoveMember'
import { useUpdateStaffEmail } from '@shared/hooks/team/useUpdateStaffEmail/useUpdateStaffEmail'
import { useUpdateStaffPosition } from '@shared/hooks/team/useUpdateStaffPosition/useUpdateStaffPosition'
import { useSessionStore } from '@shared/states/session/session.state'

import { useCollaboratorDetailAdmin } from './useCollaboratorDetailAdmin'
import {
  managerMemberDetailMock,
  ownerMemberDetailMock,
  ownerPositionLevelMock,
  staffMemberDetailMock,
  unitPositionsMock,
} from './useCollaboratorDetailAdmin.mock'

vi.mock('@shared/states/session/session.state')
vi.mock('@shared/hooks/team/useRemoveMember/useRemoveMember')
vi.mock('@shared/hooks/team/useUpdateStaffEmail/useUpdateStaffEmail')
vi.mock('@shared/hooks/team/useUpdateStaffPosition/useUpdateStaffPosition')

const navigate = vi.fn()
vi.mock('react-router', async () => ({
  ...(await vi.importActual('react-router')),
  useNavigate: () => navigate,
}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
)

const signIn = (userId: string | null) =>
  vi
    .mocked(useSessionStore)
    .mockImplementation(
      (selector) =>
        selector({ user: userId ? { id: userId } : null } as never) as never
    )

describe(useCollaboratorDetailAdmin.name, () => {
  const removeMember = vi.fn().mockResolvedValue(undefined)
  const updateEmail = vi.fn().mockResolvedValue(undefined)
  const changePosition = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRemoveMember).mockReturnValue({
      mutateAsync: removeMember,
      isPending: false,
    } as never)
    vi.mocked(useUpdateStaffEmail).mockReturnValue({
      mutateAsync: updateEmail,
    } as never)
    vi.mocked(useUpdateStaffPosition).mockReturnValue({
      mutate: changePosition,
      isPending: false,
    } as never)
  })

  it('lets the owner promote a staff member and exposes the commands', async () => {
    signIn('owner-1')
    const { result } = renderHook(
      () =>
        useCollaboratorDetailAdmin(
          'unit-1',
          'UNIT_OWNER',
          staffMemberDetailMock,
          unitPositionsMock,
          ownerPositionLevelMock
        ),
      { wrapper }
    )

    expect(result.current.canChangePosition).toBe(true)
    expect(result.current.promotionOptions.map(({ id }) => id)).toEqual([
      'position-manager',
    ])
    expect(result.current.emailLockHint).toBeUndefined()

    await act(() => result.current.saveEmail('ana@example.com'))
    act(() => result.current.changePosition('position-manager'))
    await act(() => result.current.confirmRemoval())

    expect(updateEmail).toHaveBeenCalledWith({
      userId: 'user-1',
      email: 'ana@example.com',
    })
    expect(changePosition).toHaveBeenCalledWith({
      userId: 'user-1',
      positionId: 'position-manager',
    })
    expect(removeMember).toHaveBeenCalledWith({ id: 'user-1', kind: 'STAFF' })
    expect(navigate).toHaveBeenCalledWith('..')
  })

  it('reports the owner-only lock to a viewer who is not the owner', () => {
    signIn('signed-in')
    const { result } = renderHook(
      () =>
        useCollaboratorDetailAdmin(
          'unit-1',
          'STAFF',
          ownerMemberDetailMock,
          unitPositionsMock,
          10
        ),
      { wrapper }
    )

    expect(result.current.canChangePosition).toBe(false)
    expect(result.current.emailLockHint).toContain('Só o dono')
    expect(result.current.removalLockHint).toContain('Só o dono')
  })

  it('offers no promotion from the highest cargo the owner can grant', () => {
    signIn('owner-1')
    const { result } = renderHook(
      () =>
        useCollaboratorDetailAdmin(
          'unit-1',
          'UNIT_OWNER',
          managerMemberDetailMock,
          unitPositionsMock,
          ownerPositionLevelMock
        ),
      { wrapper }
    )

    expect(result.current.promotionOptions).toEqual([])
    expect(result.current.canChangePosition).toBe(false)
  })

  it('locks changing your own cargo, e-mail and membership', () => {
    signIn('user-1')
    const { result } = renderHook(
      () =>
        useCollaboratorDetailAdmin(
          'unit-1',
          'UNIT_OWNER',
          staffMemberDetailMock,
          unitPositionsMock,
          ownerPositionLevelMock
        ),
      { wrapper }
    )

    expect(result.current.canChangePosition).toBe(false)
    expect(result.current.emailLockHint).toContain('próprio e-mail')
    expect(result.current.removalLockHint).toContain('não pode se remover')
  })

  it('locks identity changes and removal for another owner', () => {
    signIn('owner-1')
    const { result } = renderHook(
      () =>
        useCollaboratorDetailAdmin(
          'unit-1',
          'UNIT_OWNER',
          ownerMemberDetailMock,
          unitPositionsMock,
          ownerPositionLevelMock
        ),
      { wrapper }
    )

    expect(result.current.canChangePosition).toBe(false)
    expect(result.current.emailLockHint).toContain('Rebaixe o dono')
    expect(result.current.removalLockHint).toContain('Rebaixe o dono')
  })

  it('keeps commands available while the collaborator data is absent', () => {
    signIn(null)
    const { result } = renderHook(
      () => useCollaboratorDetailAdmin(null, null, null, [], 0),
      { wrapper }
    )

    expect(result.current.canChangePosition).toBe(false)
    expect(result.current.promotionOptions).toEqual([])
    expect(result.current.emailLockHint).toContain('Só o dono')
    expect(result.current.removalLockHint).toContain('Só o dono')
  })
})
