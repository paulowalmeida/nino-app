import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SaleFinishActions } from './SaleFinishActions'
import { saleFinishActionsMock } from './SaleFinishActions.mock'

vi.mock('@nino/ds/components/Dialog', () => ({
  Dialog: ({
    open,
    onConfirm,
    onCancel,
    onOpenChange,
  }: {
    open: boolean
    onConfirm: () => void
    onCancel: () => void
    onOpenChange: (open: boolean) => void
  }) =>
    open ? (
      <div>
        <button onClick={onConfirm}>confirm-clear</button>
        <button onClick={onCancel}>cancel-clear</button>
        <button onClick={() => onOpenChange(false)}>dismiss-clear</button>
      </div>
    ) : null,
}))

describe(SaleFinishActions.name, () => {
  it('requires confirmation before finishing a cash payment', () => {
    const onFinish = vi.fn()
    render(
      <SaleFinishActions
        {...saleFinishActionsMock}
        isCash
        error={null}
        isSending={false}
        onFinish={onFinish}
        onClear={vi.fn()}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Concluir pedido' }))
    expect(onFinish).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'confirm-clear' }))
    expect(onFinish).toHaveBeenCalledOnce()
  })

  it('does not finish cash payment when confirmation is cancelled', () => {
    const onFinish = vi.fn()
    render(
      <SaleFinishActions
        {...saleFinishActionsMock}
        isCash
        error={null}
        isSending={false}
        onFinish={onFinish}
        onClear={vi.fn()}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Concluir pedido' }))
    fireEvent.click(screen.getByRole('button', { name: 'cancel-clear' }))
    expect(onFinish).not.toHaveBeenCalled()
  })
  it('finishes and confirms clearing a sale', () => {
    const onFinish = vi.fn()
    const onClear = vi.fn()
    render(
      <SaleFinishActions
        {...saleFinishActionsMock}
        error={null}
        isSending={false}
        onFinish={onFinish}
        onClear={onClear}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Concluir pedido' }))
    fireEvent.click(screen.getByRole('button', { name: 'Limpar Pedido' }))
    fireEvent.click(screen.getByRole('button', { name: 'confirm-clear' }))
    expect(onFinish).toHaveBeenCalledOnce()
    expect(onClear).toHaveBeenCalledOnce()
  })

  it('shows unavailable payment and sale errors', () => {
    render(
      <SaleFinishActions
        {...saleFinishActionsMock}
        isPaymentAvailable={false}
        error="Falhou"
        isSending={false}
        onFinish={vi.fn()}
        onClear={vi.fn()}
      />
    )
    expect(screen.getByText(/Nenhum método/)).toBeInTheDocument()
    expect(screen.getByText('Falhou')).toBeInTheDocument()
  })

  it('does not show clear action without lines', () => {
    render(
      <SaleFinishActions
        {...saleFinishActionsMock}
        hasLines={false}
        error={null}
        isSending={false}
        onFinish={vi.fn()}
        onClear={vi.fn()}
      />
    )
    expect(
      screen.queryByRole('button', { name: 'Limpar Pedido' })
    ).not.toBeInTheDocument()
  })

  it('closes the clear dialog when dismissed', () => {
    render(
      <SaleFinishActions
        {...saleFinishActionsMock}
        error={null}
        isSending={false}
        onFinish={vi.fn()}
        onClear={vi.fn()}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Limpar Pedido' }))
    fireEvent.click(screen.getByRole('button', { name: 'dismiss-clear' }))
    expect(
      screen.queryByRole('button', { name: 'confirm-clear' })
    ).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Limpar Pedido' }))
    fireEvent.click(screen.getByRole('button', { name: 'cancel-clear' }))
  })

  it('uses the bare footer layout', () => {
    render(
      <SaleFinishActions
        {...saleFinishActionsMock}
        bare
        error={null}
        isSending={false}
        onFinish={vi.fn()}
        onClear={vi.fn()}
      />
    )
    expect(screen.getByText('R$ 25,00')).toBeInTheDocument()
  })
})
