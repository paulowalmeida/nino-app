import { mergeClasses } from '@ds/lib/mergeClasses'

import {
  PasswordStrengthLevel,
  PasswordStrengthProps,
} from './PasswordStrength.types'

const labels: Record<PasswordStrengthLevel, string> = {
  weak: 'Fraca',
  medium: 'Média',
  strong: 'Forte',
}

const fillClasses: Record<PasswordStrengthLevel, string> = {
  weak: 'bg-red-500',
  medium: 'bg-yellow-500',
  strong: 'bg-green-500',
}

const textClasses: Record<PasswordStrengthLevel, string> = {
  weak: 'text-red-600',
  medium: 'text-yellow-600',
  strong: 'text-green-600',
}

const segmentsByLevel: Record<PasswordStrengthLevel, number> = {
  weak: 1,
  medium: 2,
  strong: 3,
}

const baseTrack = 'h-1.5 flex-1 rounded-full bg-gray-200 overflow-hidden'
const baseFill = 'h-full w-full rounded-full transition-colors duration-300'

/**
 * Computes password strength from length (8-16) and character
 * variety (lowercase, uppercase, number, symbol).
 */
export function getPasswordStrength(password: string): {
  score: number
  level: PasswordStrengthLevel
} {
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

/**
 * Visual indicator of password strength (fraca/média/forte) based on
 * length and character variety.
 *
 * @param password - Password value to evaluate
 *
 * @param className - Additional CSS classes
 *
 * @example
 * <PasswordStrength password={password} />
 */
export function PasswordStrength({
  password,
  className,
}: PasswordStrengthProps) {
  const { level } = getPasswordStrength(password)
  const filled = segmentsByLevel[level]

  return (
    <div className={mergeClasses('w-full mt-1', className)}>
      <div
        className="flex gap-1.5"
        role="meter"
        aria-label="Força da senha"
        aria-valuenow={filled}
        aria-valuemin={0}
        aria-valuemax={3}
      >
        {[0, 1, 2].map((i) => (
          <div key={i} className={baseTrack}>
            {i < filled && (
              <div className={mergeClasses(baseFill, fillClasses[level])} />
            )}
          </div>
        ))}
      </div>
      <span className={mergeClasses('mt-1 text-xs', textClasses[level])}>
        {labels[level]}
      </span>
    </div>
  )
}
