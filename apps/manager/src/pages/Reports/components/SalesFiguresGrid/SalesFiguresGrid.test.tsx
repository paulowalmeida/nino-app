import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SalesFiguresGrid } from './SalesFiguresGrid'

describe('SalesFiguresGrid', () => {
  it('renders pending figures', () => {
    const { container } = render(<SalesFiguresGrid report={undefined} isPending />)
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })
})
