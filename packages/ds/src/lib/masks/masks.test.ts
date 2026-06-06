import { describe, expect, it } from 'vitest'

import { maskCnpj, maskCpf, maskPhone, onlyDigits } from './masks'

describe('masks', () => {
  it('onlyDigits strips non-digits', () => {
    expect(onlyDigits('(11) 98765-4321')).toBe('11987654321')
  })

  it('maskPhone formats a mobile number', () => {
    expect(maskPhone('11987654321')).toBe('(11) 98765-4321')
  })

  it('maskPhone formats a landline', () => {
    expect(maskPhone('1133224455')).toBe('(11) 3322-4455')
  })

  it('maskPhone caps at 11 digits', () => {
    expect(maskPhone('119876543219999')).toBe('(11) 98765-4321')
  })

  it('maskCpf formats progressively', () => {
    expect(maskCpf('123')).toBe('123')
    expect(maskCpf('123456')).toBe('123.456')
    expect(maskCpf('12345678901')).toBe('123.456.789-01')
  })

  it('maskCnpj formats fully', () => {
    expect(maskCnpj('12345678000199')).toBe('12.345.678/0001-99')
  })
})
