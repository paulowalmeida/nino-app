import { describe, expect, it } from 'vitest'

import { isValidCnpj, isValidCpf } from './validators'

describe('validators', () => {
  it('isValidCpf accepts a valid CPF, masked or bare', () => {
    // Arrange / Act / Assert
    expect(isValidCpf('529.982.247-25')).toBe(true)
    expect(isValidCpf('52998224725')).toBe(true)
    expect(isValidCpf('111.444.777-35')).toBe(true)
  })

  it('isValidCpf rejects a wrong first check digit', () => {
    // Arrange / Act / Assert
    expect(isValidCpf('529.982.247-35')).toBe(false)
  })

  it('isValidCpf rejects a wrong second check digit', () => {
    // Arrange / Act / Assert
    expect(isValidCpf('529.982.247-26')).toBe(false)
  })

  it('isValidCpf accepts check digits that land on zero', () => {
    // Arrange
    const bothDigitsZero = '00000003700'

    // Act / Assert
    expect(isValidCpf(bothDigitsZero)).toBe(true)
  })

  it('isValidCpf rejects every repeated sequence, which the math accepts', () => {
    // Arrange / Act / Assert
    expect(isValidCpf('111.111.111-11')).toBe(false)
    expect(isValidCpf('000.000.000-00')).toBe(false)
    expect(isValidCpf('999.999.999-99')).toBe(false)
  })

  it('isValidCpf rejects values with the wrong length', () => {
    // Arrange / Act / Assert
    expect(isValidCpf('123.456.789')).toBe(false)
    expect(isValidCpf('529.982.247-250')).toBe(false)
  })

  it('isValidCpf rejects an empty or letters-only value', () => {
    // Arrange / Act / Assert
    expect(isValidCpf('')).toBe(false)
    expect(isValidCpf('abcdefghijk')).toBe(false)
  })

  it('isValidCnpj accepts a valid CNPJ, masked or bare', () => {
    // Arrange / Act / Assert
    expect(isValidCnpj('11.222.333/0001-81')).toBe(true)
    expect(isValidCnpj('11222333000181')).toBe(true)
  })

  it('isValidCnpj rejects a wrong first check digit', () => {
    // Arrange / Act / Assert
    expect(isValidCnpj('11.222.333/0001-91')).toBe(false)
  })

  it('isValidCnpj rejects a wrong second check digit', () => {
    // Arrange / Act / Assert
    expect(isValidCnpj('11.222.333/0001-82')).toBe(false)
  })

  it('isValidCnpj accepts check digits that land on zero', () => {
    // Arrange
    const bothDigitsZero = '00000009000100'

    // Act / Assert
    expect(isValidCnpj(bothDigitsZero)).toBe(true)
  })

  it('isValidCnpj rejects every repeated sequence', () => {
    // Arrange / Act / Assert
    expect(isValidCnpj('11.111.111/1111-11')).toBe(false)
    expect(isValidCnpj('00.000.000/0000-00')).toBe(false)
  })

  it('isValidCnpj rejects values with the wrong length', () => {
    // Arrange / Act / Assert
    expect(isValidCnpj('11.222.333/0001')).toBe(false)
    expect(isValidCnpj('11.222.333/0001-810')).toBe(false)
  })

  it('isValidCnpj rejects an empty or letters-only value', () => {
    // Arrange / Act / Assert
    expect(isValidCnpj('')).toBe(false)
    expect(isValidCnpj('abcdefghijklmn')).toBe(false)
  })
})
