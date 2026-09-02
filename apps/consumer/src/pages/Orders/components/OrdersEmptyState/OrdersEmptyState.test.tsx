import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { OrdersEmptyState } from './OrdersEmptyState'

describe('OrdersEmptyState', () => {
  it('explains where future orders will appear', () => {
    render(<OrdersEmptyState />)

    expect(
      screen.getByText(
        'Seus pedidos aparecem aqui assim que você fizer o primeiro.'
      )
    ).toBeInTheDocument()
  })
})
