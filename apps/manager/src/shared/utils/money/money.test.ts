import { describe, expect, it } from 'vitest'

import { brl, maskMoney, maskMoneyAmount, moneyValue } from './money'
import { moneyTypingMock } from './money.mock'

describe('brl', () => {
  it('formats a number as brazilian currency', () => {
    expect(brl(24.9)).toBe('R$ 24,90')
  })

  it('formats a numeric string as brazilian currency', () => {
    expect(brl('1299.9')).toBe('R$ 1.299,90')
  })

  it('shows a dash for null, undefined, and non-numeric values', () => {
    expect(brl(null)).toBe('—')
    expect(brl(undefined)).toBe('—')
    expect(brl('not a price')).toBe('—')
  })
})

describe('maskMoney', () => {
  it('fills the cents from right to left while someone types', () => {
    moneyTypingMock.forEach(({ typed, masked }) => {
      expect(maskMoney(typed)).toBe(masked)
    })
  })

  it('drops anything that is not a digit', () => {
    expect(maskMoney('R$ 12,34')).toBe('12,34')
  })

  it('stops growing at nine digits', () => {
    expect(maskMoney('12345678901')).toBe('1.234.567,89')
  })
})

describe('moneyValue', () => {
  it('reads back the number behind the mask', () => {
    expect(moneyValue('12.345,67')).toBe(12345.67)
    expect(moneyValue('50,00')).toBe(50)
  })

  it('reads an empty field as zero', () => {
    expect(moneyValue('')).toBe(0)
  })
})

describe('maskMoneyAmount', () => {
  it('writes a known amount the way the field shows it', () => {
    expect(maskMoneyAmount(50)).toBe('50,00')
    expect(maskMoneyAmount(2.1)).toBe('2,10')
    expect(maskMoneyAmount(1250)).toBe('1.250,00')
  })

  it('survives a float that does not land on the cent', () => {
    expect(maskMoneyAmount(0.1 + 0.2)).toBe('0,30')
  })
})
