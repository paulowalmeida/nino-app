import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useOrderDetailFacade } from '@pages/OrderDetail/facades/useOrderDetailFacade/useOrderDetailFacade'

import { OrderActions } from './OrderActions'
import { acceptStepMock, pendingOrderMock } from './OrderActions.mock'

vi.mock('@pages/OrderDetail/facades/useOrderDetailFacade/useOrderDetailFacade')
vi.mock(
  '@pages/OrderDetail/components/OrderDetailAside/OrderActions/OrderCancelForm/OrderCancelForm',
  () => ({
    OrderCancelForm: ({
      onCancelled,
      onDismiss,
    }: {
      onCancelled: () => void
      onDismiss: () => void
    }) => (
      <div>
        <button type="button" onClick={onCancelled}>
          cancel form
        </button>
        <button type="button" onClick={onDismiss}>
          dismiss form
        </button>
      </div>
    ),
  })
)

const advanceOrder = vi.fn()

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useOrderDetailFacade).mockReturnValue({
    order: pendingOrderMock,
    nextStep: acceptStepMock,
    canAdvance: true,
    canCancelOrder: true,
    advanceOrder,
    isAdvancing: false,
    ...overrides,
  } as unknown as ReturnType<typeof useOrderDetailFacade>)

describe('OrderActions', () => {
  beforeEach(() => vi.clearAllMocks())

  it('requires the consumer code and submits it to confirm pickup', async () => {
    facadeWith({
      order: { ...pendingOrderMock, channel: 'PICKUP', pickupCode: '012345' },
      nextStep: { label: 'Confirmar retirada', target: 'COMPLETED' },
    })
    render(<OrderActions />)
    const confirm = screen.getByRole('button', { name: 'Confirmar retirada' })
    expect(confirm).toBeDisabled()
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Código de retirada' }),
      '012345'
    )
    await userEvent.click(confirm)
    expect(advanceOrder).toHaveBeenCalledWith({
      orderId: pendingOrderMock.id,
      status: 'COMPLETED',
      pickupCode: '012345',
    })
  })

  it('names the stage the order goes to next', async () => {
    facadeWith({})

    render(<OrderActions />)
    await userEvent.click(
      screen.getByRole('button', { name: acceptStepMock.label })
    )

    expect(advanceOrder).toHaveBeenCalledWith({
      orderId: pendingOrderMock.id,
      status: acceptStepMock.target,
    })
  })

  it('asks for the reason only after the attendant chooses to cancel', async () => {
    facadeWith({})

    render(<OrderActions />)
    expect(screen.queryByText('cancel form')).not.toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', { name: 'Cancelar pedido' })
    )

    expect(screen.getByText('cancel form')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Cancelar pedido' })
    ).not.toBeInTheDocument()
  })

  it('closes the reason box once the order is cancelled', async () => {
    facadeWith({})

    render(<OrderActions />)
    await userEvent.click(
      screen.getByRole('button', { name: 'Cancelar pedido' })
    )
    await userEvent.click(screen.getByRole('button', { name: 'cancel form' }))

    expect(screen.queryByText('cancel form')).not.toBeInTheDocument()
  })

  it('closes the reason box when the attendant gives up', async () => {
    facadeWith({})

    render(<OrderActions />)
    await userEvent.click(
      screen.getByRole('button', { name: 'Cancelar pedido' })
    )
    await userEvent.click(screen.getByRole('button', { name: 'dismiss form' }))

    expect(screen.queryByText('cancel form')).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Cancelar pedido' })
    ).toBeInTheDocument()
  })

  it('offers no advance when the policy closed it', () => {
    facadeWith({ canAdvance: false, nextStep: null })

    render(<OrderActions />)

    expect(
      screen.queryByRole('button', { name: acceptStepMock.label })
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Cancelar pedido' })
    ).toBeInTheDocument()
  })

  it('disappears when the order accepts no action at all', () => {
    facadeWith({ canAdvance: false, nextStep: null, canCancelOrder: false })

    const { container } = render(<OrderActions />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing while the order is unknown', () => {
    facadeWith({ order: undefined })

    const { container } = render(<OrderActions />)

    expect(container).toBeEmptyDOMElement()
  })
})
