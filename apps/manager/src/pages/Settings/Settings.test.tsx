import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Settings } from './Settings'

vi.mock('react-router', () => ({
  Outlet: () => <div>settings outlet</div>,
  useLocation: () => ({ pathname: '/configuracoes' }),
}))

describe(Settings.name, () => {
  it('renders the active settings route outlet', () => {
    render(<Settings />)
    expect(screen.getByText('settings outlet')).toBeInTheDocument()
  })
})
