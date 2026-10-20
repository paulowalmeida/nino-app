import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { UnitInfo } from './UnitInfo'
import { unitInfoMock } from './UnitInfo.mock'

const setMain = vi.fn()

let unit: { id: string; isMain: boolean } | undefined = unitInfoMock.unit

vi.mock('@pages/Units/facades/useUnitsFacade/useUnitsFacade', () => ({
  useUnitsFacade: () => ({
    units: {
      detail: { data: unit, isPending: false },
      save: { mutate: vi.fn(), isPending: false },
      setMain: { mutate: setMain, isPending: false },
    },
  }),
}))
vi.mock('@pages/Units/SettingsUnitDetailSection/UnitCard/UnitCard', () => ({
  UnitCard: ({ onSetMain }: { onSetMain: () => void }) => (
    <button onClick={onSetMain}>unit card</button>
  ),
}))

describe(UnitInfo.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('hands the unit of the session to the card', () => {
    render(<UnitInfo />)

    expect(screen.getByText('unit card')).toBeInTheDocument()
  })

  it('promotes the unit the card asked to promote', async () => {
    const { default: userEvent } = await import('@testing-library/user-event')
    render(<UnitInfo />)

    await userEvent.click(screen.getByText('unit card'))

    expect(setMain).toHaveBeenCalledWith(unitInfoMock.unit.id)
  })

  it('promotes nothing while the unit has not arrived', async () => {
    const { default: userEvent } = await import('@testing-library/user-event')
    unit = undefined
    render(<UnitInfo />)

    await userEvent.click(screen.getByText('unit card'))

    expect(setMain).not.toHaveBeenCalled()

    unit = unitInfoMock.unit
  })
})
