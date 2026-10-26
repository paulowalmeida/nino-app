import { describe, expect, it } from 'vitest'

import {
  ACCOUNT_FIELD_RULES,
  COMPANY_FIELD_RULES,
} from './register-field-rules'
import { registerFieldRulesMock } from './register-field-rules.mock'

describe('register field rules', () => {
  it('accepts valid CPF and rejects invalid CPF', () => {
    expect(
      ACCOUNT_FIELD_RULES.cpf.validate(registerFieldRulesMock.validCpf)
    ).toBe(true)
    expect(
      ACCOUNT_FIELD_RULES.cpf.validate(registerFieldRulesMock.invalidCpf)
    ).toBe('CPF inválido')
  })

  it('accepts valid CNPJ and rejects invalid CNPJ', () => {
    expect(
      COMPANY_FIELD_RULES.cnpj.validate(registerFieldRulesMock.validCnpj)
    ).toBe(true)
    expect(
      COMPANY_FIELD_RULES.cnpj.validate(registerFieldRulesMock.invalidCnpj)
    ).toBe('CNPJ inválido')
  })

  it('keeps the password length contract', () => {
    expect(ACCOUNT_FIELD_RULES.password.required).toBe('Informe a senha')
    expect(ACCOUNT_FIELD_RULES.password.minLength?.value).toBe(8)
    expect(ACCOUNT_FIELD_RULES.password.maxLength?.value).toBe(16)
  })
})
