import { beforeEach, describe, expect, it, vi } from 'vitest'

import { brl } from '@shared/utils/money/money'

import { downloadSaleReceipt } from './downloadSaleReceipt'
import { cashReceiptMock, pixReceiptMock } from './downloadSaleReceipt.mock'

const setFont = vi.fn()
const text = vi.fn()
const save = vi.fn()

vi.mock('jspdf', () => ({
  jsPDF: class {
    setFont = setFont
    text = text
    save = save
  },
}))

const writtenLines = () => text.mock.calls.map(([line]) => line as string)

describe(downloadSaleReceipt.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('writes every item with its quantity and line total', () => {
    downloadSaleReceipt(cashReceiptMock)

    expect(writtenLines()).toContain('2x Café')
    expect(writtenLines()).toContain(`  ${brl(10)} = ${brl(20)}`)
  })

  it('writes the order number and the total', () => {
    downloadSaleReceipt(cashReceiptMock)

    expect(writtenLines()).toContain('#128')
    expect(writtenLines()).toContain(`Total: ${brl(20)}`)
  })

  it('writes the amount received and the change for a cash sale', () => {
    downloadSaleReceipt(cashReceiptMock)

    expect(writtenLines()).toContain(`Valor recebido: ${brl(50)}`)
    expect(writtenLines()).toContain(`Troco: ${brl(30)}`)
  })

  it('omits received amount and change for a non-cash sale', () => {
    downloadSaleReceipt(pixReceiptMock)

    expect(writtenLines()).not.toContain(`Valor recebido: ${brl(50)}`)
    expect(writtenLines()).not.toContain(`Troco: ${brl(30)}`)
  })

  it('saves the file named after the order number', () => {
    downloadSaleReceipt(cashReceiptMock)

    expect(save).toHaveBeenCalledWith('recibo-128.pdf')
  })
})
