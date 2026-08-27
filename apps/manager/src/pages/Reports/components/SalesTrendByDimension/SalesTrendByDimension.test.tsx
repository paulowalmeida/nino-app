import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SalesTrendByDimension } from './SalesTrendByDimension'

describe('SalesTrendByDimension', () => {
  it('shows the empty dimension state', () => {
    render(<SalesTrendByDimension title="Por canal" breakdown={undefined} isPending={false} labelOf={(key) => key} emptyMessage="Sem vendas" />)
    expect(screen.getByText('Sem vendas')).toBeInTheDocument()
  })
})
