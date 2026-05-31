import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './Table'

function Sample() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Preço</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Pão</TableCell>
          <TableCell>R$ 5</TableCell>
        </TableRow>
        <TableRow data-selected>
          <TableCell>Bolo</TableCell>
          <TableCell>R$ 30</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

describe('Table', () => {
  it('renders headers and cells', () => {
    render(<Sample />)
    expect(screen.getByText('Nome')).toBeInTheDocument()
    expect(screen.getByText('R$ 30')).toBeInTheDocument()
  })

  it('renders the table structure (table/columnheader/cell)', () => {
    render(<Sample />)
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getAllByRole('columnheader')).toHaveLength(2)
    expect(screen.getAllByRole('row')).toHaveLength(3)
  })

  it('applies selected state to the row', () => {
    render(<Sample />)
    const selected = screen.getByText('Bolo').closest('tr')
    expect(selected).toHaveAttribute('data-selected')
  })

  it('merges additional className on the cell', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className='text-right'>x</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(screen.getByText('x')).toHaveClass('text-right')
  })
})
