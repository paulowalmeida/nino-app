import { MemoryRouter } from 'react-router'

import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useNewOrderSubmission } from '@pages/NewOrder/hooks/useNewOrderSubmission/useNewOrderSubmission'

import { useNewOrderPlacement } from './useNewOrderPlacement'
import {
  placedOrderIdMock,
  placementDraftMock,
} from './useNewOrderPlacement.mock'

const navigate = vi.fn()

vi.mock('react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router')>()),
  useNavigate: () => navigate,
}))
vi.mock('@pages/NewOrder/hooks/useNewOrderSubmission/useNewOrderSubmission')

const submit = vi.fn()

describe('useNewOrderPlacement', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useNewOrderSubmission).mockReturnValue({
      failed: false,
      isSubmitting: false,
      submit,
    } as unknown as ReturnType<typeof useNewOrderSubmission>)
  })

  it('sends the ticket with the payment the availability settled', async () => {
    submit.mockResolvedValue(placedOrderIdMock)
    const { result } = renderHook(
      () => useNewOrderPlacement('unit-1', placementDraftMock, 'PIX'),
      { wrapper: MemoryRouter }
    )

    await act(() => result.current.placeOrder())

    expect(submit).toHaveBeenCalledWith({
      lines: placementDraftMock.lines,
      channel: placementDraftMock.channel,
      paymentMethod: 'PIX',
      recipient: placementDraftMock.recipient,
      notes: placementDraftMock.notes,
    })
  })

  it('opens the order it just created', async () => {
    submit.mockResolvedValue(placedOrderIdMock)
    const { result } = renderHook(
      () => useNewOrderPlacement('unit-1', placementDraftMock, 'CASH'),
      { wrapper: MemoryRouter }
    )

    await act(() => result.current.placeOrder())

    expect(navigate).toHaveBeenCalledWith(`../${placedOrderIdMock}`, {
      relative: 'path',
    })
  })

  it('keeps the attendant on the ticket when the order fails', async () => {
    submit.mockResolvedValue(null)
    const { result } = renderHook(
      () => useNewOrderPlacement('unit-1', placementDraftMock, 'CASH'),
      { wrapper: MemoryRouter }
    )

    await act(() => result.current.placeOrder())

    expect(navigate).not.toHaveBeenCalled()
  })
})
