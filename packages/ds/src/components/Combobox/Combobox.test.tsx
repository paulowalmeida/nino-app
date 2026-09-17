import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Combobox } from './Combobox'

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C', disabled: true },
]

describe(Combobox.name, () => {
  it('renders the input', () => {
    render(<Combobox options={options} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('displays the placeholder', () => {
    render(<Combobox options={options} placeholder="Buscar..." />)
    expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument()
  })

  it('filters options as the user types', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    render(<Combobox options={options} />)
    await user.click(screen.getByRole('combobox'))
    await user.keyboard('a')
    expect(
      screen.getByRole('option', { name: 'Option A', hidden: true })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('option', { name: 'Option B', hidden: true })
    ).not.toBeInTheDocument()
  })

  it('keeps server-filtered options when local filtering is disabled', async () => {
    render(<Combobox options={options} shouldFilterOptions={false} />)

    await userEvent.type(screen.getByRole('combobox'), 'zzz')

    expect(
      screen.getByRole('option', { name: 'Option A', hidden: true })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: 'Option B', hidden: true })
    ).toBeInTheDocument()
  })

  it('displays empty message when no options match', async () => {
    render(<Combobox options={options} emptyMessage="Nada encontrado" />)
    await userEvent.type(screen.getByRole('combobox'), 'zzz')
    expect(screen.getByText('Nada encontrado')).toBeInTheDocument()
  })

  it('calls onValueChange when selecting an option', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    const onValueChange = vi.fn()
    render(<Combobox options={options} onValueChange={onValueChange} />)
    await user.click(screen.getByRole('combobox'))
    await user.keyboard('a')
    await user.keyboard('{ArrowDown}{Enter}')
    expect(onValueChange).toHaveBeenCalledWith('a')
  })

  it('uses the input label after selecting a detailed option', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    render(
      <Combobox
        options={[
          {
            value: '67143450',
            label: 'Travessa WE-69-A · Coqueiro · 67143-450',
            inputLabel: 'Travessa WE-69-A',
          },
        ]}
      />
    )

    const input = screen.getByRole('combobox')
    await user.click(input)
    await user.keyboard('{ArrowDown}{Enter}')

    expect(input).toHaveValue('Travessa WE-69-A')
  })

  it('does not call onInputValueChange when selection sets the input text', async () => {
    const onInputValueChange = vi.fn()
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    render(
      <Combobox
        options={[
          {
            value: '67143450',
            label: 'Travessa WE-69-A · Coqueiro · 67143-450',
            inputLabel: 'Travessa WE-69-A',
          },
        ]}
        onInputValueChange={onInputValueChange}
      />
    )

    const input = screen.getByRole('combobox')
    await user.click(input)
    await user.keyboard('we')
    onInputValueChange.mockClear()

    await user.keyboard('{ArrowDown}{Enter}')

    expect(onInputValueChange).not.toHaveBeenCalled()
  })

  it('applies error state when error is true', () => {
    render(<Combobox options={options} error />)
    expect(screen.getByRole('combobox')).toHaveAttribute('data-invalid')
  })

  it('does not apply error state by default', () => {
    render(<Combobox options={options} />)
    expect(screen.getByRole('combobox')).not.toHaveAttribute('data-invalid')
  })

  it.each(['sm', 'md', 'lg'] as const)(
    'renderiza tamanho %s sem erros',
    (size) => {
      render(<Combobox options={options} size={size} />)
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    }
  )

  it('forwards ref to the input element', () => {
    const ref = { current: null }
    render(<Combobox options={options} ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })
})
