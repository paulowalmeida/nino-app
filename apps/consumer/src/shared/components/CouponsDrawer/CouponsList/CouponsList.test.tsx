import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

import { CouponsList } from './CouponsList'
import { listAvailableMock, listBlockedMock } from './CouponsList.mock'

const onOpen = vi.fn()
const onSubmit = vi.fn()

const renderList = (props: Partial<Parameters<typeof CouponsList>[0]> = {}) =>
  render(
    <CouponsList
      coupons={[listAvailableMock, listBlockedMock]}
      blockerOf={({ id }: PublicPromotion) =>
        id === listBlockedMock.id
          ? { kind: 'minimum', missing: 10, progress: 67 }
          : null
      }
      defaultTab="available"
      emptyAvailable="Nada disponível"
      emptyUnavailable="Nada indisponível"
      onOpen={onOpen}
      {...props}
    />
  )

describe('CouponsList', () => {
  beforeEach(() => vi.clearAllMocks())

  it('splits the coupons into available and unavailable tabs', () => {
    renderList()

    expect(
      screen.getByRole('tab', { name: 'Disponíveis (1)' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('tab', { name: 'Indisponíveis (1)' })
    ).toBeInTheDocument()
  })

  it('opens the detail of the tapped coupon', async () => {
    renderList()

    await userEvent.click(screen.getByRole('button', { name: /Cupom VOLTA10/ }))

    expect(onOpen).toHaveBeenCalledWith(listAvailableMock.id)
  })

  it('shows why an unavailable coupon does not apply, with progress', async () => {
    renderList({ defaultTab: 'unavailable' })

    expect(screen.getByText(/Faltam R\$\s10,00 para usar/)).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '67'
    )
  })

  it('explains an empty tab', () => {
    renderList({ coupons: [listBlockedMock] })

    expect(screen.getByText('Nada disponível')).toBeInTheDocument()
  })

  it('has no code field unless the owner applies by code', () => {
    renderList()

    expect(
      screen.queryByRole('textbox', { name: 'Código do cupom' })
    ).not.toBeInTheDocument()
  })

  it('sends the typed code in capitals when Enter is pressed', async () => {
    renderList({ codeForm: { onSubmit, isLoading: false } })

    await userEvent.type(
      screen.getByRole('textbox', { name: 'Código do cupom' }),
      'frete ja{Enter}'
    )

    expect(onSubmit).toHaveBeenCalledWith('FRETEJA')
  })

  it('shows the error of a rejected code', () => {
    renderList({
      codeForm: { onSubmit, isLoading: false, error: 'Código inválido' },
    })

    expect(screen.getByRole('alert')).toHaveTextContent('Código inválido')
  })
})
