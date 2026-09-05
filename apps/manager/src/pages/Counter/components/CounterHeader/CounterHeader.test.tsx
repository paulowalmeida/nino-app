import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CounterHeader } from './CounterHeader'
import { counterHeaderMock } from './CounterHeader.mock'

describe('CounterHeader', () => {
  it('renders the counter heading and description', () => {
    render(<CounterHeader />)
    expect(
      screen.getByRole('heading', { name: counterHeaderMock.title })
    ).toBeInTheDocument()
    expect(screen.getByText(/Monte o pedido/)).toBeInTheDocument()
  })
})
