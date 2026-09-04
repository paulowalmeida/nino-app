import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { counterHeaderMock } from './CounterHeader.mock'
import { CounterHeader } from './CounterHeader'

describe('CounterHeader', () => {
  it('renders the counter heading and description', () => {
    render(<CounterHeader />)
    expect(
      screen.getByRole('heading', { name: counterHeaderMock.title })
    ).toBeInTheDocument()
    expect(screen.getByText(/Monte o pedido/)).toBeInTheDocument()
  })
})
