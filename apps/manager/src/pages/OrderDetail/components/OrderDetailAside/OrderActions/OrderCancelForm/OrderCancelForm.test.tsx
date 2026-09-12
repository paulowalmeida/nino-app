import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useOrderDetailFacade } from '@pages/OrderDetail/facades/useOrderDetailFacade/useOrderDetailFacade'

import { OrderCancelForm } from './OrderCancelForm'
import { orderCancelFormMock } from './OrderCancelForm.mock'

vi.mock('@pages/OrderDetail/facades/useOrderDetailFacade/useOrderDetailFacade')

const cancelOrder = vi.fn()
const onCancelled = vi.fn()
const onDismiss = vi.fn()

const renderForm = () =>
  render(<OrderCancelForm onCancelled={onCancelled} onDismiss={onDismiss} />)

const typeReason = () =>
  userEvent.type(
    screen.getByLabelText(orderCancelFormMock.label),
    orderCancelFormMock.reason
  )

describe('OrderCancelForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useOrderDetailFacade).mockReturnValue({
      cancelOrder,
      isCancelling: false,
    } as unknown as ReturnType<typeof useOrderDetailFacade>)
  })

  it('demands a reason before cancelling', () => {
    renderForm()

    expect(
      screen.getByRole('button', { name: orderCancelFormMock.confirmLabel })
    ).toBeDisabled()
  })

  it('cancels the order with the reason the consumer will read', async () => {
    cancelOrder.mockResolvedValue(true)

    renderForm()
    await typeReason()
    await userEvent.click(
      screen.getByRole('button', { name: orderCancelFormMock.confirmLabel })
    )

    expect(cancelOrder).toHaveBeenCalledWith(orderCancelFormMock.reason)
    await waitFor(() => expect(onCancelled).toHaveBeenCalledOnce())
  })

  it('keeps the typed reason when the cancellation is refused', async () => {
    cancelOrder.mockResolvedValue(false)

    renderForm()
    await typeReason()
    await userEvent.click(
      screen.getByRole('button', { name: orderCancelFormMock.confirmLabel })
    )

    await waitFor(() => expect(cancelOrder).toHaveBeenCalledOnce())
    expect(onCancelled).not.toHaveBeenCalled()
    expect(screen.getByLabelText(orderCancelFormMock.label)).toHaveValue(
      orderCancelFormMock.reason
    )
  })

  it('gives up the cancellation without touching the order', async () => {
    renderForm()
    await userEvent.click(
      screen.getByRole('button', { name: orderCancelFormMock.dismissLabel })
    )

    expect(onDismiss).toHaveBeenCalledOnce()
    expect(cancelOrder).not.toHaveBeenCalled()
  })
})
