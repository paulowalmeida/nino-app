import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router'

import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useRemoveMember } from '@shared/hooks/team/useRemoveMember/useRemoveMember'
import { useUpdateStaffEmail } from '@shared/hooks/team/useUpdateStaffEmail/useUpdateStaffEmail'
import { useUpdateStaffRole } from '@shared/hooks/team/useUpdateStaffRole/useUpdateStaffRole'
import { useSessionStore } from '@shared/states/session/session.state'

import { useCollaboratorDetailAdmin } from './useCollaboratorDetailAdmin'

vi.mock('@shared/states/session/session.state')
vi.mock('@shared/hooks/team/useRemoveMember/useRemoveMember')
vi.mock('@shared/hooks/team/useUpdateStaffEmail/useUpdateStaffEmail')
vi.mock('@shared/hooks/team/useUpdateStaffRole/useUpdateStaffRole')

const navigate = vi.fn()
vi.mock('react-router', async () => ({
  ...(await vi.importActual('react-router')),
  useNavigate: () => navigate,
}))

const member = { role: 'STAFF', user: { id: 'user-1' } }
const wrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
)

describe(useCollaboratorDetailAdmin.name, () => {
  it('exposes commands and owner permissions', async () => {
    const removeMember = vi.fn().mockResolvedValue(undefined)
    const updateEmail = vi.fn().mockResolvedValue(undefined)
    const changeRole = vi.fn()
    vi.mocked(useSessionStore).mockImplementation(
      (selector) => selector({ user: null } as never) as never
    )
    vi.mocked(useRemoveMember).mockReturnValue({
      mutateAsync: removeMember,
      isPending: false,
    } as never)
    vi.mocked(useUpdateStaffEmail).mockReturnValue({
      mutateAsync: updateEmail,
    } as never)
    vi.mocked(useUpdateStaffRole).mockReturnValue({
      mutate: changeRole,
      isPending: false,
    } as never)
    const { result } = renderHook(
      () =>
        useCollaboratorDetailAdmin('unit-1', 'UNIT_OWNER', member as never),
      { wrapper }
    )
    expect(result.current.roleLockHint).toBeUndefined()
    expect(result.current.emailLockHint).toBeUndefined()
    await act(() => result.current.saveEmail('ana@example.com'))
    act(() => result.current.changeRole('MANAGER'))
    await act(() => result.current.confirmRemoval())
    expect(updateEmail).toHaveBeenCalled()
    expect(changeRole).toHaveBeenCalled()
    expect(removeMember).toHaveBeenCalledWith({ id: 'user-1', kind: 'STAFF' })
    expect(navigate).toHaveBeenCalledWith('..')
  })

  it('reports permission and last-owner locks', () => {
    vi.mocked(useSessionStore).mockImplementation(
      (selector) => selector({ user: { id: 'signed-in' } } as never) as never
    )
    vi.mocked(useRemoveMember).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as never)
    vi.mocked(useUpdateStaffEmail).mockReturnValue({
      mutateAsync: vi.fn(),
    } as never)
    vi.mocked(useUpdateStaffRole).mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
    } as never)
    const { result } = renderHook(
      () =>
        useCollaboratorDetailAdmin('unit-1', 'STAFF', {
          role: 'UNIT_OWNER',
          user: { id: 'user-1' },
        } as never),
      { wrapper }
    )
    expect(result.current.roleLockHint).toContain('Só o dono')
    expect(result.current.emailLockHint).toContain('Só o dono')
    expect(result.current.removalLockHint).toContain('Só o dono')
  })

  it('locks changing your own role', () => {
    vi.mocked(useSessionStore).mockImplementation(
      (selector) => selector({ user: { id: 'user-1' } } as never) as never
    )
    vi.mocked(useRemoveMember).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as never)
    vi.mocked(useUpdateStaffEmail).mockReturnValue({
      mutateAsync: vi.fn(),
    } as never)
    vi.mocked(useUpdateStaffRole).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as never)
    const { result } = renderHook(
      () =>
        useCollaboratorDetailAdmin('unit-1', 'UNIT_OWNER', member as never),
      { wrapper }
    )
    expect(result.current.roleLockHint).toContain('Você não pode')
    expect(result.current.emailLockHint).toContain('próprio e-mail')
    expect(result.current.removalLockHint).toContain('não pode se remover')
  })

  it('locks identity changes and removal for another owner', () => {
    vi.mocked(useSessionStore).mockImplementation(
      (selector) => selector({ user: { id: 'owner-1' } } as never) as never
    )
    vi.mocked(useRemoveMember).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as never)
    vi.mocked(useUpdateStaffEmail).mockReturnValue({
      mutateAsync: vi.fn(),
    } as never)
    vi.mocked(useUpdateStaffRole).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as never)

    const { result } = renderHook(
      () =>
        useCollaboratorDetailAdmin('unit-1', 'UNIT_OWNER', {
          role: 'UNIT_OWNER',
          user: { id: 'owner-2' },
        } as never),
      { wrapper }
    )

    expect(result.current.emailLockHint).toContain('Rebaixe o dono')
    expect(result.current.removalLockHint).toContain('Rebaixe o dono')
  })

  it('keeps commands available while the collaborator data is absent', () => {
    vi.mocked(useSessionStore).mockImplementation(
      (selector) => selector({ user: null } as never) as never
    )
    vi.mocked(useRemoveMember).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as never)
    vi.mocked(useUpdateStaffEmail).mockReturnValue({
      mutateAsync: vi.fn(),
    } as never)
    vi.mocked(useUpdateStaffRole).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as never)
    const { result } = renderHook(
      () => useCollaboratorDetailAdmin(null, null, null),
      { wrapper }
    )
    expect(result.current.roleLockHint).toContain('Só o dono')
    expect(result.current.emailLockHint).toContain('Só o dono')
    expect(result.current.removalLockHint).toContain('Só o dono')
  })
})
