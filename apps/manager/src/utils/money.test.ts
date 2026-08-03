import { describe, expect, it } from 'vitest'

import { brl } from './money'

/* Intl.NumberFormat separa "R$" do valor com um espaço fino (NBSP), não o
   espaço comum — casar por dígitos evita o teste quebrar por causa disso. */
const hasAmount = (text: string, digits: string) =>
  expect(text.replace(/\s/g, ' ')).toBe(`R$ ${digits}`)

describe('brl', () => {
  it('formats a number as BRL', () => {
    hasAmount(brl(56.8), '56,80')
  })

  it('parses a decimal string, as money arrives from the API', () => {
    hasAmount(brl('56.80'), '56,80')
  })

  it('formats zero, not the fallback', () => {
    hasAmount(brl(0), '0,00')
  })

  /*
   * Um campo ausente (skew de deploy, contrato mudou) não pode virar "R$ NaN"
   * na tela — isso é pior que um erro: parece um valor real.
   */
  it('shows a dash instead of "NaN" for a missing value', () => {
    expect(brl(undefined)).toBe('—')
  })

  it('shows a dash instead of "NaN" for null', () => {
    expect(brl(null)).toBe('—')
  })

  it('shows a dash for a string that is not a number', () => {
    expect(brl('não é dinheiro')).toBe('—')
  })
})
