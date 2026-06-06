import { maskCpf } from '@ds/lib/masks/masks'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { MaskedInput } from './MaskedInput'

describe(MaskedInput.name, () => {
  it('formats the value as the user types', async () => {
    render(<MaskedInput mask={maskCpf} aria-label="cpf" />)
    const input = screen.getByLabelText('cpf')
    await userEvent.type(input, '12345678901')
    expect(input).toHaveValue('123.456.789-01')
  })

  it('propagates the formatted value through onChange (register)', async () => {
    const onChange = vi.fn()
    render(<MaskedInput mask={maskCpf} aria-label="cpf" onChange={onChange} />)
    await userEvent.type(screen.getByLabelText('cpf'), '123')
    const last = onChange.mock.calls.at(-1)?.[0]
    expect(last.target.value).toBe('123')
  })

  it('forwards the ref to the input', () => {
    const ref = { current: null as HTMLInputElement | null }
    render(<MaskedInput mask={maskCpf} ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })
})
