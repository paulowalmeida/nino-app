import type { Meta, StoryObj } from '@storybook/react'

import { Badge } from '../Badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './Table'

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Table>

const pedidos = [
  { id: '#1234', cliente: 'Ana', total: 'R$ 48,00', status: 'success' as const, label: 'Entregue' },
  { id: '#1235', cliente: 'Bruno', total: 'R$ 12,50', status: 'warning' as const, label: 'Preparando' },
  { id: '#1236', cliente: 'Carla', total: 'R$ 90,00', status: 'error' as const, label: 'Cancelado' },
]

export const Default: Story = {
  render: () => (
    <div className='w-full'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pedido</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='text-right'>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pedidos.map((p) => (
            <TableRow key={p.id}>
              <TableCell className='font-medium'>{p.id}</TableCell>
              <TableCell>{p.cliente}</TableCell>
              <TableCell>
                <Badge variant={p.status}>{p.label}</Badge>
              </TableCell>
              <TableCell className='text-right'>{p.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
}
