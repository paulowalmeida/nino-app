import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { CourierService } from '@shared/services/courier/courier.service'
import { StaffService } from '@shared/services/staff/staff.service'

import { useRemoveMember } from './useRemoveMember'
import {
  courierMemberIdMock,
  removeMemberUnitIdMock,
  staffMemberIdMock,
} from './useRemoveMember.mock'

vi.mock('@shared/services/courier/courier.service', () => ({
  CourierService: { removeCourier: vi.fn() },
}))
vi.mock('@shared/services/staff/staff.service', () => ({
  StaffService: { removeStaff: vi.fn() },
}))

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(
    QueryClientProvider,
    { client: new QueryClient() },
    children
  )

describe(useRemoveMember.name, () => {
  afterEach(() => vi.clearAllMocks())

  it('removes a courier through the courier endpoint', async () => {
    const { result } = renderHook(() => useRemoveMember(removeMemberUnitIdMock), {
      wrapper,
    })

    await result.current.mutateAsync({ id: courierMemberIdMock, kind: 'COURIER' })

    await waitFor(() =>
      expect(CourierService.removeCourier).toHaveBeenCalledWith(
        removeMemberUnitIdMock,
        courierMemberIdMock
      )
    )
    expect(StaffService.removeStaff).not.toHaveBeenCalled()
  })

  it('removes a staff member through the staff endpoint', async () => {
    const { result } = renderHook(() => useRemoveMember(removeMemberUnitIdMock), {
      wrapper,
    })

    await result.current.mutateAsync({ id: staffMemberIdMock, kind: 'STAFF' })

    expect(StaffService.removeStaff).toHaveBeenCalledWith(
      removeMemberUnitIdMock,
      staffMemberIdMock
    )
    expect(CourierService.removeCourier).not.toHaveBeenCalled()
  })
})
