import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { Membership } from '@custom_types/auth/membership'
import { useCollaboratorAdmin } from '@hooks/team/useCollaboratorAdmin'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useRemoveMember } from '@hooks/team/useRemoveMember'
import { useUpdateStaffEmail } from '@hooks/team/useUpdateStaffEmail'
import { useUpdateStaffRole } from '@hooks/team/useUpdateStaffRole'
import { useSessionStore } from '@states/useSessionStore'

import {
  ownerToAdminister,
  staffToAdminister,
} from './useCollaboratorAdmin.mock'

const navigate = vi.fn()
const removeMember = vi.fn().mockResolvedValue(undefined)

vi.mock('react-router', () => ({ useNavigate: () => navigate }))
vi.mock('@hooks/session/useCurrentTenant')
vi.mock('@hooks/team/useRemoveMember')
vi.mock('@hooks/team/useUpdateStaffEmail')
vi.mock('@hooks/team/useUpdateStaffRole')
vi.mock('@states/useSessionStore')

const mutationDouble = (overrides = {}) =>
  ({
    mutate: vi.fn(),
    mutateAsync: vi.fn().mockResolvedValue(undefined),
    isPending: false,
    ...overrides,
  }) as unknown as ReturnType<typeof useUpdateStaffRole>

const signedInAs = (userId: string, role: Membership['role']) => {
  vi.mocked(useCurrentTenant).mockReturnValue({
    tenantId: 'tenant-1',
    role,
  } as Membership)
  vi.mocked(useSessionStore).mockImplementation(
    (selector) =>
      selector({ user: { id: userId } } as Parameters<typeof selector>[0]) as
        | string
        | undefined
  )
  vi.mocked(useUpdateStaffRole).mockReturnValue(mutationDouble())
  vi.mocked(useUpdateStaffEmail).mockReturnValue(
    mutationDouble() as unknown as ReturnType<typeof useUpdateStaffEmail>
  )
  vi.mocked(useRemoveMember).mockReturnValue(
    mutationDouble({ mutateAsync: removeMember }) as unknown as ReturnType<
      typeof useRemoveMember
    >
  )
}

describe(useCollaboratorAdmin.name, () => {
  it('lets the owner change the role of someone else', () => {
    // Arrange
    signedInAs('user-1', 'TENANT_OWNER')

    // Act
    const { result } = renderHook(() =>
      useCollaboratorAdmin(staffToAdminister)
    )

    // Assert
    expect(result.current.roleLockHint).toBeUndefined()
    expect(result.current.removalLockHint).toBeUndefined()
  })

  it('locks the role change for a manager looking at the screen', () => {
    // Arrange
    signedInAs('user-1', 'MANAGER')

    // Act
    const { result } = renderHook(() =>
      useCollaboratorAdmin(staffToAdminister)
    )

    // Assert
    expect(result.current.roleLockHint).toBe(
      'Só o dono da loja muda o cargo de alguém.'
    )
  })

  it('locks the role change when you are looking at yourself', () => {
    // Arrange
    signedInAs('user-2', 'TENANT_OWNER')

    // Act
    const { result } = renderHook(() =>
      useCollaboratorAdmin(staffToAdminister)
    )

    // Assert
    expect(result.current.roleLockHint).toBe(
      'Você não pode mudar o próprio cargo.'
    )
  })

  it('refuses to remove the owner, who would leave the store ownerless', () => {
    // Arrange
    signedInAs('user-1', 'TENANT_OWNER')

    // Act
    const { result } = renderHook(() =>
      useCollaboratorAdmin(ownerToAdminister)
    )

    // Assert
    expect(result.current.removalLockHint).toBe(
      'A loja precisa de um dono — passe o cargo antes.'
    )
  })

  it('goes back to the team list once the person is removed', async () => {
    // Arrange
    signedInAs('user-1', 'TENANT_OWNER')
    const { result } = renderHook(() =>
      useCollaboratorAdmin(staffToAdminister)
    )

    // Act
    await result.current.confirmRemoval()

    // Assert
    await waitFor(() =>
      expect(removeMember).toHaveBeenCalledWith({
        id: 'user-2',
        kind: 'STAFF',
      })
    )
    expect(navigate).toHaveBeenCalledWith('..')
  })
})
