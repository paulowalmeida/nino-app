export type PasswordStrengthLevel = 'weak' | 'medium' | 'strong'

/**
 * Reads a password's strength from its length and from how many kinds of
 * character it mixes — lowercase, uppercase, digit, symbol.
 *
 * It is deliberately generous: the point is to nudge someone away from
 * `123456`, not to grade the password. Blocking what is merely weak sends
 * people to a sticky note.
 */
export const getPasswordStrength = (
  password: string
): { score: number; level: PasswordStrengthLevel } => {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  const level: PasswordStrengthLevel =
    score <= 1 ? 'weak' : score <= 4 ? 'medium' : 'strong'

  return { score, level }
}
