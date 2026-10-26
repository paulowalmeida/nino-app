import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { toast } from '@nino/ds/components/Toast'
import { StaffService } from '@shared/services/staff/staff.service'

import { useInvite } from './useInvite'
import { inviteHookMock } from './useInvite.mock'

vi.mock('@nino/ds/components/Toast', () => ({ toast: { success: vi.fn() } }))
vi.mock('@shared/services/staff/staff.service', () => ({
  StaffService: { sendInvite: vi.fn() },
}))

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: new QueryClient() }, children)

describe(useInvite.name, () => {
  it('sends an invite for the selected unit', async () => {
    vi.mocked(StaffService.sendInvite).mockResolvedValue(undefined as never)
    const { result } = renderHook(() => useInvite(inviteHookMock.unitId), {
      wrapper,
    })
    await result.current.mutateAsync(inviteHookMock.data)
    expect(StaffService.sendInvite).toHaveBeenCalledWith(
      inviteHookMock.unitId,
      inviteHookMock.data
    )
    expect(toast.success).toHaveBeenCalledWith(
      `Convite enviado para ${inviteHookMock.data.email}`
    )
  })
})
