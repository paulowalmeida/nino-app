import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { getPasswordStrength, PasswordStrength } from './PasswordStrength'

describe(PasswordStrength.name, () => {
  it('classifica senha curta como fraca', () => {
    expect(getPasswordStrength('abc').level).toBe('weak')
  })

  it('classifica senha com tamanho minimo como media', () => {
    expect(getPasswordStrength('abcdefgh').level).toBe('medium')
  })

  it('classifica senha com variedade de caracteres como forte', () => {
    expect(getPasswordStrength('Abcdefgh1!').level).toBe('strong')
  })

  it('renderiza o rotulo de senha fraca', () => {
    render(<PasswordStrength password="abc" />)
    expect(screen.getByText('Fraca')).toBeInTheDocument()
  })

  it('renderiza o rotulo de senha forte', () => {
    render(<PasswordStrength password="Abcdefgh1!" />)
    expect(screen.getByText('Forte')).toBeInTheDocument()
  })

  it('aplica className adicional', () => {
    const { container } = render(
      <PasswordStrength password="abc" className="opacity-50" />
    )
    expect(container.firstChild).toHaveClass('opacity-50')
  })
})
