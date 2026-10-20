import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SettingsPaymentSection } from './SettingsPaymentSection'

vi.mock('../../facades/useSettingsFacade/useSettingsFacade', () => ({
  useSettingsFacade: () => ({
    service: {
      query: { data: undefined, isPending: false },
      save: { mutate: vi.fn(), isPending: false },
    },
    cashback: { save: { mutate: vi.fn(), isPending: false } },
  }),
}))

vi.mock('./PaymentRules/PaymentRules', () => ({
  PaymentRules: () => <div>payment settings</div>,
}))

vi.mock('./CashbackRules/CashbackRules', () => ({
  CashbackRules: () => <div>cashback settings</div>,
}))

describe(SettingsPaymentSection.name, () => {
  it('renders payment settings followed by the cashback rules', () => {
    render(<SettingsPaymentSection />)

    expect(screen.getByText('payment settings')).toBeInTheDocument()
    expect(screen.getByText('cashback settings')).toBeInTheDocument()
  })
})
