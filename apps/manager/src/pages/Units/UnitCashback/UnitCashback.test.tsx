import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { UnitCashback } from './UnitCashback'
import { unitCashbackMock } from './UnitCashback.mock'

vi.mock(
  '@pages/Units/facades/useUnitCashbackFacade/useUnitCashbackFacade',
  () => ({
    useUnitCashbackFacade: () => ({
      query: { data: unitCashbackMock.settings, isPending: false },
      save: { mutate: vi.fn(), isPending: false },
    }),
  })
)
vi.mock('./CashbackRules/CashbackRules', () => ({
  CashbackRules: () => <div>cashback rules</div>,
}))

describe(UnitCashback.name, () => {
  it('hands the settings of the unit to the rules form', () => {
    render(<UnitCashback />)

    expect(screen.getByText('cashback rules')).toBeInTheDocument()
  })
})
