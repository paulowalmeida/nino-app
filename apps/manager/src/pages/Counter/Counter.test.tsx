import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Counter } from './Counter'
import { counterPageMock } from './Counter.mock'

vi.mock('@pages/Counter/components/CounterHeader/CounterHeader', () => ({
  CounterHeader: () => <h1>Balcão</h1>,
}))
vi.mock('@pages/Counter/components/CounterWorkspace/CounterWorkspace', () => ({
  CounterWorkspace: () => <div>workspace</div>,
}))

describe(Counter.name, () => {
  it('renders the counter heading and workspace', () => {
    render(<Counter />)
    expect(
      screen.getByRole('heading', { name: counterPageMock.title })
    ).toBeInTheDocument()
    expect(screen.getByText('workspace')).toBeInTheDocument()
  })
})
