import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { AppLayoutHeader } from './AppLayoutHeader'
import { appLayoutHeaderMock } from './AppLayoutHeader.mock'

vi.mock('./StoreSwitcher/StoreSwitcher', () => ({
  StoreSwitcher: () => <span>Loja Centro</span>,
}))
vi.mock('./UserMenu/UserMenu', () => ({ UserMenu: () => null }))
vi.mock('@shared/components/NinoLogo/NinoLogo', () => ({ NinoLogo: () => null }))

describe('AppLayoutHeader', () => {
  it('opens the drawer and the feature search', async () => {
    const user = userEvent.setup()
    const onOpenMenu = vi.fn()
    const onOpenCommandPalette = vi.fn()

    render(
      <AppLayoutHeader
        {...appLayoutHeaderMock}
        onOpenMenu={onOpenMenu}
        onOpenCommandPalette={onOpenCommandPalette}
      />
    )

    expect(screen.getByText('Loja Centro')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Abrir menu' }))
    await user.click(
      screen.getByRole('button', { name: 'Buscar funcionalidade' })
    )

    expect(onOpenMenu).toHaveBeenCalledOnce()
    expect(onOpenCommandPalette).toHaveBeenCalledOnce()
  })
})
