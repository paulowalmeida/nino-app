import { describe, expect, it } from 'vitest'

import { brl } from '@shared/utils/money/money'

import { counterPrintedRows } from './counterPrintedRows'
import {
  deliveryRecipientMock,
  emptyRecipientMock,
} from './counterPrintedRows.mock'

describe(counterPrintedRows.name, () => {
  it('prints nothing before a destination is chosen', () => {
    expect(
      counterPrintedRows({
        channel: null,
        consumerName: 'Ana',
        tableNumber: '',
        recipient: emptyRecipientMock,
        method: null,
        changeFor: '',
        changeAmount: 0,
      })
    ).toEqual([])
  })

  it('prints table and name together for a local order', () => {
    // Act
    const rows = counterPrintedRows({
      channel: 'COUNTER',
      consumerName: 'Ana',
      tableNumber: '12',
      recipient: emptyRecipientMock,
      method: null,
      changeFor: '',
      changeAmount: 0,
    })

    // Assert
    expect(rows.at(-1)).toEqual({
      label: 'Identificação',
      value: 'Mesa 12 · Ana',
    })
  })

  it('prints who receives and the address for a delivery', () => {
    // Act
    const rows = counterPrintedRows({
      channel: 'DELIVERY',
      consumerName: 'Ana',
      tableNumber: '',
      recipient: deliveryRecipientMock,
      method: null,
      changeFor: '',
      changeAmount: 0,
    })

    // Assert
    expect(rows.map(({ label }) => label)).toEqual([
      'Como sai',
      'Quem recebe',
      'Endereço',
    ])
    expect(rows.at(-1)?.value).toBe('Rua Ó de Almeida, 42 — apto 301, Campina')
  })

  it('prints who picks the order up at the counter', () => {
    // Act
    const rows = counterPrintedRows({
      channel: 'PICKUP',
      consumerName: 'Ana',
      tableNumber: '',
      recipient: emptyRecipientMock,
      method: null,
      changeFor: '',
      changeAmount: 0,
    })

    // Assert
    expect(rows.at(-1)).toEqual({ label: 'Chamar por', value: 'Ana' })
  })

  it('prints the pickup phone alongside the name', () => {
    const rows = counterPrintedRows({
      channel: 'PICKUP',
      consumerName: 'Ana',
      tableNumber: '',
      recipient: { ...emptyRecipientMock, phone: '(91) 98888-0000' },
      method: null,
      changeFor: '',
      changeAmount: 0,
    })

    expect(rows.at(-1)).toEqual({
      label: 'Chamar por',
      value: 'Ana · (91) 98888-0000',
    })
  })

  it('prints the change alongside a cash payment', () => {
    // Act
    const rows = counterPrintedRows({
      channel: 'PICKUP',
      consumerName: 'Ana',
      tableNumber: '',
      recipient: emptyRecipientMock,
      method: 'CASH',
      changeFor: '50,00',
      changeAmount: 10,
    })

    // Assert
    expect(rows.at(-1)).toEqual({
      label: 'Pagamento',
      value: `Dinheiro · troco de ${brl(10)}`,
    })
  })

  it('prints a card paid to the courier', () => {
    // Act
    const rows = counterPrintedRows({
      channel: 'DELIVERY',
      consumerName: 'Ana',
      tableNumber: '',
      recipient: deliveryRecipientMock,
      method: 'CARD_ON_DELIVERY',
      changeFor: '',
      changeAmount: 0,
    })

    // Assert
    expect(rows.at(-1)).toEqual({
      label: 'Pagamento',
      value: 'Cartão na entrega',
    })
  })
})
