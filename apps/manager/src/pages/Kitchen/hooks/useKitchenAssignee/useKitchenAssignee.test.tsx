import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { OrderService } from '@shared/services/order/order.service'
import type { Order } from '@shared/types/order/order'

import { useKitchenAssignee } from './useKitchenAssignee'
import { kitchenAssigneeMock } from './useKitchenAssignee.mock'

vi.mock('@shared/services/order/order.service', () => ({
  OrderService: {
    assignKitchenAssignee: vi.fn(),
    clearKitchenAssignee: vi.fn(),
  },
}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
)

describe(useKitchenAssignee.name, () => {
  it('assigns the selected staff member and refreshes order lists', async () => {
    vi.mocked(OrderService.assignKitchenAssignee).mockResolvedValue(
      {} as unknown as Order
    )
    const { result } = renderHook(
      () => useKitchenAssignee(kitchenAssigneeMock.unitId),
      { wrapper }
    )

    await act(() => result.current.mutateAsync(kitchenAssigneeMock))

    expect(OrderService.assignKitchenAssignee).toHaveBeenCalledWith(
      kitchenAssigneeMock.unitId,
      kitchenAssigneeMock.orderId,
      { kitchenAssigneeId: kitchenAssigneeMock.kitchenAssigneeId }
    )
  })

  it('removes the assignment when no staff member is selected', async () => {
    vi.mocked(OrderService.clearKitchenAssignee).mockResolvedValue(
      {} as unknown as Order
    )
    const { result } = renderHook(
      () => useKitchenAssignee(kitchenAssigneeMock.unitId),
      { wrapper }
    )

    await act(() =>
      result.current.mutateAsync({
        orderId: kitchenAssigneeMock.orderId,
        kitchenAssigneeId: null,
      })
    )

    await waitFor(() => {
      expect(OrderService.clearKitchenAssignee).toHaveBeenCalledWith(
        kitchenAssigneeMock.unitId,
        kitchenAssigneeMock.orderId
      )
    })
  })
})
