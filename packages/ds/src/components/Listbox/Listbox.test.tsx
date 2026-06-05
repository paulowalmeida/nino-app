import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Listbox } from './Listbox'

const options = [
  { value: 'pix', label: 'Pix' },
  { value: 'credit', label: 'Cartão' },
]

describe(Listbox.name, () => {
  it('renders all options', () => {
    render(<Listbox options={options} />)
    expect(screen.getByText('Pix')).toBeInTheDocument()
    expect(screen.getByText('Cartão')).toBeInTheDocument()
  })

  it('renders the label', () => {
    render(<Listbox options={options} label="Pagamento" />)
    expect(screen.getByText('Pagamento')).toBeInTheDocument()
  })

  it('fires onValueChange with the selected value', async () => {
    const onValueChange = vi.fn()
    render(<Listbox options={options} onValueChange={onValueChange} />)
    await userEvent.click(screen.getByText('Pix'))
    expect(onValueChange).toHaveBeenCalledWith(['pix'])
  })
})
