import type { ReactNode } from 'react'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { OrderChannel } from '@shared/types/order/order-channel'

import { KitchenColumn } from './KitchenColumn'
import {
  acceptedOrderMock,
  kitchenColumnMock,
  kitchenFinishedColumnMock,
  readyForPickupOrderMock,
} from './KitchenColumn.mock'

vi.mock('@dnd-kit/core', () => ({
  useDroppable: () => ({ isOver: false, setNodeRef: vi.fn() }),
}))
vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: ReactNode }) => children,
  rectSortingStrategy: vi.fn(),
}))
vi.mock('./DraggableOrder/DraggableOrder', () => ({
  DraggableOrder: ({ children }: { children: ReactNode }) => children,
}))

const columnProps = {
  activeOrder: null,
  advancingOrderId: undefined,
  isAdvancing: false,
  isChangingKitchenAssignee: false,
  changingKitchenOrderId: undefined,
  isPending: false,
  onAdvanceOrder: vi.fn(),
  onChangeKitchenAssignee: vi.fn(),
  onOpenOrderDetails: vi.fn(),
  preparationMinutes: undefined,
  salesFormats: ['DELIVERY', 'PICKUP'] satisfies OrderChannel[],
  staff: [],
}

describe(KitchenColumn.name, () => {
  it('renders the stage title, count, and empty state', () => {
    render(
      <KitchenColumn {...kitchenColumnMock} {...columnProps} orders={[]} />
    )

    expect(
      screen.getByRole('region', { name: 'Aguardando preparo' })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Nenhum pedido aguardando preparo.')
    ).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('does not offer a way back after the order leaves the kitchen', () => {
    render(
      <KitchenColumn
        {...kitchenFinishedColumnMock}
        {...columnProps}
        orders={[readyForPickupOrderMock]}
      />
    )

    expect(
      screen.queryByRole('button', { name: 'Voltar para o preparo' })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Cliente retirou' })
    ).not.toBeInTheDocument()
  })

  it('marks its full region as a valid drop target when reordering', () => {
    render(
      <KitchenColumn
        {...kitchenColumnMock}
        {...columnProps}
        activeOrder={acceptedOrderMock}
        orders={[acceptedOrderMock]}
      />
    )

    expect(
      screen.getByRole('region', { name: 'Aguardando preparo' })
    ).toHaveAttribute('data-drop-valid', 'true')
  })

  it('keeps counts and cards as skeletons while orders are pending', () => {
    const { container } = render(
      <KitchenColumn
        {...kitchenColumnMock}
        {...columnProps}
        isPending
        orders={[]}
      />
    )

    expect(screen.queryByText('0')).not.toBeInTheDocument()
    expect(
      container.querySelectorAll('[aria-hidden="true"]').length
    ).toBeGreaterThan(0)
  })

  it('marks a forbidden destination as an invalid drop target', () => {
    render(
      <KitchenColumn
        {...kitchenColumnMock}
        {...columnProps}
        activeOrder={readyForPickupOrderMock}
        orders={[]}
      />
    )

    expect(
      screen.getByRole('region', { name: 'Aguardando preparo' })
    ).toHaveAttribute('data-drop-valid', 'false')
  })
})
