import { onlyDigits } from '@ds/lib/masks/masks'

const CPF_FIRST_WEIGHTS = [10, 9, 8, 7, 6, 5, 4, 3, 2]
const CPF_SECOND_WEIGHTS = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]
const CNPJ_FIRST_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
const CNPJ_SECOND_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

const isRepeatedSequence = (digits: string): boolean => /^(\d)\1*$/.test(digits)

/**
 * The mod 11 rule both documents share: weighted sum, and a remainder below
 * two means the digit is zero rather than a negative leftover.
 */
const checkDigit = (digits: string, weights: number[]): number => {
  const sum = digits
    .split('')
    .reduce((acc, digit, i) => acc + Number(digit) * weights[i], 0)
  const remainder = sum % 11

  return remainder < 2 ? 0 : 11 - remainder
}

/**
 * Checks an 11 digit CPF against its two check digits.
 *
 * Repeated sequences are refused before the math because they satisfy it:
 * `111.111.111-11` computes to exactly the digits it carries, and so does
 * every other run of the same digit.
 */
export const isValidCpf = (value: string): boolean => {
  const digits = onlyDigits(value)
  if (digits.length !== 11 || isRepeatedSequence(digits)) return false

  const first = checkDigit(digits.slice(0, 9), CPF_FIRST_WEIGHTS)
  const second = checkDigit(digits.slice(0, 10), CPF_SECOND_WEIGHTS)

  return digits[9] === String(first) && digits[10] === String(second)
}

/**
 * Checks a 14 digit CNPJ against its two check digits. Repeated sequences
 * are refused for the same reason as in `isValidCpf`.
 */
export const isValidCnpj = (value: string): boolean => {
  const digits = onlyDigits(value)
  if (digits.length !== 14 || isRepeatedSequence(digits)) return false

  const first = checkDigit(digits.slice(0, 12), CNPJ_FIRST_WEIGHTS)
  const second = checkDigit(digits.slice(0, 13), CNPJ_SECOND_WEIGHTS)

  return digits[12] === String(first) && digits[13] === String(second)
}
