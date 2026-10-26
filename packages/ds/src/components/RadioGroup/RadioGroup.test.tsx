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

  it('renders the description of an option', () => {
    render(
      <RadioGroup
        variant="card"
        options={[
          {
            value: 'DELIVERY',
            label: 'Entrega',
            description: 'Chega em 40min',
          },
        ]}
      />
    )
    expect(screen.getByText('Chega em 40min')).toBeInTheDocument()
  })

  it('omits the description when the option has none', () => {
    const { container } = render(
      <RadioGroup
        variant="card"
        options={[{ value: 'a', label: 'Só rótulo' }]}
      />
    )
    expect(screen.getByText('Só rótulo')).toBeInTheDocument()
    expect(container.textContent).toBe('Só rótulo')
  })

  it('ignores the description in the default variant', () => {
    render(
      <RadioGroup options={[{ value: 'a', label: 'A', description: 'nota' }]} />
    )
    expect(screen.queryByText('nota')).not.toBeInTheDocument()
  })

  it('renders an optional trailing value on row options', () => {
    render(
      <RadioGroup options={[{ value: 'a', label: 'A', trailing: 'R$ 4,00' }]} />
    )

    expect(screen.getByText('R$ 4,00')).toBeInTheDocument()
  })

  it('selects a card option by click', async () => {
    const onValueChange = vi.fn()
    render(
      <RadioGroup
        variant="card"
        options={[
          { value: 'PICKUP', label: 'Retirada', description: 'Busque na loja' },
        ]}
        onValueChange={onValueChange}
      />
    )
    await userEvent.click(screen.getByLabelText('Retirada'))
    expect(onValueChange).toHaveBeenCalledWith('PICKUP')
  })

  it('takes an accessible name from aria-label', () => {
    render(<RadioGroup options={options} aria-label="Forma de pagamento" />)
    expect(
      screen.getByRole('radiogroup', { name: 'Forma de pagamento' })
    ).toBeInTheDocument()
  })
})
