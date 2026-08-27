import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SalesBreakdown } from './SalesBreakdown'

describe('SalesBreakdown', () => {
  it('renders an empty breakdown', () => {
    render(<SalesBreakdown title="Por canal" items={[]} isPending={false} emptyMessage="Sem vendas" />)
    expect(screen.getByText('Sem vendas')).toBeInTheDocument()
  })
})
