import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { OrdersSkeleton } from './OrdersSkeleton'

describe('OrdersSkeleton', () => {
  it('announces the orders loading state', () => {
    render(<OrdersSkeleton />)

    expect(screen.getByLabelText('Carregando pedidos')).toBeInTheDocument()
  })
})
