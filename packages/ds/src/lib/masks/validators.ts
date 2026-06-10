import { onlyDigits } from './masks'

const CPF_FIRST_WEIGHTS = [10, 9, 8, 7, 6, 5, 4, 3, 2]
const CPF_SECOND_WEIGHTS = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]
const CNPJ_FIRST_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
const CNPJ_SECOND_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

function isRepeatedSequence(digits: string): boolean {
  return /^(\d)\1*$/.test(digits)
}

function checkDigit(digits: string, weights: number[]): number {
  const sum = digits
    .split('')
    .reduce((acc, digit, i) => acc + Number(digit) * weights[i], 0)
  const remainder = sum % 11
  return remainder < 2 ? 0 : 11 - remainder
}

/** Valida CPF (11 dígitos) com cálculo de dígito verificador. */
export function isValidCpf(value: string): boolean {
  const digits = onlyDigits(value)
  if (digits.length !== 11 || isRepeatedSequence(digits)) return false

  const first = checkDigit(digits.slice(0, 9), CPF_FIRST_WEIGHTS)
  const second = checkDigit(digits.slice(0, 10), CPF_SECOND_WEIGHTS)

  return digits[9] === String(first) && digits[10] === String(second)
}

/** Valida CNPJ (14 dígitos) com cálculo de dígito verificador. */
export function isValidCnpj(value: string): boolean {
  const digits = onlyDigits(value)
  if (digits.length !== 14 || isRepeatedSequence(digits)) return false

  const first = checkDigit(digits.slice(0, 12), CNPJ_FIRST_WEIGHTS)
  const second = checkDigit(digits.slice(0, 13), CNPJ_SECOND_WEIGHTS)

  return digits[12] === String(first) && digits[13] === String(second)
}
