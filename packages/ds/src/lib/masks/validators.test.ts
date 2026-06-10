import { describe, expect, it } from 'vitest'

import { isValidCnpj, isValidCpf } from './validators'

describe('validators', () => {
  it('isValidCpf accepts a valid CPF', () => {
    expect(isValidCpf('529.982.247-25')).toBe(true)
  })

  it('isValidCpf rejects a wrong check digit', () => {
    expect(isValidCpf('529.982.247-26')).toBe(false)
  })

  it('isValidCpf rejects repeated sequences', () => {
    expect(isValidCpf('111.111.111-11')).toBe(false)
  })

  it('isValidCpf rejects values with the wrong length', () => {
    expect(isValidCpf('123.456.789')).toBe(false)
  })

  it('isValidCnpj accepts a valid CNPJ', () => {
    expect(isValidCnpj('11.222.333/0001-81')).toBe(true)
  })

  it('isValidCnpj rejects a wrong check digit', () => {
    expect(isValidCnpj('11.222.333/0001-82')).toBe(false)
  })

  it('isValidCnpj rejects repeated sequences', () => {
    expect(isValidCnpj('11.111.111/1111-11')).toBe(false)
  })

  it('isValidCnpj rejects values with the wrong length', () => {
    expect(isValidCnpj('11.222.333/0001')).toBe(false)
  })
})
