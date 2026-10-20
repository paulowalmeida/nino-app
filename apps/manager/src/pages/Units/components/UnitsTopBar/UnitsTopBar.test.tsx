import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { UnitsTopBar } from './UnitsTopBar'

const logout = vi.fn()
vi.mock('@pages/Units/facades/useUnitsFacade/useUnitsFacade', () => ({
  useUnitsFacade: () => ({ logout }),
}))
vi.mock('@shared/components/NinoLogo/NinoLogo', () => ({
  NinoLogo: () => <span>logo</span>,
}))

describe(UnitsTopBar.name, () => {
  it('logs out when the exit action is activated', async () => {
    const { userEvent } = await import('@testing-library/user-event')
    const user = userEvent.setup()
    render(<UnitsTopBar />)
    await user.click(screen.getByRole('button', { name: 'Sair' }))
    expect(logout).toHaveBeenCalledOnce()
  })
})
