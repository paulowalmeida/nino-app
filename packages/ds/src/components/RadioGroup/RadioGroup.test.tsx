import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { RadioGroup } from './RadioGroup'

const options = [
  { value: 'a', label: 'Opção A' },
  { value: 'b', label: 'Opção B' },
  { value: 'c', label: 'Opção C', disabled: true },
]

describe(RadioGroup.name, () => {
  it('renders all options', () => {
    render(<RadioGroup options={options} />)
    expect(screen.getByLabelText('Opção A')).toBeInTheDocument()
    expect(screen.getByLabelText('Opção B')).toBeInTheDocument()
    expect(screen.getByLabelText('Opção C')).toBeInTheDocument()
  })

  it('selects option on click', async () => {
    const onValueChange = vi.fn()
    render(<RadioGroup options={options} onValueChange={onValueChange} />)
    await userEvent.click(screen.getByLabelText('Opção A'))
    expect(onValueChange).toHaveBeenCalledWith('a')
  })

  it('reflects the controlled value', () => {
    render(<RadioGroup options={options} value="b" onValueChange={vi.fn()} />)
    expect(screen.getByLabelText('Opção B')).toBeChecked()
  })

  it('disabled option does not fire onValueChange', async () => {
    const onValueChange = vi.fn()
    render(<RadioGroup options={options} onValueChange={onValueChange} />)
    await userEvent.click(screen.getByLabelText('Opção C'))
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('renders horizontal orientation without errors', () => {
    render(<RadioGroup options={options} orientation="horizontal" />)
    expect(screen.getByRole('radiogroup')).toBeInTheDocument()
  })
})
