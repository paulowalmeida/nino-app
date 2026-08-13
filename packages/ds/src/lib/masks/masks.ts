/* Formatting masks for Brazilian fields. Pure functions that take the raw
 * value and format it progressively, so they hold up while someone is still
 * typing: every intermediate length has to read well, not only the complete
 * one. Clean the value with `onlyDigits` before sending it. */

/** Drops everything that is not a digit, including the mask's own symbols. */
export const onlyDigits = (value: string): string => value.replace(/\D/g, '')

/** (00) 0000-0000 for a landline, (00) 00000-0000 for a mobile. */
export const maskPhone = (value: string): string => {
  const digits = onlyDigits(value).slice(0, 11)

  /* The ninth digit is what tells the two apart, and it only exists once the
   * number is complete — up to ten digits the landline shape is the one that
   * keeps the typing readable. */
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }

  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
}

/** 000.000.000-00 */
export const maskCpf = (value: string): string =>
  onlyDigits(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')

/** 00000-000 */
export const maskZipCode = (value: string): string =>
  onlyDigits(value)
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, '$1-$2')

/** 00.000.000/0000-00 */
export const maskCnpj = (value: string): string =>
  onlyDigits(value)
    .slice(0, 14)
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
