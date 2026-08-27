import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TopSalesTable } from './TopSalesTable'

describe('TopSalesTable', () => {
  it('asks for dates before displaying the ranking', () => {
    render(<TopSalesTable awaitingDates isError={false} isPending={false} noSales={false} products={[]} />)
    expect(screen.getByText(/Escolha as datas/)).toBeInTheDocument()
  })
})
