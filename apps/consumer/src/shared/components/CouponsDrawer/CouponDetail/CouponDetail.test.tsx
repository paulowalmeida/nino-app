import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { CouponDetailAction } from '@custom_types/promotion/coupon-detail-action.type'
import type { CouponBlocker } from '@utils/coupon-blocker/coupon-blocker'

import { CouponDetail } from './CouponDetail'
import { detailPromotionMock } from './CouponDetail.mock'

const onBack = vi.fn()
const onSelect = vi.fn()
const applyAction: CouponDetailAction = {
  label: 'Aplicar cupom',
  disabledWhenBlocked: true,
  onSelect,
}

const renderDetail = ({
  blocker = null,
  isApplied = false,
  action = applyAction,
}: {
  blocker?: CouponBlocker | null
  isApplied?: boolean
  action?: CouponDetailAction
} = {}) =>
  render(
    <CouponDetail
      promotion={detailPromotionMock}
      blocker={blocker}
      zones={[]}
      isApplied={isApplied}
      action={action}
      backRef={null}
      onBack={onBack}
    />
  )

describe('CouponDetail', () => {
  beforeEach(() => vi.clearAllMocks())

  it('leads with the benefit and the code', () => {
    renderDetail()

    expect(
      screen.getByRole('heading', { name: /de desconto/ })
    ).toBeInTheDocument()
    expect(screen.getByDisplayValue('XTUDO10')).toBeInTheDocument()
    expect(screen.getByText('Disponível para sua sacola')).toBeInTheDocument()
  })

  it('walks the customer through the steps and lists the conditions', () => {
    renderDetail()

    expect(screen.getByText('Adicione X-Tudo à sacola')).toBeInTheDocument()
    expect(screen.getByText('Pedido mínimo')).toBeInTheDocument()
    expect(screen.getByText('Só no primeiro pedido')).toBeInTheDocument()
    expect(screen.getByText('Até 31/12/2099')).toBeInTheDocument()
  })

  it('shows how much is missing, with progress, and disables the action', () => {
    renderDetail({ blocker: { kind: 'minimum', missing: 10, progress: 67 } })

    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '67'
    )
    expect(screen.getByRole('button', { name: 'Aplicar cupom' })).toBeDisabled()
    expect(screen.getAllByText(/Faltam R\$\s10,00 para usar/)).toHaveLength(2)
  })

  it('applies from the footer when nothing blocks', async () => {
    renderDetail()

    await userEvent.click(screen.getByRole('button', { name: 'Aplicar cupom' }))

    expect(onSelect).toHaveBeenCalledWith(detailPromotionMock)
  })

  it('keeps the action enabled when the owner does not apply coupons', () => {
    renderDetail({
      blocker: { kind: 'minimum', missing: 10, progress: 67 },
      action: { label: 'Ver cardápio', disabledWhenBlocked: false, onSelect },
    })

    expect(screen.getByRole('button', { name: 'Ver cardápio' })).toBeEnabled()
  })

  it('says the coupon is already applied', () => {
    renderDetail({ isApplied: true })

    expect(
      screen.getByRole('button', { name: 'Cupom aplicado' })
    ).toBeDisabled()
  })

  it('goes back to the list', async () => {
    renderDetail()

    await userEvent.click(screen.getByRole('button', { name: 'Cupons' }))

    expect(onBack).toHaveBeenCalled()
  })
})
