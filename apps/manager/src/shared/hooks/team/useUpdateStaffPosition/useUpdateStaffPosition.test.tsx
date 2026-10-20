import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { StaffService } from '@shared/services/staff/staff.service'

import { useUpdateStaffPosition } from './useUpdateStaffPosition'
import { updateStaffPositionMock } from './useUpdateStaffPosition.mock'

vi.mock('@shared/services/staff/staff.service', () => ({
  StaffService: { updateStaffPosition: vi.fn() },
}))

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: new QueryClient() }, children)

describe(useUpdateStaffPosition.name, () => {
  it('moves the selected member to the chosen cargo', async () => {
    vi.mocked(StaffService.updateStaffPosition).mockResolvedValue(
      undefined as never
    )
    const { result } = renderHook(
      () => useUpdateStaffPosition(updateStaffPositionMock.unitId),
      { wrapper }
    )

    await result.current.mutateAsync({
      userId: updateStaffPositionMock.userId,
      positionId: updateStaffPositionMock.positionId,
    })

    expect(StaffService.updateStaffPosition).toHaveBeenCalledWith(
      updateStaffPositionMock.unitId,
      updateStaffPositionMock.userId,
      updateStaffPositionMock.positionId
    )
  })
})
