import { Button } from '@nino/ds/components/Button'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { FormBuilder } from './FormBuilder'
import { FieldConfig } from './types'

const schema: FieldConfig[] = [
  {
    name: 'nome',
    type: 'text',
    label: 'Nome',
    required: true,
    rules: { required: 'Nome obrigatório' },
  },
  {
    name: 'categoria',
    type: 'select',
    label: 'Categoria',
    options: [
      { value: 'a', label: 'Alimento' },
      { value: 'b', label: 'Bebida' },
    ],
  },
  { name: 'ativo', type: 'switch', label: 'Ativo' },
]

describe(FormBuilder.name, () => {
  it('renders every field of the schema with its label', () => {
    // Arrange / Act
    render(<FormBuilder schema={schema} onSubmit={vi.fn()} />)

    // Assert
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()
    expect(screen.getByText('Categoria')).toBeInTheDocument()
    expect(screen.getByText('Ativo')).toBeInTheDocument()
  })

  it('lays a switch out with the label beside the control', () => {
    // Arrange / Act
    render(<FormBuilder schema={schema} onSubmit={vi.fn()} />)

    // Assert
    const label = screen.getByText('Ativo')
    const row = label.parentElement
    expect(row?.firstElementChild).toContainElement(
      row?.querySelector('[data-part="control"]') as HTMLElement
    )
    expect(row?.lastElementChild).toBe(label)
  })

  it('fills the fields the schema declares as default values', () => {
    // Arrange / Act
    render(
      <FormBuilder
        schema={schema}
        defaultValues={{ nome: 'Coxinha' }}
        onSubmit={vi.fn()}
      />
    )

    // Assert
    expect(screen.getByLabelText(/nome/i)).toHaveValue('Coxinha')
  })

  it('blocks the submit while a required rule fails', async () => {
    // Arrange
    const onSubmit = vi.fn()
    render(<FormBuilder schema={schema} onSubmit={onSubmit} />)

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    // Assert
    expect(await screen.findByText('Nome obrigatório')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('ties the error to its own input, not to the form', async () => {
    // Arrange
    render(<FormBuilder schema={schema} onSubmit={vi.fn()} />)

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))
    await screen.findByText('Nome obrigatório')

    // Assert
    expect(screen.getByLabelText(/nome/i)).toHaveAttribute(
      'aria-invalid',
      'true'
    )
  })

  it('hands the filled values over on submit', async () => {
    // Arrange
    const onSubmit = vi.fn()
    render(<FormBuilder schema={schema} onSubmit={onSubmit} />)

    // Act
    await userEvent.type(screen.getByLabelText(/nome/i), 'Pão de queijo')
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    // Assert
    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ nome: 'Pão de queijo' })
  })

  it('renders the default button with the label it was given', () => {
    // Arrange / Act
    render(
      <FormBuilder
        schema={schema}
        onSubmit={vi.fn()}
        submitLabel="Criar produto"
      />
    )

    // Assert
    expect(
      screen.getByRole('button', { name: 'Criar produto' })
    ).toBeInTheDocument()
  })

  it('drops the default button when a footer takes over', async () => {
    // Arrange
    const onSubmit = vi.fn()
    render(
      <FormBuilder
        schema={schema}
        onSubmit={onSubmit}
        footer={() => <Button type="submit">Confirmar</Button>}
      />
    )

    // Act
    await userEvent.type(screen.getByLabelText(/nome/i), 'Brigadeiro')
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar' }))

    // Assert
    expect(screen.queryByRole('button', { name: 'Salvar' })).toBeNull()
    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ nome: 'Brigadeiro' })
  })

  it('clears what was typed when the footer calls reset', async () => {
    // Arrange
    render(
      <FormBuilder
        schema={schema}
        onSubmit={vi.fn()}
        footer={({ reset }) => (
          <Button type="button" onClick={() => reset()}>
            Cancelar
          </Button>
        )}
      />
    )
    const nome = screen.getByLabelText(/nome/i)

    // Act
    await userEvent.type(nome, 'Texto')
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    // Assert
    expect(nome).toHaveValue('')
  })

  it('hands the footer the form state it needs to guard the submit', () => {
    // Arrange / Act
    render(
      <FormBuilder
        schema={schema}
        onSubmit={vi.fn()}
        footer={({ formState }) => (
          <Button type="submit" disabled={!formState.isDirty}>
            Confirmar
          </Button>
        )}
      />
    )

    // Assert
    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeDisabled()
  })

  it('renders no field at all when the schema is empty', () => {
    // Arrange / Act
    const { container } = render(<FormBuilder schema={[]} onSubmit={vi.fn()} />)

    // Assert
    expect(container.querySelectorAll('input')).toHaveLength(0)
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument()
  })
})
