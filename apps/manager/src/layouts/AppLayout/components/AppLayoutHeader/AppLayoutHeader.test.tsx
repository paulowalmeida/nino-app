import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AppLayoutHeader } from './AppLayoutHeader'

describe('AppLayoutHeader', () => {
  it('shows the current store and exposes the menu action', () => {
    const onOpenMenu = vi.fn()
    render(<AppLayoutHeader tenantName="Loja Centro" onOpenMenu={onOpenMenu} />)

    expect(screen.getByText('Loja Centro')).toBeInTheDocument()
    screen.getByRole('button', { name: 'Abrir menu' }).click()
    expect(onOpenMenu).toHaveBeenCalledOnce()
  })
})
